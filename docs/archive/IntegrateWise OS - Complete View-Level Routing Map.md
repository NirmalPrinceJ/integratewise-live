<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# IntegrateWise OS - Complete View-Level Routing Map with Data Tables

> **Comprehensive view-by-view breakdown**: Routes, data tables, intelligence layers, and UI components for each workspace view.

***

## 📋 TABLE OF CONTENTS

1. [Personal Workspace](#1-personal-workspace)
2. [Operations](#2-operations-workspace)
3. [Sales](#3-sales-workspace)
4. [Marketing](#4-marketing-workspace)
5. [Customer Success](#5-customer-success-workspace)
6. [Engineering](#6-engineering-workspace)
7. [Finance](#7-finance-workspace)
8. [HR/People](#8-hrpeople-workspace)
9. [Projects](#9-projects-workspace)
10. [Admin](#10-admin-workspace)
11. [Universal Intelligence Views](#11-universal-intelligence-views)

***

## 1. PERSONAL WORKSPACE

### 1.1 Personal Dashboard (`/personal`)

**Purpose**: Individual user's unified work command center

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `user_tasks` | id, title, status, priority, due_date, assigned_by, department, project_id | Personal task list |
| `user_goals` | id, title, type (okr/kpi), progress, target, period, linked_team_goal_id | Individual OKRs |
| `user_calendar_events` | id, title, start_time, end_time, type, attendees[], meeting_url | Today's schedule |
| `user_notifications` | id, type, source, content, read_status, priority, created_at | Notifications feed |
| `user_recent_items` | id, entity_type, entity_id, accessed_at, department | Recently viewed items |
| `user_pinned_items` | id, entity_type, entity_id, pinned_at, custom_label | Pinned shortcuts |

**Intelligence Layers**:

- **Signals**: Overdue tasks, upcoming deadlines, unread mentions
- **AI Recommendations**: Prioritized task list, suggested focus time blocks
- **Cross-Dept Alerts**: Items requiring attention from other departments

**UI Components**:

```tsx
<PersonalDashboard>
  <TodaySection>
    <MyTasks filter="due-today" />
    <UpcomingMeetings limit={5} />
    <Notifications filter="unread" />
  </TodaySection>
  
  <GoalsSection>
    <MyOKRs period="current-quarter" />
    <ProgressChart type="weekly" />
  </GoalsSection>
  
  <ActivityFeed>
    <RecentItems limit={10} />
    <TeamUpdates department="all" />
  </ActivityFeed>
  
  <QuickActions>
    <CreateTask />
    <ScheduleMeeting />
    <LogNote />
  </QuickActions>
</PersonalDashboard>
```


***

### 1.2 My Tasks (`/personal/tasks`)

**Purpose**: Comprehensive task management with department context

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `tasks` | id, title, description, status, priority, due_date, assignee_id, creator_id, department, project_id, parent_task_id, completion_date | Core task data |
| `task_dependencies` | task_id, depends_on_task_id, dependency_type | Task relationships |
| `task_comments` | id, task_id, user_id, comment_text, created_at, mentions[] | Collaboration |
| `task_attachments` | id, task_id, file_url, file_name, uploaded_by, uploaded_at | Supporting docs |
| `task_time_logs` | id, task_id, user_id, duration_minutes, logged_at, billable | Time tracking |
| `task_tags` | task_id, tag_name | Categorization |

**Views \& Filters**:

```tsx
<TaskViews>
  <View name="My Tasks" filter={{ assignee: currentUser }} />
  <View name="Created by Me" filter={{ creator: currentUser }} />
  <View name="Watching" filter={{ watcher: currentUser }} />
  <View name="Delegated" filter={{ delegated_by: currentUser }} />
  
  <GroupBy options={['status', 'priority', 'department', 'project', 'due_date']} />
  <SortBy options={['due_date', 'priority', 'created_at', 'updated_at']} />
  
  <Filters>
    <StatusFilter values={['todo', 'in_progress', 'blocked', 'done']} />
    <PriorityFilter values={['critical', 'high', 'medium', 'low']} />
    <DepartmentFilter values={departments} />
    <DueDateFilter presets={['overdue', 'today', 'this_week', 'this_month']} />
  </Filters>
</TaskViews>
```

**Intelligence Enhancements**:

```tsx
<TaskIntelligence>
  {/* AI Priority Scoring */}
  <PriorityScore task={task}>
    <Factor weight={0.4}>Due in 2 days</Factor>
    <Factor weight={0.3}>Blocking 3 other tasks</Factor>
    <Factor weight={0.3}>Critical project dependency</Factor>
    <Score>Priority Score: 8.7/10</Score>
  </PriorityScore>
  
  {/* Capacity Warning */}
  <CapacityAlert>
    You have 23 hours of estimated work due this week (capacity: 30h)
    <Recommendation>Delegate 2 low-priority tasks or extend deadlines</Recommendation>
  </CapacityAlert>
</TaskIntelligence>
```


***

### 1.3 My Goals (`/personal/goals`)

**Purpose**: Personal OKR tracking with team alignment

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `goals` | id, title, description, type (okr/kpi), owner_id, parent_goal_id, period_start, period_end, status | Goal definitions |
| `key_results` | id, goal_id, title, metric_type, baseline, current, target, unit, confidence_pct | Measurable outcomes |
| `goal_updates` | id, goal_id, user_id, update_text, progress_snapshot, created_at | Progress logs |
| `goal_alignments` | child_goal_id, parent_goal_id, alignment_type | Goal hierarchy |
| `goal_initiatives` | id, goal_id, initiative_title, status, owner_id, budget, timeline | Supporting projects |

**UI Layout**:

```tsx
<GoalsView>
  <GoalsList>
    <GoalCard goal={goal}>
      <Header>
        <Title>{goal.title}</Title>
        <ProgressBar value={goal.progress} target={100} />
        <Status>{goal.status}</Status>
      </Header>
      
      <KeyResults>
        {goal.keyResults.map(kr => (
          <KRCard>
            <Metric>{kr.current} / {kr.target} {kr.unit}</Metric>
            <Progress value={(kr.current / kr.target) * 100} />
            <Confidence>{kr.confidence_pct}% confident</Confidence>
          </KRCard>
        ))}
      </KeyResults>
      
      <Alignment>
        <ParentGoal>Contributes to: {goal.parentGoal.title}</ParentGoal>
        <TeamImpact>Team goal progress: +12% from your contribution</TeamImpact>
      </Alignment>
      
      <RecentUpdates>
        {goal.updates.slice(0, 3).map(update => (
          <Update date={update.created_at}>{update.update_text}</Update>
        ))}
      </RecentUpdates>
    </GoalCard>
  </GoalsList>
  
  <TimelineView>
    <QuarterlyTimeline goals={goals} />
  </TimelineView>
</GoalsView>
```


***

## 2. OPERATIONS WORKSPACE

### 2.1 Operations Dashboard (`/ops`)

**Purpose**: Real-time operational health monitoring

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `operational_metrics` | id, metric_name, category, value, unit, timestamp, source, department | KPI tracking |
| `processes` | id, name, description, owner_id, status, frequency, last_run, next_run, sla_hours | Process registry |
| `process_runs` | id, process_id, start_time, end_time, status, duration_seconds, error_log | Execution history |
| `incidents` | id, title, severity, status, affected_systems[], reported_by, assigned_to, resolved_at | Incident tracking |
| `capacity_metrics` | id, resource_type, resource_id, utilization_pct, threshold_pct, timestamp | Capacity monitoring |
| `vendor_integrations` | id, vendor_name, integration_type, status, last_sync, health_score, api_calls_today | Integration health |

**Dashboard Widgets**:

```tsx
<OperationsDashboard>
  <MetricsGrid>
    <MetricCard 
      title="System Uptime" 
      value="99.8%" 
      target="99.5%"
      status="healthy"
      trend="+0.2% vs last month"
    />
    <MetricCard 
      title="Active Processes" 
      value="47" 
      status="normal"
      breakdown={{ running: 12, scheduled: 35 }}
    />
    <MetricCard 
      title="Open Incidents" 
      value="3" 
      status="warning"
      severity={{ critical: 0, high: 1, medium: 2 }}
    />
    <MetricCard 
      title="Integration Health" 
      value="11/12 Healthy" 
      status="healthy"
      unhealthy={['Slack API - Rate limit warning']}
    />
  </MetricsGrid>
  
  <ProcessMonitoring>
    <ActiveProcesses>
      <ProcessCard 
        name="Daily Customer Data Sync"
        status="running"
        progress={67}
        eta="8 minutes"
      />
    </ActiveProcesses>
    <UpcomingProcesses timeWindow="next-4-hours" />
    <FailedProcesses period="last-24h" />
  </ProcessMonitoring>
  
  <IncidentTimeline>
    <IncidentCard severity="high">
      <Title>API Response Time Degradation</Title>
      <Status>Investigating</Status>
      <AffectedSystems>Customer Portal, Mobile App</AffectedSystems>
      <AssignedTo>Platform Team</AssignedTo>
      <Timeline>
        <Event time="10:15 AM">Incident detected</Event>
        <Event time="10:18 AM">Team notified</Event>
        <Event time="10:25 AM">Root cause identified</Event>
      </Timeline>
    </IncidentCard>
  </IncidentTimeline>
  
  <CapacityAlerts>
    <Alert severity="warning">
      Database storage at 82% capacity (threshold: 80%)
      <Projection>95% capacity by Feb 15 at current growth rate</Projection>
      <Action>Procurement ticket created for storage expansion</Action>
    </Alert>
  </CapacityAlerts>
</OperationsDashboard>
```

**Intelligence Layer**:

```tsx
<OpsIntelligence>
  <PredictiveAlerts>
    <Alert confidence={0.87}>
      Process "Customer Onboarding Automation" has 73% failure probability in next run
      <Factors>
        <Factor>Dependency service (HubSpot API) showing latency increase</Factor>
        <Factor>Similar failure pattern observed 3 times in past 30 days</Factor>
      </Factors>
      <Recommendation>Validate HubSpot connection before next scheduled run</Recommendation>
    </Alert>
  </PredictiveAlerts>
  
  <EfficiencyInsights>
    <Insight>
      Process "Invoice Generation" runs 3x daily but data changes only 1x daily
      <Optimization>Reduce frequency to 1x daily, save 67% compute cost</Optimization>
      <Impact>Annual savings: $4,800</Impact>
    </Insight>
  </EfficiencyInsights>
</OpsIntelligence>
```


***

### 2.2 Processes (`/ops/processes`)

**Purpose**: Process library and execution management

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `processes` | id, name, description, category, owner_id, status, frequency, schedule_cron, sla_hours, priority | Process definitions |
| `process_steps` | id, process_id, step_order, step_name, step_type, config_json, timeout_seconds | Workflow steps |
| `process_runs` | id, process_id, trigger_type, triggered_by, start_time, end_time, status, logs_url | Execution records |
| `process_dependencies` | process_id, depends_on_process_id, dependency_type | Inter-process deps |
| `process_approvals` | id, process_id, approver_id, approval_status, approved_at, comments | Governance |
| `process_sla_breaches` | id, process_run_id, breach_time, notified_users[], resolution_time | SLA tracking |

**Process Views**:

```tsx
<ProcessManagement>
  <ProcessLibrary>
    <CategoryNav>
      <Category name="Customer Onboarding" count={12} />
      <Category name="Financial Close" count={8} />
      <Category name="Data Sync" count={15} />
      <Category name="Compliance" count={6} />
    </CategoryNav>
    
    <ProcessList>
      <ProcessCard process={process}>
        <Header>
          <Name>{process.name}</Name>
          <Status active={process.status === 'active'} />
          <LastRun>{process.lastRun}</LastRun>
        </Header>
        
        <ExecutionMetrics>
          <Metric label="Success Rate" value="98.5%" trend="+1.2%" />
          <Metric label="Avg Duration" value="12m 34s" trend="-15%" />
          <Metric label="SLA Compliance" value="99.2%" />
        </ExecutionMetrics>
        
        <Schedule>
          <Frequency>{process.frequency}</Frequency>
          <NextRun>{process.nextRun}</NextRun>
        </Schedule>
        
        <Actions>
          <Button>Run Now</Button>
          <Button>Edit</Button>
          <Button>View History</Button>
        </Actions>
      </ProcessCard>
    </ProcessList>
  </ProcessLibrary>
  
  <ProcessBuilder process={selectedProcess}>
    <StepEditor>
      {process.steps.map((step, idx) => (
        <StepNode>
          <StepType>{step.type}</StepType>
          <StepConfig>{step.config}</StepConfig>
          <Timeout>{step.timeout}</Timeout>
          <ErrorHandling>{step.errorStrategy}</ErrorHandling>
        </StepNode>
      ))}
    </StepEditor>
    
    <DependencyGraph>
      <UpstreamDependencies processes={process.dependsOn} />
      <DownstreamImpact processes={process.triggers} />
    </DependencyGraph>
  </ProcessBuilder>
  
  <ExecutionHistory>
    <RunsList>
      <RunCard run={run}>
        <Status success={run.status === 'completed'} />
        <Duration>{run.duration}</Duration>
        <TriggerInfo>{run.triggerType} by {run.triggeredBy}</TriggerInfo>
        <StepResults steps={run.stepResults} />
        <Logs url={run.logsUrl} />
      </RunCard>
    </RunsList>
  </ExecutionHistory>
</ProcessManagement>
```


***

### 2.3 Integrations (`/ops/integrations`)

**Purpose**: Third-party integration management and health monitoring

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `integrations` | id, vendor_name, integration_type, status, auth_type, last_sync, next_sync, health_score, owner_id | Integration registry |
| `integration_configs` | integration_id, config_key, config_value, is_encrypted, updated_at, updated_by | Configuration |
| `api_endpoints` | id, integration_id, endpoint_url, method, rate_limit, rate_limit_window, timeout_ms | API details |
| `sync_logs` | id, integration_id, sync_start, sync_end, records_synced, errors_count, status | Sync history |
| `api_usage` | id, integration_id, endpoint_id, timestamp, response_time_ms, status_code, error_message | Usage metrics |
| `webhook_events` | id, integration_id, event_type, payload, received_at, processed_at, status | Webhook tracking |

**Integration Dashboard**:

```tsx
<IntegrationsDashboard>
  <IntegrationGrid>
    {integrations.map(integration => (
      <IntegrationCard>
        <Header>
          <Logo src={integration.logoUrl} />
          <Name>{integration.vendorName}</Name>
          <HealthIndicator score={integration.healthScore} />
        </Header>
        
        <StatusInfo>
          <Status active={integration.status === 'active'} />
          <LastSync>{integration.lastSync}</LastSync>
          <NextSync>{integration.nextSync}</NextSync>
        </StatusInfo>
        
        <HealthMetrics>
          <Metric label="Uptime (30d)" value="99.8%" />
          <Metric label="Avg Response" value="234ms" />
          <Metric label="Error Rate" value="0.2%" />
          <Metric label="Rate Limit Usage" value="67%" />
        </HealthMetrics>
        
        <RecentActivity>
          <SyncSummary>
            Last sync: 847 records synced (3 errors)
          </SyncSummary>
          <Errors>
            <Error>3 contacts skipped (invalid email format)</Error>
          </Errors>
        </RecentActivity>
        
        <Actions>
          <Button>Force Sync</Button>
          <Button>View Logs</Button>
          <Button>Configure</Button>
        </Actions>
      </IntegrationCard>
    ))}
  </IntegrationGrid>
  
  <SyncSchedule>
    <Timeline integrations={integrations} />
  </SyncSchedule>
  
  <APIUsageAnalytics>
    <UsageChart integration={selectedIntegration} period="7d" />
    <EndpointBreakdown endpoints={selectedIntegration.endpoints} />
    <RateLimitMonitoring>
      <Alert severity="warning">
        HubSpot API at 85% of rate limit (8,500 / 10,000 calls per day)
        <Recommendation>Optimize sync frequency or batch requests</Recommendation>
      </Alert>
    </RateLimitMonitoring>
  </APIUsageAnalytics>
</IntegrationsDashboard>
```

**Intelligence Layer**:

```tsx
<IntegrationIntelligence>
  <HealthPrediction integration="Salesforce">
    <Alert severity="medium" confidence={0.79}>
      API response time trending upward (+45% over 7 days)
      <Correlation>Coincides with increased sync frequency</Correlation>
      <Recommendation>
        Reduce sync from 4x/day to 2x/day or implement incremental sync
      </Recommendation>
    </Alert>
  </HealthPrediction>
  
  <DataQualityInsights>
    <Issue integration="HubSpot" severity="medium">
      18% of contact records missing company association
      <Impact>Leads not properly attributed to accounts</Impact>
      <Recommendation>Implement data validation rule at source</Recommendation>
    </Issue>
  </DataQualityInsights>
</IntegrationIntelligence>
```


***

## 3. SALES WORKSPACE

### 3.1 Sales Dashboard (`/sales`)

**Purpose**: Revenue pipeline and team performance overview

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `opportunities` | id, name, account_id, amount, stage, probability, close_date, owner_id, forecast_category, created_at | Deals pipeline |
| `accounts` | id, name, industry, employee_count, arr, status, health_score, owner_id, territory | Customer/prospect data |
| `contacts` | id, first_name, last_name, email, phone, account_id, role, buying_role, engagement_score | People |
| `activities` | id, type, subject, opportunity_id, account_id, contact_id, user_id, completed_date, outcome | Sales activities |
| `quotes` | id, opportunity_id, quote_number, total_amount, status, valid_until, approved_by, sent_date | CPQ data |
| `revenue_targets` | id, period, user_id, team_id, quota_amount, attainment_pct | Quota tracking |

**Dashboard Layout**:

```tsx
<SalesDashboard>
  <KPIGrid>
    <KPICard 
      title="Pipeline Coverage" 
      value="3.2x"
      target="3.0x"
      status="healthy"
      detail="$14.2M pipeline / $4.5M quota"
    />
    <KPICard 
      title="Forecast (This Quarter)" 
      value="$3.8M"
      vs_quota="84%"
      breakdown={{
        commit: "$2.1M",
        bestCase: "$1.7M",
        pipeline: "$10.4M"
      }}
    />
    <KPICard 
      title="Win Rate" 
      value="28%"
      trend="+3% vs last quarter"
      benchmark="Industry: 24%"
    />
    <KPICard 
      title="Avg Deal Size" 
      value="$48K"
      trend="+12% YoY"
      segment_breakdown={{
        enterprise: "$180K",
        midMarket: "$45K",
        smb: "$12K"
      }}
    />
  </KPIGrid>
  
  <PipelineVisualization>
    <StageWaterfall>
      <Stage name="Discovery" value="$5.2M" deals={47} />
      <Stage name="Demo" value="$3.8M" deals={28} />
      <Stage name="Proposal" value="$2.4M" deals={15} />
      <Stage name="Negotiation" value="$1.8M" deals={9} />
      <Stage name="Closed Won" value="$890K" deals={6} />
    </StageWaterfall>
    
    <VelocityMetrics>
      <Metric label="Avg Days in Discovery" value="18" target="14" />
      <Metric label="Avg Days in Negotiation" value="12" target="10" />
      <Metric label="Overall Sales Cycle" value="87 days" trend="-5 days" />
    </VelocityMetrics>
  </PipelineVisualization>
  
  <TeamPerformance>
    <RepLeaderboard>
      <RepCard rep={rep}>
        <Name>{rep.name}</Name>
        <Attainment value={rep.attainment} quota={rep.quota} />
        <Pipeline value={rep.pipelineValue} coverage={rep.coverage} />
        <Closed value={rep.closedWon} deals={rep.dealsWon} />
      </RepCard>
    </RepLeaderboard>
  </TeamPerformance>
  
  <AtRiskDeals>
    <DealCard deal={deal} risk="high">
      <Name>{deal.name}</Name>
      <Amount>{deal.amount}</Amount>
      <RiskFactors>
        <Factor severity="high">No executive engagement (45 days)</Factor>
        <Factor severity="medium">Competitor mentioned in last call</Factor>
        <Factor severity="medium">Close date pushed 2x</Factor>
      </RiskFactors>
      <Recommendation>
        Schedule C-level meeting within 7 days
      </Recommendation>
    </DealCard>
  </AtRiskDeals>
</SalesDashboard>
```

**Intelligence Enhancements**:

```tsx
<SalesIntelligence>
  <PredictiveForecasting>
    <Insight>
      Based on current pipeline health and historical close rates:
      <Prediction>82% probability of hitting $3.6M (80% of quota)</Prediction>
      <Gap>$900K gap to quota</Gap>
      <Recommendation>
        Accelerate 3 deals in negotiation stage (combined value $1.2M, 65% win probability)
      </Recommendation>
    </Insight>
  </PredictiveForecasting>
  
  <DealHealthScoring>
    <DealScore deal="Acme Corp - $450K" score={72}>
      <Dimensions>
        <Dimension name="Relationship Strength" score={85}>
          Champion engaged, 3 contacts active
        </Dimension>
        <Dimension name="Buying Process" score={65}>
          Economic buyer not yet engaged (gap)
        </Dimension>
        <Dimension name="Solution Fit" score={78}>
          Strong technical validation
        </Dimension>
        <Dimension name="Competition" score={60}>
          Competitor actively being evaluated
        </Dimension>
      </Dimensions>
      <NextBestAction>
        Schedule CFO meeting to address budget authority (increases win rate by 34%)
      </NextBestAction>
    </DealScore>
  </DealHealthScoring>
</SalesIntelligence>
```


***

### 3.2 Pipeline (`/sales/pipeline`)

**Purpose**: Visual pipeline management with drag-and-drop

**Data Tables** (same as Sales Dashboard +):


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `opportunity_stages` | id, name, probability, stage_order, is_closed, is_won | Stage definitions |
| `opportunity_stage_history` | id, opportunity_id, from_stage, to_stage, changed_at, changed_by, days_in_stage | Stage transitions |
| `opportunity_products` | id, opportunity_id, product_id, quantity, unit_price, discount_pct, total_price | Line items |
| `opportunity_competitors` | id, opportunity_id, competitor_name, status, strengths[], weaknesses[] | Competitive intel |
| `opportunity_team` | opportunity_id, user_id, role, split_pct | Deal team |

**Pipeline Views**:

```tsx
<PipelineView>
  <ViewControls>
    <FilterBar>
      <Filter type="owner" value={[currentUser, 'team']} />
      <Filter type="closeDate" value="this-quarter" />
      <Filter type="amount" min={10000} />
      <Filter type="forecast" value={['commit', 'bestCase']} />
    </FilterBar>
    
    <ViewToggle>
      <Option value="kanban" active />
      <Option value="table" />
      <Option value="chart" />
    </ViewToggle>
    
    <GroupBy value="stage" options={['stage', 'owner', 'closeDate', 'product']} />
  </ViewControls>
  
  <KanbanBoard>
    {stages.map(stage => (
      <StageColumn stage={stage}>
        <ColumnHeader>
          <StageName>{stage.name}</StageName>
          <StageMetrics>
            <Count>{stage.dealCount} deals</Count>
            <Value>${stage.totalValue}</Value>
            <AvgAge>{stage.avgDaysInStage} days avg</AvgAge>
          </StageMetrics>
        </ColumnHeader>
        
        <DealCards droppable onDrop={handleStageMoved}>
          {stage.deals.map(deal => (
            <DealCard 
              deal={deal} 
              draggable
              onClick={() => openDealDetail(deal.id)}
            >
              <DealHeader>
                <AccountName>{deal.accountName}</AccountName>
                <Amount>{deal.amount}</Amount>
              </DealHeader>
              
              <DealInfo>
                <Owner avatar={deal.owner.avatar}>{deal.owner.name}</Owner>
                <CloseDate overdue={deal.isOverdue}>{deal.closeDate}</CloseDate>
                <Probability>{deal.probability}%</Probability>
              </DealInfo>
              
              <HealthIndicator score={deal.healthScore} />
              
              <Tags>
                {deal.isAtRisk && <Tag color="red">At Risk</Tag>}
                {deal.hasCompetitor && <Tag color="orange">Competition</Tag>}
                {deal.forecastCategory === 'commit' && <Tag color="green">Commit</Tag>}
              </Tags>
              
              <QuickActions>
                <Action icon={Phone} onClick={logCall} />
                <Action icon={Mail} onClick={sendEmail} />
                <Action icon={Calendar} onClick={scheduleMeeting} />
              </QuickActions>
            </DealCard>
          ))}
        </DealCards>
      </StageColumn>
    ))}
  </KanbanBoard>
  
  <BulkActions>
    <Button>Update Stage</Button>
    <Button>Assign Owner</Button>
    <Button>Update Forecast</Button>
    <Button>Export Selected</Button>
  </BulkActions>
</PipelineView>
```


***

### 3.3 Accounts (`/sales/accounts`)

**Purpose**: Customer and prospect account management

**Data Tables Required**:


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `accounts` | id, name, industry, employee_count, annual_revenue, website, status, type, parent_account_id, territory, owner_id, health_score, arr, created_at | Core account data |
| `account_hierarchy` | parent_id, child_id, relationship_type | Corporate structures |
| `account_contacts` | account_id, contact_id, is_primary, role | People relationships |
| `account_opportunities` | account_id, opportunity_id | Deal associations |
| `account_activities` | id, account_id, activity_type, subject, user_id, completed_date, outcome | Engagement history |
| `account_metrics` | account_id, metric_name, value, period, recorded_at | Custom metrics |
| `account_health_factors` | id, account_id, factor_type, score, notes, updated_at | Health scoring |

**Account List View**:

```tsx
<AccountsView>
  <AccountFilters>
    <SegmentFilter values={['enterprise', 'midMarket', 'smb']} />
    <StatusFilter values={['customer', 'prospect', 'partner', 'inactive']} />
    <IndustryFilter industries={industries} />
    <HealthFilter ranges={['healthy', 'at-risk', 'critical']} />
    <ARRFilter min={0} max={1000000} />
    <TerritoryFilter territories={territories} />
  </AccountFilters>
  
  <AccountTable>
    <Columns>
      <Column field="name" sortable searchable />
      <Column field="healthScore" sortable>
        <HealthBadge score={account.healthScore} />
      </Column>
      <Column field="arr" sortable format="currency" />
      <Column field="openOpportunities" sortable />
      <Column field="lastActivity" sortable format="relativeTime" />
      <Column field="owner" />
      <Column field="actions">
        <Actions>
          <Action icon={Eye} label="View" />
          <Action icon={Edit} label="Edit" />
          <Action icon={Mail} label="Email" />
        </Actions>
      </Column>
    </Columns>
    
    <Row account={account} onClick={() => openAccountDetail(account.id)}>
      {/* Row content with inline actions */}
    </Row>
  </AccountTable>
  
  <AccountGridView>
    {accounts.map(account => (
      <AccountCard>
        <Header>
          <Logo src={account.logoUrl} />
          <Name>{account.name}</Name>
          <Industry>{account.industry}</Industry>
        </Header>
        
        <Metrics>
          <Metric label="ARR" value={account.arr} format="currency" />
          <Metric label="Employees" value={account.employeeCount} />
          <Metric label="Open Opps" value={account.openOpportunities} />
        </Metrics>
        
        <HealthIndicator score={account.healthScore}>
          <HealthFactors factors={account.healthFactors} />
        </HealthIndicator>
        
        <RecentActivity>
          {account.recentActivities.slice(0, 3).map(activity => (
            <Activity>{activity.subject}</Activity>
          ))}
        </RecentActivity>
      </AccountCard>
    ))}
  </AccountGridView>
</AccountsView>
```


***

### 3.4 Account Detail (`/sales/accounts/[id]`)

**Purpose**: 360° account intelligence (CS/TAM depth)

**Data Tables** (all account-related tables +):


| Table | Columns | Purpose |
| :-- | :-- | :-- |
| `account_strategic_objectives` | id, account_id, objective_title, description, target_date, progress_pct, value_usd | Customer goals |
| `account_success_metrics` | id, account_id, metric_name, baseline, current, target, unit, measurement_method | Outcome tracking |
| `account_risks` | id, account_id, risk_category, risk_description, impact_score, probability_score, mitigation_plan, owner_id | Risk register |
| `account_touchpoints` | id, account_id, contact_id, user_id, touchpoint_type, date, sentiment_score, notes | Relationship tracking |
| `account_documents` | id, account_id, document_type, file_url, uploaded_by, uploaded_at, tags[] | Supporting docs |

**Account 360° Layout**:

```tsx
<AccountDetailView accountId={accountId}>
  <AccountHeader>
    <CompanyInfo>
      <Logo src={account.logoUrl} size="large" />
      <NameAndIndustry>
        <Name>{account.name}</Name>
        <Industry>{account.industry}</Industry>
        <Location>{account.location}</Location>
      </NameAndIndustry>
    </CompanyInfo>
    
    <KeyMetrics>
      <Metric label="ARR" value={account.arr} format="currency" trend="+15%" />
      <Metric label="Health Score" value={account.healthScore} max={100} />
      <Metric label="Employees" value={account.employeeCount} />
      <Metric label="Renewal Date" value={account.renewalDate} daysUntil={135} />
    </KeyMetrics>
    
    <QuickActions>
      <Button icon={Mail}>Email</Button>
      <Button icon={Phone}>Call</Button>
      <Button icon={Calendar}>Schedule Meeting</Button>
      <Button icon={FileText}>Create Opportunity</Button>
    </QuickActions>
  </AccountHeader>
  
  <TabNavigation>
    <Tab id="overview" label="Overview" />
    <Tab id="opportunities" label="Opportunities" badge={account.openOpps} />
    <Tab id="contacts" label="Contacts" badge={account.contactCount} />
    <Tab id="activities" label="Activities" />
    <Tab id="intelligence" label="Intelligence" />
    <Tab id="health" label="Health & Risk" />
    <Tab id="strategic" label="Strategic Alignment" />
  </TabNavigation>
  
  {/* OVERVIEW TAB */}
  <OverviewTab>
    <Grid cols={3}>
      <Section title="Account Summary">
        <Field label="Type">{account.type}</Field>
        <Field label="Owner">{account.owner.name}</Field>
        <Field label="Territory">{account.territory}</Field>
        <Field label="Parent Account">{account.parentAccount}</Field>
        <Field label="Website">
          <Link href={account.website}>{account.website}</Link>
        </Field>
      </Section>
      
      <Section title="Revenue">
        <RevenueChart data={account.revenueHistory} />
        <Metric label="Current ARR" value={account.arr} />
        <Metric label="Expansion Opportunity" value={account.expansionOpportunity} />
        <Metric label="Lifetime Value" value={account.ltv} />
      </Section>
      
      <Section title="Engagement">
        <EngagementTimeline activities={account.recentActivities} />
        <Metric label="Last Touch" value={account.lastActivity} format="relativeTime" />
        <Metric label="Touches (30d)" value={account.touchCount30d} />
        <Metric label="Sentiment" value={account.sentimentScore} />
      </Section>
    </Grid>
    
    <Section title="Key Stakeholders">
      <StakeholderMap account={account}>
        {/* Relationship graph visualization */}
      </StakeholderMap>
    </Section>
  </OverviewTab>
  
  {/* INTELLIGENCE TAB */}
  <IntelligenceTab>
    <KnowledgeConvergencePanel accountId={accountId}>
      {/* Truth Spine */}
      <TruthSpineSection>
        <CRMData source="Salesforce" lastSync="2m ago" />
        <BillingData source="Stripe" lastSync="5m ago" />
        <SupportData source="Zendesk" lastSync="3m ago" />
        <ProductUsage source="Analytics" lastSync="1m ago" />
      </TruthSpineSection>
      
      {/* Context Engine */}
      <ContextSection>
        <Documents>
          <Doc type="Contract" date="2025-06-15">MSA - Acme Corp</Doc>
          <Doc type="Proposal" date="2026-01-10">Q1 2026 Expansion Proposal</Doc>
        </Documents>
        <EmailThreads>
          <Thread participants={['john@acme', 'sales@company']} count={12} />
        </EmailThreads>
        <MeetingNotes>
          <Note date="2026-01-20">QBR - Strategic Planning Discussion</Note>
        </MeetingNotes>
      </ContextSection>
      
      {/* AI Synthesis */}
      <AISynthesisSection>
        <Signal severity="high" confidence={0.87}>
          <Title>Expansion Opportunity Detected</Title>
          <Insight>
            Account mentioned need for enterprise SSO in last QBR. Usage data shows 8 teams (up from 3). Budget planning cycle starts in February.
          </Insight>
          <Recommendation>
            Schedule expansion discussion with CFO by Feb 5. Historical data: Similar signals led to avg $180K upsell with 72% close rate.
          </Recommendation>
          <Evidence>
            <Item source="Meeting Notes">QBR 2026-01-20: "Need better access control"</Item>
            <Item source="Product Analytics">Team count +167% in 90 days</Item>
            <Item source="CRM">Budget cycle: Feb-March (from past years)</Item>
          </Evidence>
        </Signal>
      </AISynthesisSection>
    </KnowledgeConvergencePanel>
  </IntelligenceTab>
  
  {/* HEALTH & RISK TAB */}
  <HealthRiskTab>
    <HealthScoreBreakdown score={account.healthScore}>
      <Dimension name="Product Usage" score={85} trend="+5">
        <Metrics>
          <Metric>MAU: 847 (up 12%)</Metric>
          <Metric>Feature Adoption: 78%</Metric>
          <Metric>Login Frequency: 4.2x/week</Metric>
        </Metrics>
      </Dimension>
      
      <Dimension name="Relationship Strength" score={72} trend="-8">
        <Metrics>
          <Metric>Executive Engagement: Low (last 45 days)</Metric>
          <Metric>Champion Status: Active</Metric>
          <Metric>Support Satisfaction: 4.2/5</Metric>
        </Metrics>
      </Dimension>
      
      <Dimension name="Commercial Health" score={90} trend="+2">
        <Metrics>
          <Metric>Payment History: Excellent</Metric>
          <Metric>Contract Compliance: 100%</Metric>
          <Metric>Expansion Indicators: Strong</Metric>
        </Metrics>
      </Dimension>
    </HealthScoreBreakdown>
    
    <RiskRegister>
      <RiskCard risk={risk}>
        <RiskTitle>{risk.title}</RiskTitle>
        <RiskScore impact={risk.impact} probability={risk.probability} />
        <RiskCategory>{risk.category}</RiskCategory>
        <MitigationPlan>
          <Status>{risk.mitigationStatus}</Status>
          <Owner>{risk.mitigationOwner}</Owner>
          <Actions>{risk.mitigationActions}</Actions>
        </MitigationPlan>
      </RiskCard>
    </RiskRegister>
  </HealthRiskTab>
  
  {/* STRATEGIC ALIGNMENT TAB */}
  <StrategicAlignmentTab>
    <CustomerObjectives>
      <ObjectiveCard objective={objective}>
        <Title>{objective.title}</Title>
        <Progress value={objective.progressPct} />
        <Timeline start={objective.startDate} target={objective.targetDate} />
        <BusinessValue value={objective.valueUsd} format="currency" />
        <OurContribution>
          How we're helping: {objective.ourContribution}
        </OurContribution>
      </ObjectiveCard>
    </CustomerObjectives>
    
    <SuccessMetrics>
      <MetricCard metric={metric}>
        <MetricName>{metric.name}</MetricName>
        <ProgressChart baseline={metric.baseline} current={metric.current} target={metric.target} />
        <Achievement value={(metric.current - metric.baseline) / (metric.target - metric.baseline) * 100} />
      </MetricCard>
    </SuccessMetrics>
  </StrategicAlignmentTab>
</AccountDetailView>
```


***

**[Continue with remaining departments: Marketing, CS, Engineering, Finance, HR, Projects, Admin...]**

Due to length constraints, I'll provide a summary structure for the remaining departments. Would you like me to:

1. **Complete all departments in the same detail** (will require multiple responses)
2. **Provide condensed version** of remaining departments
3. **Focus on specific departments** you're most interested in

Each department would follow the same pattern:

- Dashboard view with KPIs
- List/table views with filters
- Detail views with 360° intelligence
- Intelligence layers (signals, predictions, recommendations)
- Complete data table schemas

**Let me know how you'd like me to proceed!** 🚀

