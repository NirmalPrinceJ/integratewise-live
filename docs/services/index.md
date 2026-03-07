# Services Packages

Tiered service packages with deliverables, timelines, effort ranges, and SLAs.

## Overview

IntegrateWise OS offers professional services to help organizations implement, operate, and optimize their integration workflows. Services are packaged into tiers with clear deliverables, timelines, and acceptance criteria.

## Service Tiers

### Assessment

**Purpose**: Discovery, system mapping, risk assessment, and deployment roadmap.

**Deliverables:**
- Discovery report (current state analysis)
- System map (tools, data flows, dependencies)
- Risk register (security, compliance, operational risks)
- Deployment roadmap (phased implementation plan with milestones)

**Timeline:** 2-4 weeks

**Effort Range:** 40-80 hours

**Acceptance Criteria:**
- [ ] All source tools identified and documented
- [ ] Data flows mapped and validated
- [ ] Risks identified and prioritized
- [ ] Roadmap approved by stakeholders

**Sample Artifacts:**
- System architecture diagram
- Data flow diagram
- Risk assessment matrix
- Implementation timeline (Gantt chart)

### Implementation

**Purpose**: Integration setup, schema mapping, testing, and cutover.

**Deliverables:**
- Integration list (connectors to implement)
- Schema mapping sheet (source → Spine mappings)
- Test plan (unit, integration, end-to-end tests)
- Cutover checklist (go-live procedures)
- Runbooks (operational procedures)

**Timeline:** 4-8 weeks

**Effort Range:** 80-160 hours

**Acceptance Criteria:**
- [ ] All integrations configured and tested
- [ ] Schema mappings validated
- [ ] Test plan executed and passed
- [ ] Cutover completed successfully
- [ ] Runbooks documented and reviewed

**Sample Artifacts:**
- Integration configuration guide
- Schema mapping documentation
- Test results report
- Cutover plan
- Operational runbook

### Managed Ops

**Purpose**: Ongoing operations, monitoring, and optimization.

**Deliverables:**
- SLOs (Service Level Objectives)
- Escalation policy
- Change cadence (update schedule)
- Monthly health report

**Timeline:** Ongoing (monthly)

**Effort Range:** 20-40 hours/month

**SLOs:**
- **Uptime**: 99.9% (monthly)
- **Latency**: P95 < 500ms (API responses)
- **Error Rate**: < 0.1% (5xx errors)
- **Data Freshness**: < 5 minutes (sync lag)

**Escalation Policy:**
- **P1 (Critical)**: Response within 15 minutes, resolution within 4 hours
- **P2 (High)**: Response within 1 hour, resolution within 24 hours
- **P3 (Medium)**: Response within 4 hours, resolution within 72 hours
- **P4 (Low)**: Response within 24 hours, resolution within 1 week

**Change Cadence:**
- **Weekly**: Minor updates, bug fixes
- **Monthly**: Feature updates, optimizations
- **Quarterly**: Major updates, architecture changes

**Monthly Health Report:**
- Uptime metrics
- Performance metrics
- Error analysis
- Usage trends
- Recommendations

**Acceptance Criteria:**
- [ ] SLOs met (monthly)
- [ ] Escalation policy followed
- [ ] Changes deployed per cadence
- [ ] Health report delivered monthly

### MuleSoft Enablement

**Purpose**: API-led architecture, DataWeave specs, CI/CD, governance.

**Deliverables:**
- API-led taxonomy (API classification)
- DataWeave specs (transformation logic)
- CI/CD pipeline (automated deployment)
- Governance model (API governance, versioning)

**Timeline:** 6-12 weeks

**Effort Range:** 120-240 hours

**Acceptance Criteria:**
- [ ] API taxonomy defined and documented
- [ ] DataWeave specs implemented and tested
- [ ] CI/CD pipeline operational
- [ ] Governance model established

**Sample Artifacts:**
- API catalog
- DataWeave transformation specs
- CI/CD pipeline configuration
- Governance documentation

### Training

**Purpose**: Role-based training, admin playbooks, competency checks.

**Deliverables:**
- Role-based curricula (Admin, Operator, Contributor, Viewer)
- Admin playbooks (operational procedures)
- Competency checks (assessment tests)
- Training materials (slides, videos, documentation)

**Timeline:** 2-4 weeks

**Effort Range:** 40-80 hours

**Role-Based Curricula:**

**Admin:**
- Workspace setup and configuration
- User management
- Integration configuration
- Security and compliance
- Troubleshooting

**Operator:**
- Daily operations
- Monitoring and alerts
- Template management
- Agent configuration
- Incident response

**Contributor:**
- Creating and updating entities
- Using templates
- Agent invocation
- Best practices

**Viewer:**
- Accessing dashboards
- Viewing reports
- Understanding data

**Acceptance Criteria:**
- [ ] All roles trained
- [ ] Competency checks passed (80% threshold)
- [ ] Playbooks documented
- [ ] Training materials delivered

## Service Packages

### Starter Package

**Includes:**
- Assessment
- Basic Implementation (5 integrations)
- Training (Admin, Operator)

**Timeline:** 6-8 weeks

**Effort Range:** 120-200 hours

**Price:** Contact sales

### Professional Package

**Includes:**
- Assessment
- Full Implementation (10 integrations)
- 3 months Managed Ops
- Training (All roles)

**Timeline:** 8-12 weeks

**Effort Range:** 200-320 hours

**Price:** Contact sales

### Enterprise Package

**Includes:**
- Assessment
- Full Implementation (unlimited integrations)
- 12 months Managed Ops
- MuleSoft Enablement
- Training (All roles + custom)

**Timeline:** 12-16 weeks

**Effort Range:** 400-600 hours

**Price:** Contact sales

## See Also

- [Security Documentation](../security/index.md) - Security controls
- [API Reference](../api/index.md) - API documentation
- [Architecture](../architecture/how-it-works.md) - System architecture
