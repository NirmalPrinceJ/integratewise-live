/**
 * L3 Spine API Client
 * Connects L0 (Onboarding) and L1 (Workspace) to L3 (Adaptive Spine v2)
 */

const SPINE_BASE_URL = process.env.NEXT_PUBLIC_SPINE_V2_URL || 'https://api.integratewise.ai/v2/spine'

export interface SpineEntity {
  id: string
  tenant_id: string
  entity_type: string
  category: string
  data: Record<string, any>
  created_at: string
  updated_at: string
  completeness_score?: number
  fields_present?: number
  fields_expected?: number
}

export interface IngestPayload {
  tenant_id: string
  entity_type: string
  category?: 'business' | 'team' | 'intelligence'
  data: Record<string, any>
  source_system?: string
  layer_level?: 1 | 2 | 3
}

export interface IngestResponse {
  success: boolean
  entity_id: string
  created_at: string
  fields_observed: number
  fields: string[]
}

export interface CompletenessScore {
  entity_id: string
  entity_type: string
  layer_level: number
  fields_present: number
  fields_expected: number
  completeness_score: number
  missing_required: string[]
  missing_expected: string[]
  last_calculated_at: string
}

export interface SchemaField {
  field_key: string
  field_path: string
  data_type: string
  status: 'observed' | 'required' | 'optional'
  occurrence_count: number
  sample_value: string
  first_seen_at: string
  last_seen_at: string
}

class SpineClient {
  private baseUrl: string

  constructor(baseUrl = SPINE_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * L0 → L3: Ingest entity from onboarding or file upload
   */
  async ingest(payload: IngestPayload): Promise<IngestResponse> {
    const response = await fetch(`${this.baseUrl}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Spine ingestion failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * L3 → L2: Get entity with completeness for cognitive analysis
   */
  async getEntity(entityId: string): Promise<SpineEntity> {
    const response = await fetch(`${this.baseUrl}/entities/${entityId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch entity: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * L3 → L1: List entities for workspace display
   */
  async listEntities(params: {
    tenant_id: string
    entity_type?: string
    limit?: number
    offset?: number
  }): Promise<{ entities: SpineEntity[]; count: number; limit: number; offset: number }> {
    const searchParams = new URLSearchParams({
      tenant_id: params.tenant_id,
      ...(params.entity_type && { entity_type: params.entity_type }),
      ...(params.limit && { limit: params.limit.toString() }),
      ...(params.offset && { offset: params.offset.toString() }),
    })

    const response = await fetch(`${this.baseUrl}/entities?${searchParams}`)

    if (!response.ok) {
      throw new Error(`Failed to list entities: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * L3 → L2: Get completeness score for cognitive insights
   */
  async getCompleteness(entityId: string): Promise<CompletenessScore> {
    const response = await fetch(`${this.baseUrl}/completeness/${entityId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch completeness: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * L3 → L2: Get discovered schema for entity type
   */
  async getSchema(params: {
    entity_type: string
    tenant_id?: string
  }): Promise<{ entity_type: string; fields_discovered: number; fields: SchemaField[] }> {
    const searchParams = new URLSearchParams({
      entity_type: params.entity_type,
      ...(params.tenant_id && { tenant_id: params.tenant_id }),
    })

    const response = await fetch(`${this.baseUrl}/schema?${searchParams}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * L3 → L1: Get department streams
   */
  async getStreams(tenant_id?: string): Promise<{
    tenant_id: string
    streams_count: number
    streams: Array<{
      stream_key: string
      display_name: string
      description: string
      category: string
      scope: string
    }>
  }> {
    const searchParams = tenant_id ? `?tenant_id=${tenant_id}` : ''
    const response = await fetch(`${this.baseUrl}/streams${searchParams}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch streams: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`)
    return response.json()
  }
}

// Singleton instance
export const spineClient = new SpineClient()

// Helper: Parse CSV and bulk ingest
export async function ingestCSV(params: {
  tenant_id: string
  entity_type: string
  category?: string
  csvData: string[][]
  source_system?: string
}): Promise<IngestResponse[]> {
  const [headers, ...rows] = params.csvData
  const results: IngestResponse[] = []

  for (const row of rows) {
    const data: Record<string, any> = {}
    headers.forEach((header, index) => {
      data[header] = row[index]
    })

    try {
      const result = await spineClient.ingest({
        tenant_id: params.tenant_id,
        entity_type: params.entity_type,
        category: params.category || 'business',
        data,
        source_system: params.source_system || 'csv_upload',
        layer_level: 3, // L3 = truth layer
      })
      results.push(result)
    } catch (error) {
      console.error('Failed to ingest row:', error)
    }
  }

  return results
}
