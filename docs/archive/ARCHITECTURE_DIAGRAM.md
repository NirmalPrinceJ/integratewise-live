# IntegrateWise OS - Universal 8-Stage Ingestion Pipeline Architecture

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         LAYER 0: ONBOARDING (Future)                       ┃
┃                                                                             ┃
┃  Connector Setup → OAuth Flow → Initial Sync → Preferences → Dashboard    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                       │
                                       ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        LAYER 1: DAILY WORKSPACE VIEWS                      ┃
┃                                                                             ┃
┃  Context-aware UI filtering data by category + scope from Spine schema    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                       │
                                       ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                    LAYER 2: COGNITIVE INTELLIGENCE                         ┃
┃                            (Universal - ONE for all)                       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                             ┃
┃  ┌───────────────┐  ┌────────────────┐  ┌─────────────────────────────┐  ┃
┃  │   Security    │  │   Resilience   │  │      Monitoring             │  ┃
┃  │               │  │                │  │                             │  ┃
┃  │  • RBAC       │  │  • Circuit     │  │  • ObservabilityService     │  ┃
┃  │  • Policies   │  │    Breaker     │  │  • Metrics                  │  ┃
┃  │  • Field-level│  │  • Error       │  │  • Traces                   │  ┃
┃  │    Permissions│  │    Handler     │  │  • Logs                     │  ┃
┃  └───────────────┘  └────────────────┘  └─────────────────────────────┘  ┃
┃                                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                                       │
                                       ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                   LAYER 3: BACKEND SERVICE MESH                            ┃
┃                         (Universal - ONE for all)                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                             ┃
┃                      ╔═══════════════════════════════╗                     ┃
┃                      ║  INGESTION ENTRY POINTS       ║                     ┃
┃                      ╚═══════════════════════════════╝                     ┃
┃                                                                             ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     ┃
┃  │  Webhooks   │  │  API Poll   │  │ Sync Queue  │  │  Manual     │     ┃
┃  │  (Push)     │  │  (Pull)     │  │  Consumer   │  │  Upload     │     ┃
┃  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     ┃
┃         │                │                │                │              ┃
┃         └────────────────┴────────────────┴────────────────┘              ┃
┃                                   │                                        ┃
┃                                   ▼                                        ┃
┃                  ╔═════════════════════════════════════╗                   ┃
┃                  ║   8-STAGE INGESTION PIPELINE        ║                   ┃
┃                  ║   (Universal - processes all data)  ║                   ┃
┃                  ╚═════════════════════════════════════╝                   ┃
┃                                                                             ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 1: ANALYZER                                                   │  ┃
┃  │  • Generate fingerprint hash                                         │  ┃
┃  │  • Detect MIME type                                                  │  ┃
┃  │  • Create canonical envelope                                         │  ┃
┃  │                                                                       │  ┃
┃  │        Input: RawPayload                                             │  ┃
┃  │        Output: AnalyzerOutput (fingerprint, envelope)                │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 2: CLASSIFIER                                                 │  ┃
┃  │  • Look up tool mapping (25+ connectors)                            │  ┃
┃  │  • Detect payload type (Account, message, file, etc.)               │  ┃
┃  │  • Assign data_kind: record | message | document | telemetry | chat │  ┃
┃  │  • Assign domain: csm | support | finance | personal | team | ...   │  ┃
┃  │  • Assign sensitivity: public | business | pii | financial | secret │  ┃
┃  │  • Tag entity hints                                                  │  ┃
┃  │                                                                       │  ┃
┃  │        Input: AnalyzerOutput                                         │  ┃
┃  │        Output: ClassifierOutput (data_kind, domain, sensitivity)     │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 3: FILTER                                                     │  ┃
┃  │  • RBAC policy checks (tenant/user permissions)                      │  ┃
┃  │  • Field redaction (based on sensitivity)                            │  ┃
┃  │  • Deduplication (tool-specific key patterns)                        │  ┃
┃  │  • Rate limiting / Quota validation                                  │  ┃
┃  │                                                                       │  ┃
┃  │        Input: ClassifierOutput                                       │  ┃
┃  │        Output: FilterOutput (allowed, redactions, dedup_key)         │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 4: REFINER                                                    │  ┃
┃  │  • Sanity checks                                                     │  ┃
┃  │  • Split batch payloads into individual units                        │  ┃
┃  │  • Extract ID candidates for relationship linking                    │  ┃
┃  │                                                                       │  ┃
┃  │        Input: FilterOutput                                           │  ┃
┃  │        Output: RefinerOutput (units[], ref_candidates)               │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 5: EXTRACTOR (Triple Stream)                                 │  ┃
┃  │  ┌───────────────┐  ┌─────────────────┐  ┌────────────────────┐    │  ┃
┃  │  │  Structured   │  │  Unstructured   │  │  Files + AI        │    │  ┃
┃  │  │  Entities     │  │  Text Blobs     │  │  Sessions          │    │  ┃
┃  │  └───────────────┘  └─────────────────┘  └────────────────────┘    │  ┃
┃  │                                                                       │  ┃
┃  │  • Extract typed fields using tool-specific paths                    │  ┃
┃  │  • Extract unstructured text for RAG                                │  ┃
┃  │  • Extract file references                                           │  ┃
┃  │  • Extract AI chat sessions                                          │  ┃
┃  │                                                                       │  ┃
┃  │        Input: RefinerOutput                                          │  ┃
┃  │        Output: ExtractorOutput (entities, blobs, files, sessions)    │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 6: VALIDATOR                                                  │  ┃
┃  │  • Schema validation (required fields)                               │  ┃
┃  │  • Cross-reference validation (relationships exist)                  │  ┃
┃  │  • Evidence chain creation (source → extract → transform)           │  ┃
┃  │  • Confidence scoring (extraction quality, 0-1)                      │  ┃
┃  │  • Trust scoring (source reliability, 0-1)                           │  ┃
┃  │                                                                       │  ┃
┃  │        Input: ExtractorOutput                                        │  ┃
┃  │        Output: ValidatorOutput (errors, confidence, trust, evidence) │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 7: SPLIT ROUTER                                               │  ┃
┃  │  • Analyze extracted content                                         │  ┃
┃  │  • Make routing decisions:                                           │  ┃
┃  │    ├─ spine: true if structured entities exist                       │  ┃
┃  │    ├─ context: true if unstructured blobs exist                      │  ┃
┃  │    ├─ knowledge: true if files exist                                 │  ┃
┃  │    └─ memory: true if AI sessions exist                              │  ┃
┃  │  • Document routing reasoning                                        │  ┃
┃  │                                                                       │  ┃
┃  │        Input: ValidatorOutput                                        │  ┃
┃  │        Output: SplitRouterOutput (write_plan, routing_reasons)       │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      ▼                                      ┃
┃  ┌─────────────────────────────────────────────────────────────────────┐  ┃
┃  │                                                                       │  ┃
┃  │  STAGE 8: WRITERS                                                    │  ┃
┃  │  • Write structured entities → Spine DB                              │  ┃
┃  │  • Write unstructured blobs → Context Store                          │  ┃
┃  │  • Write file chunks → Vector Index / Object Store                   │  ┃
┃  │  • Write AI sessions → Memory DB                                     │  ┃
┃  │  • Write immutable audit log → Audit Store                           │  ┃
┃  │  • Publish events → Event Bus                                        │  ┃
┃  │                                                                       │  ┃
┃  │        Input: SplitRouterOutput                                      │  ┃
┃  │        Output: WritersOutput (entity_ids, chunk_ids, events)         │  ┃
┃  └───────────────────────────────────┬───────────────────────────────────┘  ┃
┃                                      │                                      ┃
┃                                      ▼                                      ┃
┃                  ╔═════════════════════════════════════╗                   ┃
┃                  ║         DATA STORES                 ║                   ┃
┃                  ╚═════════════════════════════════════╝                   ┃
┃                                                                             ┃
┃  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  ┃
┃  │  Spine DB    │  │Context Store │  │Vector Index  │  │ Memory DB   │  ┃
┃  │  (D1)        │  │  (KV/R2)     │  │ (Vectorize)  │  │   (KV)      │  ┃
┃  │              │  │              │  │              │  │             │  ┃
┃  │ Structured   │  │ Unstructured │  │ Knowledge    │  │ AI Chats    │  ┃
┃  │ Entities     │  │ Text Blobs   │  │ Embeddings   │  │ Sessions    │  ┃
┃  │              │  │              │  │              │  │             │  ┃
┃  │ category +   │  │ Searchable   │  │ RAG-ready    │  │ Turns +     │  ┃
┃  │ scope fields │  │ Full-text    │  │ Chunks       │  │ Memory      │  ┃
┃  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────┘  ┃
┃                                                                             ┃
┃  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    ┃
┃  │Object Store  │  │ Audit Store  │  │  Event Bus   │                    ┃
┃  │   (R2)       │  │    (D1)      │  │   (Queues)   │                    ┃
┃  │              │  │              │  │              │                    ┃
┃  │ Files &      │  │ Immutable    │  │ Downstream   │                    ┃
┃  │ Attachments  │  │ Evidence     │  │ Processing   │                    ┃
┃  └──────────────┘  └──────────────┘  └──────────────┘                    ┃
┃                                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

═══════════════════════════════════════════════════════════════════════════════

                        SUPPORTED CONNECTORS (25+)

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  CRM                 Communication         Productivity                      │
│  ├─ Salesforce       ├─ Slack             ├─ Notion                          │
│  └─ HubSpot          ├─ Gmail             ├─ Google Drive                    │
│                      ├─ Outlook           ├─ Dropbox                         │
│  Support             └─ Microsoft Teams   ├─ Asana                           │
│  ├─ Zendesk                               ├─ Monday.com                      │
│  └─ Intercom         Finance              ├─ Google Calendar                 │
│                      ├─ Stripe            └─ Calendly                        │
│  Dev Tools           └─ QuickBooks                                           │
│  ├─ GitHub                                AI                                 │
│  ├─ GitLab           Analytics            ├─ OpenAI                          │
│  ├─ Jira             ├─ Segment           ├─ Anthropic                       │
│  └─ Linear           ├─ Mixpanel          └─ Perplexity                      │
│                      └─ Google Analytics                                     │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

                          KEY ARCHITECTURE PRINCIPLES

  ✓ UNIVERSAL BACKEND: ONE pipeline for all users (no per-tenant silos)
  ✓ DETERMINISTIC: Same input → Same classification (tool mappings)
  ✓ TRACEABLE: Complete evidence chain from source to storage
  ✓ CONTEXT-AWARE: Data filtered by category + scope at query time
  ✓ OBSERVABLE: Metrics and traces at every stage
  ✓ RESILIENT: Built-in validation, error handling, circuit breakers

═══════════════════════════════════════════════════════════════════════════════

                          OBSERVABILITY

  Metrics (per stage):
  • analyzer_processed{source}
  • classifier_processed{source, data_kind, domain}
  • filter_processed{source, allowed}
  • refiner_processed{source, units}
  • extractor_processed{source, structured, unstructured}
  • validator_processed{source, valid}
  • split_router_processed{source, spine, context, knowledge, memory}
  • writers_processed{source, total_writes}
  • pipeline_completed{source, success}

  Traces:
  ingestion_pipeline
    ├─ analyzer_stage
    ├─ classifier_stage
    ├─ filter_stage
    ├─ refiner_stage
    ├─ extractor_stage
    ├─ validator_stage
    ├─ split_router_stage
    └─ writers_stage

═══════════════════════════════════════════════════════════════════════════════
```
