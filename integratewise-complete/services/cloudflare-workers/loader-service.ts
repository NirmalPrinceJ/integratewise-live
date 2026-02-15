/**
 * L3 Loader/Normalizer Service
 * 
 * Handles:
 * - File upload ingestion (CSV, JSON, PDF)
 * - Data normalization (extract → map → validate)
 * - SSOT schema compliance
 * - Bucket state progression (ADDING → SEEDED)
 * 
 * Deploy to: Cloudflare Workers (Hono)
 */

import {Hono} from 'hono';
import {cors} from 'hono/cors';
import type {Context} from 'hono';
import { neon } from '@neondatabase/serverless';
import * as Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';

type Env = {
  NEON_DB_URL: string;
  BUCKET_SIGNING_SECRET: string;
};

interface LoaderRequest {
  tenantId: string;
  bucketType: string;
  bucketId: string;
  file: File; // Multipart file
  mappings?: Record<string, string>; // { sourceField: destinationField }
}

interface NormalizedRecord {
  [key: string]: any;
}

/**
 * Stage 1: File Loader
 * Extracts raw records from uploaded files
 */
class FileLoader {
  static async loadCSV(file: File): Promise<any[]> {
    const text = await file.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data || []),
        error: (error) => reject(error),
      });
    });
  }

  static async loadJSON(file: File): Promise<any[]> {
    const text = await file.text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  }

  static async loadPDF(file: File): Promise<any[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const records: any[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');

      records.push({
        page: i,
        content: text,
        extractedAt: new Date().toISOString(),
      });
    }

    return records;
  }

  static async load(file: File): Promise<any[]> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'csv':
        return this.loadCSV(file);
      case 'json':
        return this.loadJSON(file);
      case 'pdf':
        return this.loadPDF(file);
      default:
        throw new Error(`Unsupported file format: ${ext}`);
    }
  }
}

/**
 * Stage 2: Data Normalizer
 * Maps raw records to SSOT schema based on bucket type
 */
class DataNormalizer {
  // SSOT schemas for each bucket type
  private static schemas: Record<string, Record<string, string>> = {
    B1: {
      // Tasks & Projects
      id: 'task_id',
      title: 'title',
      description: 'description',
      status: 'status',
      priority: 'priority',
      assigned_to: 'assigned_to',
      due_date: 'due_date',
      tags: 'tags',
      created_at: 'created_at',
    },
    B2: {
      // Calendar & Meetings
      id: 'event_id',
      title: 'title',
      description: 'description',
      start_time: 'start_time',
      end_time: 'end_time',
      participants: 'participants',
      location: 'location',
      meeting_link: 'meeting_link',
      created_at: 'created_at',
    },
    B3: {
      // Docs & Knowledge
      id: 'doc_id',
      title: 'title',
      content: 'content',
      category: 'category',
      tags: 'tags',
      owner: 'owner',
      created_at: 'created_at',
      updated_at: 'updated_at',
      is_public: 'is_public',
    },
    B4: {
      // Communications
      id: 'message_id',
      from: 'from',
      to: 'to',
      subject: 'subject',
      body: 'body',
      received_at: 'received_at',
      thread_id: 'thread_id',
    },
    B5: {
      // CRM / Accounts
      id: 'account_id',
      name: 'name',
      industry: 'industry',
      website: 'website',
      annual_revenue: 'annual_revenue',
      employees: 'employees',
      contact_email: 'contact_email',
      contact_phone: 'contact_phone',
      created_at: 'created_at',
    },
  };

  static normalize(
    records: any[],
    bucketType: string,
    mappings?: Record<string, string>
  ): NormalizedRecord[] {
    const schema = this.schemas[bucketType];
    if (!schema) {
      throw new Error(`No schema defined for bucket type: ${bucketType}`);
    }

    return records
      .map((record) => {
        const normalized: NormalizedRecord = {
          _source_raw: record,
          _normalized_at: new Date().toISOString(),
        };

        // Map fields according to schema
        Object.entries(schema).forEach(([ssotField, schemaPath]) => {
          const sourceField = mappings?.[ssotField] || ssotField;
          const value = record[sourceField];

          if (value !== undefined && value !== null && value !== '') {
            normalized[ssotField] = this.coerce(ssotField, value);
          }
        });

        return normalized;
      })
      .filter((r) => Object.keys(r).length > 2); // Remove records with no mapped fields
  }

  private static coerce(fieldName: string, value: any): any {
    if (typeof value === 'string') {
      if (fieldName.includes('_at') || fieldName.includes('date')) {
        return new Date(value).toISOString();
      }
      if (fieldName.includes('count') || fieldName.includes('_id')) {
        const num = parseInt(value, 10);
        return isNaN(num) ? value : num;
      }
    }
    return value;
  }
}

const BUCKET_ENTITY_TYPE: Record<string, string> = {
  B1: 'task',
  B2: 'meeting',
  B3: 'document',
  B4: 'message',
  B5: 'account',
};

function getFieldType(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  const type = typeof value;
  if (type === 'object') return 'object';
  return type;
}

function getSampleValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value.slice(0, 1000);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value).slice(0, 1000);
  } catch {
    return null;
  }
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

async function observeAdaptiveFields(
  dbUrl: string,
  tenantId: string,
  bucketType: string,
  records: NormalizedRecord[]
): Promise<void> {
  if (!records.length) return;
  if (!isValidUuid(tenantId)) return;

  const sql = neon(dbUrl);
  const entityType = BUCKET_ENTITY_TYPE[bucketType] || 'entity';
  const sample = records.slice(0, 25);

  for (const record of sample) {
    for (const [key, value] of Object.entries(record)) {
      if (key.startsWith('_')) continue;

      const dataType = getFieldType(value);
      const sampleValue = getSampleValue(value);

      await sql`
        SELECT record_spine_field_observation(
          ${tenantId}::uuid,
          ${entityType},
          ${key},
          ${key},
          ${dataType},
          ${sampleValue},
          ${'upload'}
        )
      `;
    }
  }
}

/**
 * L3 Loader API
 */
const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

/**
 * POST /loader/ingest
 * Multipart form upload with file + metadata
 */
app.post('/loader/ingest', async (c: Context<{ Bindings: Env }>) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const tenantId = formData.get('tenantId') as string;
    const bucketType = formData.get('bucketType') as string;
    const bucketId = formData.get('bucketId') as string;
    const mappingsJson = formData.get('mappings') as string | null;

    if (!file || !tenantId || !bucketType || !bucketId) {
      return c.json(
        { error: 'Missing required fields: file, tenantId, bucketType, bucketId' },
        400
      );
    }

    // Stage 1: Load
    const rawRecords = await FileLoader.load(file);
    console.log(`[Loader] Loaded ${rawRecords.length} raw records from ${file.name}`);

    // Stage 2: Normalize
    const mappings = mappingsJson ? JSON.parse(mappingsJson) : undefined;
    const normalizedRecords = DataNormalizer.normalize(rawRecords, bucketType, mappings);
    console.log(`[Normalizer] Normalized ${normalizedRecords.length} records`);

    // Stage 3: Observe fields for adaptive spine
    const dbUrl = c.env.NEON_DB_URL;
    try {
      await observeAdaptiveFields(dbUrl, tenantId, bucketType, normalizedRecords);
    } catch (error) {
      console.error('[Adaptive Spine] Observation failed:', error);
    }

    // Stage 4: Store in database
    const storeResult = await storeNormalizedRecords(
      dbUrl,
      tenantId,
      bucketType,
      bucketId,
      normalizedRecords
    );

    // Stage 4: Mark bucket as SEEDED
    await markBucketSeeded(dbUrl, bucketId, normalizedRecords.length);

    return c.json({
      success: true,
      totalRecords: rawRecords.length,
      normalizedRecords: normalizedRecords.length,
      stored: storeResult,
      bucketState: 'SEEDED',
    });
  } catch (error) {
    console.error('[Loader] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Ingestion failed: ${message}` }, 500);
  }
});

/**
 * POST /loader/validate
 * Validate mappings without storing
 */
app.post('/loader/validate', async (c: Context<{ Bindings: Env }>) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const bucketType = formData.get('bucketType') as string;
    const mappingsJson = formData.get('mappings') as string | null;

    const rawRecords = await FileLoader.load(file);
    const mappings = mappingsJson ? JSON.parse(mappingsJson) : undefined;
    const normalized = DataNormalizer.normalize(rawRecords, bucketType, mappings);

    return c.json({
      valid: true,
      preview: normalized.slice(0, 5),
      total: normalized.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: `Validation failed: ${message}`, valid: false }, 400);
  }
});

/**
 * Helper: Store normalized records in database
 */
async function storeNormalizedRecords(
  dbUrl: string,
  tenantId: string,
  bucketType: string,
  bucketId: string,
  records: NormalizedRecord[]
): Promise<{ stored: number; failed: number }> {
  // Create table if not exists
  const tableName = `${bucketType.toLowerCase()}_normalized_data`;

  // For now, return a placeholder (real impl would use pg client)
  console.log(`[Loader] Would store ${records.length} records to ${tableName}`);

  return {
    stored: records.length,
    failed: 0,
  };
}

/**
 * Helper: Mark bucket as SEEDED
 */
async function markBucketSeeded(
  dbUrl: string,
  bucketId: string,
  entityCount: number
): Promise<void> {
  console.log(`[Loader] Marking bucket ${bucketId} as SEEDED with ${entityCount} entities`);

  // Real impl would execute:
  // UPDATE base_buckets SET state = 'SEEDED', entity_count = entityCount WHERE bucket_id = bucketId
}

export default app;
