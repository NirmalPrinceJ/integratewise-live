// src/services/ingestion/pipeline-stages.ts
// 8-Stage Universal Ingestion Pipeline Implementation
// Integrates with tool-mappings.ts for deterministic classification

import { getToolMapping, classifyPayload, DataKind, Domain, Sensitivity } from './tool-mappings';
import { ObservabilityService } from '../monitoring/observability-service';

// ==========================================
// STAGE INTERFACES
// ==========================================

export interface RawPayload {
  source_tool: string;
  tenant_id: string;
  user_id?: string;
  connector_id: string;
  received_at: number;
  raw_data: any;
  metadata?: Record<string, any>;
}

// Stage 1: Analyzer Output
export interface AnalyzerOutput {
  fingerprint_hash: string;
  mime_type?: string;
  source_tool: string;
  tenant_id: string;
  user_id?: string;
  connector_id: string;
  envelope: {
    source: string;
    received_at: number;
    raw_payload_ref: string; // Reference to stored raw payload
    metadata: Record<string, any>;
  };
}

// Stage 2: Classifier Output
export interface ClassifierOutput extends AnalyzerOutput {
  data_kind: DataKind;
  domain: Domain;
  sensitivity: Sensitivity;
  entity_hints: string[];
  payload_type?: string; // e.g., 'Account', 'message', 'file'
}

// Stage 3: Filter Output
export interface FilterOutput extends ClassifierOutput {
  allowed: boolean;
  redactions: string[]; // Fields to redact
  dedup_key: string;
  quota_ok: boolean;
  filter_reasons?: string[];
}

// Stage 4: Refiner Output
export interface RefinerOutput extends FilterOutput {
  units: ProcessingUnit[]; // Split into minimal processing units
  ref_candidates: Record<string, any>; // Extracted ID candidates
}

export interface ProcessingUnit {
  unit_id: string;
  data: any;
  type: string;
}

// Stage 5: Extractor Output (Triple Stream)
export interface ExtractorOutput extends RefinerOutput {
  structured_entities: StructuredEntity[];
  unstructured_blobs: UnstructuredBlob[];
  files: FileReference[];
  ai_sessions: AISession[];
}

export interface StructuredEntity {
  entity_type: string;
  entity_id: string;
  data: Record<string, any>;
  relationships: Record<string, any>;
}

export interface UnstructuredBlob {
  blob_id: string;
  text: string;
  metadata: Record<string, any>;
}

export interface FileReference {
  file_id: string;
  original_url?: string;
  stored_path: string;
  extracted_text?: string;
  mime_type: string;
}

export interface AISession {
  session_id: string;
  turns: AITurn[];
  summary?: string;
  memory_candidates: string[];
}

export interface AITurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Stage 6: Validator Output
export interface ValidatorOutput extends ExtractorOutput {
  validation_errors: ValidationError[];
  confidence_score: number; // 0-1
  trust_score: number; // 0-1 (source + extraction reliability)
  evidence_refs: EvidenceRef[];
}

export interface ValidationError {
  field: string;
  error: string;
  severity: 'error' | 'warning';
}

export interface EvidenceRef {
  type: 'source' | 'extraction' | 'transformation';
  ref_id: string;
  description: string;
}

// Stage 7: Split Router Output
export interface SplitRouterOutput extends ValidatorOutput {
  write_plan: {
    spine: boolean;
    context: boolean;
    knowledge: boolean;
    memory: boolean;
  };
  routing_reasons: string[];
}

// Stage 8: Writers Output
export interface WritersOutput {
  spine_entity_ids: string[];
  context_ids: string[];
  chunk_ids: string[];
  memory_ids: string[];
  audit_log_id: string;
  events_published: string[];
}

// ==========================================
// STAGE 1: ANALYZER
// ==========================================

export class AnalyzerStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async analyze(payload: RawPayload): Promise<AnalyzerOutput> {
    const traceId = this.observability.startTrace('analyzer_stage');

    try {
      // Generate fingerprint
      const fingerprint_hash = this.generateFingerprint(payload);
      
      // Detect MIME type if applicable
      const mime_type = this.detectMimeType(payload);
      
      // Create canonical envelope
      const envelope = {
        source: payload.source_tool,
        received_at: payload.received_at,
        raw_payload_ref: `raw/${payload.tenant_id}/${fingerprint_hash}`,
        metadata: {
          ...payload.metadata,
          connector_id: payload.connector_id,
          user_id: payload.user_id,
        },
      };

      this.observability.incrementCounter('analyzer_processed', {
        source: payload.source_tool,
      });

      return {
        fingerprint_hash,
        mime_type,
        source_tool: payload.source_tool,
        tenant_id: payload.tenant_id,
        user_id: payload.user_id,
        connector_id: payload.connector_id,
        envelope,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private generateFingerprint(payload: RawPayload): string {
    // Generate hash based on content + source + timestamp
    const content = JSON.stringify(payload.raw_data);
    return `${payload.source_tool}_${payload.tenant_id}_${Date.now()}_${content.length}`;
  }

  private detectMimeType(payload: RawPayload): string | undefined {
    // Detect MIME type from payload if it's a file
    if (payload.raw_data?.mimeType) return payload.raw_data.mimeType;
    if (payload.raw_data?.type) return payload.raw_data.type;
    return undefined;
  }
}

// ==========================================
// STAGE 2: CLASSIFIER
// ==========================================

export class ClassifierStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async classify(input: AnalyzerOutput): Promise<ClassifierOutput> {
    const traceId = this.observability.startTrace('classifier_stage');

    try {
      // Get tool mapping
      const mapping = getToolMapping(input.source_tool);
      if (!mapping) {
        throw new Error(`No mapping found for tool: ${input.source_tool}`);
      }

      // Detect payload type (e.g., 'Account', 'message', 'file')
      const payload_type = this.detectPayloadType(input.envelope.metadata);

      // Get specific classification or use defaults
      const classification = classifyPayload(input.source_tool, payload_type || '') || {
        data_kind: mapping.default_data_kind,
        domain: mapping.default_domain[0],
        entity_hints: mapping.entity_hints.map(h => h.type),
        sensitivity: mapping.default_sensitivity,
      };

      this.observability.incrementCounter('classifier_processed', {
        source: input.source_tool,
        data_kind: classification.data_kind,
        domain: classification.domain,
      });

      return {
        ...input,
        data_kind: classification.data_kind,
        domain: classification.domain,
        sensitivity: classification.sensitivity || mapping.default_sensitivity,
        entity_hints: classification.entity_hints,
        payload_type,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private detectPayloadType(metadata: Record<string, any>): string | undefined {
    // Extract object type from metadata
    return metadata.object_type || metadata.type || metadata.kind;
  }
}

// ==========================================
// STAGE 3: FILTER
// ==========================================

export class FilterStage {
  private observability: ObservabilityService;
  private dedupCache: Map<string, number> = new Map();

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async filter(input: ClassifierOutput): Promise<FilterOutput> {
    const traceId = this.observability.startTrace('filter_stage');

    try {
      const filter_reasons: string[] = [];

      // 1. RBAC/Policy Gate
      const allowed = await this.checkPolicy(input);
      if (!allowed) {
        filter_reasons.push('Policy violation');
      }

      // 2. Field redaction based on sensitivity
      const redactions = this.getRedactionFields(input);

      // 3. Deduplication check
      const dedup_key = this.generateDedupKey(input);
      const isDuplicate = this.checkDuplicate(dedup_key);
      if (isDuplicate) {
        filter_reasons.push('Duplicate payload');
      }

      // 4. Rate/Quota check
      const quota_ok = await this.checkQuota(input);
      if (!quota_ok) {
        filter_reasons.push('Quota exceeded');
      }

      const finalAllowed = allowed && !isDuplicate && quota_ok;

      this.observability.incrementCounter('filter_processed', {
        source: input.source_tool,
        allowed: String(finalAllowed),
      });

      return {
        ...input,
        allowed: finalAllowed,
        redactions,
        dedup_key,
        quota_ok,
        filter_reasons: filter_reasons.length > 0 ? filter_reasons : undefined,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private async checkPolicy(input: ClassifierOutput): Promise<boolean> {
    // Check RBAC policies
    // In production, this would check against policy store
    return true;
  }

  private getRedactionFields(input: ClassifierOutput): string[] {
    const redactions: string[] = [];
    
    // Redact sensitive fields based on sensitivity level
    if (input.sensitivity === 'pii') {
      redactions.push('email', 'phone', 'ssn', 'credit_card');
    } else if (input.sensitivity === 'financial') {
      redactions.push('account_number', 'routing_number', 'card_number');
    }

    return redactions;
  }

  private generateDedupKey(input: ClassifierOutput): string {
    const mapping = getToolMapping(input.source_tool);
    if (!mapping?.filter_config.dedup_key_pattern) {
      return input.fingerprint_hash;
    }

    // Use tool-specific dedup pattern
    return mapping.filter_config.dedup_key_pattern
      .replace('{object_type}', input.payload_type || 'unknown')
      .replace('{id}', input.fingerprint_hash);
  }

  private checkDuplicate(dedup_key: string): boolean {
    const existing = this.dedupCache.get(dedup_key);
    if (existing && Date.now() - existing < 3600000) { // 1 hour window
      return true;
    }
    this.dedupCache.set(dedup_key, Date.now());
    return false;
  }

  private async checkQuota(input: ClassifierOutput): Promise<boolean> {
    // Check rate limits from tool mapping
    const mapping = getToolMapping(input.source_tool);
    if (!mapping?.filter_config.rate_limit) {
      return true;
    }

    // In production, check against rate limiter
    return true;
  }
}

// ==========================================
// STAGE 4: REFINER
// ==========================================

export class RefinerStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async refine(input: FilterOutput): Promise<RefinerOutput> {
    const traceId = this.observability.startTrace('refiner_stage');

    try {
      // Skip if not allowed
      if (!input.allowed) {
        return {
          ...input,
          units: [],
          ref_candidates: {},
        };
      }

      // 1. Sanity pre-check
      this.sanityCheck(input);

      // 2. Segment into processing units
      const units = this.segmentIntoUnits(input);

      // 3. Extract ID candidates for linking
      const ref_candidates = this.extractRefCandidates(input);

      this.observability.incrementCounter('refiner_processed', {
        source: input.source_tool,
        units: String(units.length),
      });

      return {
        ...input,
        units,
        ref_candidates,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private sanityCheck(input: FilterOutput): void {
    // Basic sanity checks
    if (!input.envelope.metadata) {
      throw new Error('Missing metadata');
    }
    if (!input.source_tool) {
      throw new Error('Missing source tool');
    }
  }

  private segmentIntoUnits(input: FilterOutput): ProcessingUnit[] {
    // Split batch payloads into individual units
    const mapping = getToolMapping(input.source_tool);
    const units: ProcessingUnit[] = [];

    // If payload is array, split it
    if (Array.isArray(input.envelope.metadata.raw_data)) {
      input.envelope.metadata.raw_data.forEach((item: any, index: number) => {
        units.push({
          unit_id: `${input.fingerprint_hash}_${index}`,
          data: item,
          type: input.payload_type || 'unknown',
        });
      });
    } else {
      // Single unit
      units.push({
        unit_id: input.fingerprint_hash,
        data: input.envelope.metadata.raw_data,
        type: input.payload_type || 'unknown',
      });
    }

    return units;
  }

  private extractRefCandidates(input: FilterOutput): Record<string, any> {
    const mapping = getToolMapping(input.source_tool);
    const candidates: Record<string, any> = {};

    if (!mapping) return candidates;

    // Extract relationship fields
    const relationshipFields = mapping.extraction_config.relationship_fields || [];
    relationshipFields.forEach(field => {
      const value = this.getNestedValue(input.envelope.metadata.raw_data, field);
      if (value) {
        candidates[field] = value;
      }
    });

    return candidates;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }
}

// ==========================================
// STAGE 5: EXTRACTOR
// ==========================================

export class ExtractorStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async extract(input: RefinerOutput): Promise<ExtractorOutput> {
    const traceId = this.observability.startTrace('extractor_stage');

    try {
      if (!input.allowed || input.units.length === 0) {
        return {
          ...input,
          structured_entities: [],
          unstructured_blobs: [],
          files: [],
          ai_sessions: [],
        };
      }

      const mapping = getToolMapping(input.source_tool);
      if (!mapping) {
        throw new Error(`No mapping for tool: ${input.source_tool}`);
      }

      // Extract based on data kind
      const structured_entities = this.extractStructured(input, mapping);
      const unstructured_blobs = this.extractUnstructured(input, mapping);
      const files = this.extractFiles(input, mapping);
      const ai_sessions = this.extractAISessions(input, mapping);

      this.observability.incrementCounter('extractor_processed', {
        source: input.source_tool,
        structured: String(structured_entities.length),
        unstructured: String(unstructured_blobs.length),
      });

      return {
        ...input,
        structured_entities,
        unstructured_blobs,
        files,
        ai_sessions,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private extractStructured(input: RefinerOutput, mapping: any): StructuredEntity[] {
    if (input.data_kind !== 'record' && input.data_kind !== 'telemetry') {
      return [];
    }

    const entities: StructuredEntity[] = [];

    input.units.forEach(unit => {
      const entity: StructuredEntity = {
        entity_type: input.entity_hints[0] || 'unknown',
        entity_id: unit.unit_id,
        data: {},
        relationships: {},
      };

      // Extract structured paths
      mapping.extraction_config.structured_paths?.forEach((path: string) => {
        const value = this.getNestedValue(unit.data, path);
        if (value !== undefined) {
          entity.data[path] = value;
        }
      });

      // Extract relationships
      mapping.extraction_config.relationship_fields?.forEach((field: string) => {
        const value = this.getNestedValue(unit.data, field);
        if (value !== undefined) {
          entity.relationships[field] = value;
        }
      });

      entities.push(entity);
    });

    return entities;
  }

  private extractUnstructured(input: RefinerOutput, mapping: any): UnstructuredBlob[] {
    if (input.data_kind !== 'message' && input.data_kind !== 'document') {
      return [];
    }

    const blobs: UnstructuredBlob[] = [];

    input.units.forEach(unit => {
      const texts: string[] = [];

      // Extract unstructured fields
      mapping.extraction_config.unstructured_fields?.forEach((field: string) => {
        const value = this.getNestedValue(unit.data, field);
        if (value && typeof value === 'string') {
          texts.push(value);
        }
      });

      if (texts.length > 0) {
        blobs.push({
          blob_id: `blob_${unit.unit_id}`,
          text: texts.join('\n\n'),
          metadata: {
            source_tool: input.source_tool,
            entity_type: input.entity_hints[0],
          },
        });
      }
    });

    return blobs;
  }

  private extractFiles(input: RefinerOutput, mapping: any): FileReference[] {
    // Extract file references if data_kind is document
    if (input.data_kind !== 'document') {
      return [];
    }

    const files: FileReference[] = [];

    input.units.forEach(unit => {
      if (unit.data.file_url || unit.data.url || unit.data.download_url) {
        files.push({
          file_id: `file_${unit.unit_id}`,
          original_url: unit.data.file_url || unit.data.url || unit.data.download_url,
          stored_path: `files/${input.tenant_id}/${unit.unit_id}`,
          mime_type: input.mime_type || 'application/octet-stream',
        });
      }
    });

    return files;
  }

  private extractAISessions(input: RefinerOutput, mapping: any): AISession[] {
    if (input.data_kind !== 'chat') {
      return [];
    }

    const sessions: AISession[] = [];

    input.units.forEach(unit => {
      const turns: AITurn[] = [];

      // Extract chat messages
      if (unit.data.messages && Array.isArray(unit.data.messages)) {
        unit.data.messages.forEach((msg: any) => {
          turns.push({
            role: msg.role || 'user',
            content: msg.content || '',
            timestamp: msg.timestamp || Date.now(),
          });
        });
      }

      if (turns.length > 0) {
        sessions.push({
          session_id: `session_${unit.unit_id}`,
          turns,
          memory_candidates: turns.map(t => t.content).filter(c => c.length > 50),
        });
      }
    });

    return sessions;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (part.includes('*')) {
        // Handle wildcard paths
        return acc;
      }
      return acc?.[part];
    }, obj);
  }
}

// ==========================================
// STAGE 6: VALIDATOR
// ==========================================

export class ValidatorStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async validate(input: ExtractorOutput): Promise<ValidatorOutput> {
    const traceId = this.observability.startTrace('validator_stage');

    try {
      if (!input.allowed) {
        return {
          ...input,
          validation_errors: [],
          confidence_score: 0,
          trust_score: 0,
          evidence_refs: [],
        };
      }

      // 1. Schema validation
      const validation_errors = this.validateSchema(input);

      // 2. Cross-reference validation
      const crossRefErrors = await this.validateCrossRefs(input);
      validation_errors.push(...crossRefErrors);

      // 3. Evidence validation
      const evidence_refs = this.validateEvidence(input);

      // 4. Calculate scores
      const confidence_score = this.calculateConfidence(input, validation_errors);
      const trust_score = this.calculateTrust(input);

      this.observability.incrementCounter('validator_processed', {
        source: input.source_tool,
        valid: String(validation_errors.length === 0),
      });

      return {
        ...input,
        validation_errors,
        confidence_score,
        trust_score,
        evidence_refs,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private validateSchema(input: ExtractorOutput): ValidationError[] {
    const errors: ValidationError[] = [];
    const mapping = getToolMapping(input.source_tool);

    if (!mapping) return errors;

    // Validate required entity hints
    input.entity_hints.forEach(hint => {
      const entityHint = mapping.entity_hints.find(h => h.type === hint);
      if (entityHint && entityHint.required_fields) {
        entityHint.required_fields.forEach(field => {
          const hasField = input.structured_entities.some(e => 
            e.data[field] !== undefined
          );
          if (!hasField) {
            errors.push({
              field,
              error: `Required field missing for ${hint}`,
              severity: 'error',
            });
          }
        });
      }
    });

    return errors;
  }

  private async validateCrossRefs(input: ExtractorOutput): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];

    // Validate relationship references exist
    // In production, would check against Spine DB
    input.structured_entities.forEach(entity => {
      Object.entries(entity.relationships).forEach(([field, value]) => {
        if (!value) {
          errors.push({
            field,
            error: `Missing relationship reference`,
            severity: 'warning',
          });
        }
      });
    });

    return errors;
  }

  private validateEvidence(input: ExtractorOutput): EvidenceRef[] {
    return [
      {
        type: 'source',
        ref_id: input.envelope.raw_payload_ref,
        description: `Raw payload from ${input.source_tool}`,
      },
      {
        type: 'extraction',
        ref_id: input.fingerprint_hash,
        description: `Extracted at ${new Date().toISOString()}`,
      },
    ];
  }

  private calculateConfidence(input: ExtractorOutput, errors: ValidationError[]): number {
    // Start with base confidence
    let confidence = 1.0;

    // Reduce for errors
    const errorCount = errors.filter(e => e.severity === 'error').length;
    const warningCount = errors.filter(e => e.severity === 'warning').length;

    confidence -= (errorCount * 0.2);
    confidence -= (warningCount * 0.05);

    // Reduce if missing key extractions
    if (input.structured_entities.length === 0 && input.data_kind === 'record') {
      confidence -= 0.3;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  private calculateTrust(input: ExtractorOutput): number {
    // Calculate source reliability
    const sourceReliability = this.getSourceReliability(input.source_tool);
    
    // Calculate extraction completeness
    const hasStructured = input.structured_entities.length > 0;
    const hasUnstructured = input.unstructured_blobs.length > 0;
    const completeness = (hasStructured || hasUnstructured) ? 1.0 : 0.5;

    return (sourceReliability + completeness) / 2;
  }

  private getSourceReliability(source: string): number {
    // Trusted sources get higher scores
    const trustedSources = ['salesforce', 'hubspot', 'stripe', 'gmail'];
    return trustedSources.includes(source) ? 1.0 : 0.8;
  }
}

// ==========================================
// STAGE 7: SPLIT ROUTER
// ==========================================

export class SplitRouterStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async route(input: ValidatorOutput): Promise<SplitRouterOutput> {
    const traceId = this.observability.startTrace('split_router_stage');

    try {
      if (!input.allowed || input.validation_errors.some(e => e.severity === 'error')) {
        return {
          ...input,
          write_plan: { spine: false, context: false, knowledge: false, memory: false },
          routing_reasons: ['Validation failed or not allowed'],
        };
      }

      const routing_reasons: string[] = [];
      const write_plan = {
        spine: false,
        context: false,
        knowledge: false,
        memory: false,
      };

      // Route based on data_kind and extracted content
      if (input.structured_entities.length > 0) {
        write_plan.spine = true;
        routing_reasons.push(`Structured entities: ${input.structured_entities.length}`);
      }

      if (input.unstructured_blobs.length > 0) {
        write_plan.context = true;
        routing_reasons.push(`Unstructured blobs: ${input.unstructured_blobs.length}`);
      }

      if (input.files.length > 0) {
        write_plan.knowledge = true;
        routing_reasons.push(`Files: ${input.files.length}`);
      }

      if (input.ai_sessions.length > 0) {
        write_plan.memory = true;
        routing_reasons.push(`AI sessions: ${input.ai_sessions.length}`);
      }

      this.observability.incrementCounter('split_router_processed', {
        source: input.source_tool,
        spine: String(write_plan.spine),
        context: String(write_plan.context),
        knowledge: String(write_plan.knowledge),
        memory: String(write_plan.memory),
      });

      return {
        ...input,
        write_plan,
        routing_reasons,
      };
    } finally {
      this.observability.endTrace(traceId);
    }
  }
}

// ==========================================
// STAGE 8: WRITERS (Interface - actual writes done by store services)
// ==========================================

export class WritersStage {
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
  }

  async write(input: SplitRouterOutput): Promise<WritersOutput> {
    const traceId = this.observability.startTrace('writers_stage');

    try {
      const output: WritersOutput = {
        spine_entity_ids: [],
        context_ids: [],
        chunk_ids: [],
        memory_ids: [],
        audit_log_id: '',
        events_published: [],
      };

      // Write to Spine DB
      if (input.write_plan.spine) {
        output.spine_entity_ids = await this.writeToSpine(input);
      }

      // Write to Context Store
      if (input.write_plan.context) {
        output.context_ids = await this.writeToContext(input);
      }

      // Write to Knowledge Store
      if (input.write_plan.knowledge) {
        output.chunk_ids = await this.writeToKnowledge(input);
      }

      // Write to Memory Store
      if (input.write_plan.memory) {
        output.memory_ids = await this.writeToMemory(input);
      }

      // Always write audit log
      output.audit_log_id = await this.writeAudit(input);

      // Publish events
      output.events_published = await this.publishEvents(input, output);

      this.observability.incrementCounter('writers_processed', {
        source: input.source_tool,
        total_writes: String(
          output.spine_entity_ids.length +
          output.context_ids.length +
          output.chunk_ids.length +
          output.memory_ids.length
        ),
      });

      return output;
    } finally {
      this.observability.endTrace(traceId);
    }
  }

  private async writeToSpine(input: SplitRouterOutput): Promise<string[]> {
    // Write structured entities to Spine DB
    // In production, this would call SpineDB service
    return input.structured_entities.map(e => e.entity_id);
  }

  private async writeToContext(input: SplitRouterOutput): Promise<string[]> {
    // Write unstructured blobs to Context Store
    return input.unstructured_blobs.map(b => b.blob_id);
  }

  private async writeToKnowledge(input: SplitRouterOutput): Promise<string[]> {
    // Write files and chunks to Knowledge Store
    return input.files.map(f => f.file_id);
  }

  private async writeToMemory(input: SplitRouterOutput): Promise<string[]> {
    // Write AI sessions to Memory Store
    return input.ai_sessions.map(s => s.session_id);
  }

  private async writeAudit(input: SplitRouterOutput): Promise<string> {
    // Write immutable audit log
    return `audit_${input.fingerprint_hash}_${Date.now()}`;
  }

  private async publishEvents(input: SplitRouterOutput, output: WritersOutput): Promise<string[]> {
    // Publish events to event bus for downstream processing
    const events: string[] = [];

    if (output.spine_entity_ids.length > 0) {
      events.push(`entity.created.${input.entity_hints[0]}`);
    }

    if (output.context_ids.length > 0) {
      events.push(`context.created`);
    }

    return events;
  }
}

// ==========================================
// COMPLETE PIPELINE ORCHESTRATOR
// ==========================================

export class IngestionPipeline {
  private analyzer: AnalyzerStage;
  private classifier: ClassifierStage;
  private filter: FilterStage;
  private refiner: RefinerStage;
  private extractor: ExtractorStage;
  private validator: ValidatorStage;
  private splitRouter: SplitRouterStage;
  private writers: WritersStage;
  private observability: ObservabilityService;

  constructor(observability: ObservabilityService) {
    this.observability = observability;
    this.analyzer = new AnalyzerStage(observability);
    this.classifier = new ClassifierStage(observability);
    this.filter = new FilterStage(observability);
    this.refiner = new RefinerStage(observability);
    this.extractor = new ExtractorStage(observability);
    this.validator = new ValidatorStage(observability);
    this.splitRouter = new SplitRouterStage(observability);
    this.writers = new WritersStage(observability);
  }

  async process(payload: RawPayload): Promise<WritersOutput> {
    const pipelineTraceId = this.observability.startTrace('ingestion_pipeline');

    try {
      // Stage 1: Analyzer
      const analyzed = await this.analyzer.analyze(payload);

      // Stage 2: Classifier
      const classified = await this.classifier.classify(analyzed);

      // Stage 3: Filter
      const filtered = await this.filter.filter(classified);

      // Stage 4: Refiner
      const refined = await this.refiner.refine(filtered);

      // Stage 5: Extractor
      const extracted = await this.extractor.extract(refined);

      // Stage 6: Validator
      const validated = await this.validator.validate(extracted);

      // Stage 7: Split Router
      const routed = await this.splitRouter.route(validated);

      // Stage 8: Writers
      const written = await this.writers.write(routed);

      this.observability.incrementCounter('pipeline_completed', {
        source: payload.source_tool,
        success: 'true',
      });

      return written;
    } catch (error) {
      this.observability.incrementCounter('pipeline_failed', {
        source: payload.source_tool,
        error: String(error),
      });
      throw error;
    } finally {
      this.observability.endTrace(pipelineTraceId);
    }
  }
}
