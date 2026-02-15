# IntegrateWise Monitoring & Alerting Configuration

## Overview
This document outlines the comprehensive monitoring and alerting setup for IntegrateWise backend services deployed on Cloudflare Workers.

## Cloudflare Workers Observability

### Enabled Features
All services now have observability enabled with:
- **Logs**: 100% sampling rate for debugging and troubleshooting
- **Metrics**: Available through Cloudflare Dashboard analytics (not configurable in wrangler.toml)
- **Real-time Analytics**: Live monitoring through Cloudflare Dashboard

### Services with Monitoring
- ✅ spine
- ✅ gateway
- ✅ knowledge
- ✅ think
- ✅ iq-hub
- ✅ loader
- ✅ store
- ✅ govern
- ✅ admin
- ✅ act
- ✅ normalizer
- ✅ webhooks
- ✅ mcp-connector

## Alerting Configuration (Cloudflare Dashboard)

### Recommended Alert Policies

#### 1. Error Rate Alert
```
Trigger: Error Rate > 5%
Duration: 5 minutes
Services: All production services
Notification: Email + Slack
```

#### 2. High Latency Alert
```
Trigger: P95 Response Time > 2 seconds
Duration: 5 minutes
Services: All production services
Notification: Email + PagerDuty
```

#### 3. CPU Usage Alert
```
Trigger: CPU Usage > 80%
Duration: 10 minutes
Services: All production services
Notification: Email
```

#### 4. Cold Start Alert
```
Trigger: Function Invocations with Cold Start > 100/minute
Duration: 5 minutes
Services: All production services
Notification: Email
```

#### 5. Service Down Alert
```
Trigger: No requests received for 10 minutes
Duration: 10 minutes
Services: Critical services (spine, gateway, store)
Notification: Email + SMS + PagerDuty
```

## Application-Level Monitoring

### Health Check Endpoints
Each service should implement a `/health` endpoint that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "service-name",
  "version": "1.0.0"
}
```

### Error Tracking
- Implement structured logging with correlation IDs
- Use Cloudflare Workers logs for error aggregation
- Consider integrating with external error tracking (Sentry, Rollbar)

### Performance Monitoring
- Monitor response times by endpoint
- Track CPU time and memory usage
- Monitor external API call performance

## External Monitoring Integration

### Recommended Tools
1. **DataDog**: Comprehensive APM and monitoring
2. **New Relic**: Application performance monitoring
3. **Sentry**: Error tracking and alerting
4. **Grafana**: Custom dashboards with Cloudflare metrics

### Cloudflare Web Analytics
- Enable Web Analytics for user-facing services
- Track page views, unique visitors, bounce rates
- Monitor Core Web Vitals

## Dashboard Setup

### Cloudflare Dashboard
1. Navigate to Workers & Pages > [Service Name]
2. View Real-time logs and metrics
3. Set up custom notification policies
4. Monitor invocation counts and performance

### Custom Monitoring Dashboard
Consider creating a dashboard that aggregates:
- Service health status
- Error rates across all services
- Performance metrics (latency, throughput)
- Resource utilization
- Business metrics (successful transactions, etc.)

## Incident Response

### Alert Escalation
1. **Level 1**: Email notifications for non-critical alerts
2. **Level 2**: Slack notifications for performance degradation
3. **Level 3**: PagerDuty/SMS for service outages

### Runbooks
Create runbooks for common incidents:
- Service deployment failures
- High error rates
- Performance degradation
- Database connectivity issues

## Maintenance

### Regular Monitoring Tasks
- Weekly review of error logs
- Monthly performance trend analysis
- Quarterly alerting threshold adjustments
- Annual monitoring tool evaluation

### Log Retention
- Cloudflare retains logs for 7 days by default
- Consider exporting critical logs to external storage
- Set up log aggregation for long-term analysis

## Security Monitoring

### Additional Alerts
- Unusual traffic patterns
- Failed authentication attempts
- API rate limit violations
- Suspicious request patterns

This monitoring setup provides comprehensive visibility into your IntegrateWise application's health and performance, enabling proactive issue resolution and optimal user experience.