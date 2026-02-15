# Services Development Guide

This document describes the microservices architecture and how to run services continuously during development.

## Architecture Overview

IntegrateWise OS is built as a microservices architecture with the following services:

### Environment Configuration

**Development (Local)**:
- Protocol: HTTP
- Services run on localhost with hot reload
- Service-to-service communication via `http://localhost:PORT`

**Staging**:
- Protocol: HTTPS
- Services deployed to `*-staging.integratewise.ai`
- Service-to-service communication via HTTPS URLs

**Production**:
- Protocol: HTTPS
- Services deployed to `*.integratewise.ai`
- Service-to-service communication via HTTPS URLs
- Full observability and alerting enabled

### Service Port Mapping

| Service | Port | Description |
|---------|------|-------------|
| Gateway | 8001 | API Gateway - Routes requests to services |
| Act | 8002 | Action execution service |
| Think | 8003 | AI reasoning and decision service |
| Govern | 8004 | Governance and policy service |
| Normalizer | 8005 | Data normalization service |
| Loader | 8006 | Data loading service |
| Store | 8007 | Data storage service |
| IQ Hub | 8008 | Intelligence hub service |
| Tenants | 8009 | Multi-tenancy service |
| Knowledge | 8010 | Knowledge bank service |
| Admin | 8011 | Admin service |
| Spine | 8012 | Core backbone service |
| MCP Connector | 8013 | Model Context Protocol connector |
| Main App | 3000 | Next.js frontend application |

## Development Workflow

### Start All Services

Run all microservices in parallel with hot reload:

```bash
pnpm dev:services
```

This will start all services in the `services/` directory concurrently. Each service runs in watch mode and will automatically reload when you make changes.

### Start Frontend + Services

Run the full stack (frontend + all services):

```bash
pnpm dev:all
```

### Start Individual Service

To work on a specific service:

```bash
cd services/gateway
pnpm dev
```

### Run Integration Tests with Live Services

Start services and run integration tests:

```bash
pnpm test:integration:live
```

This will:
1. Start all services in the background
2. Wait for services to be ready
3. Run integration tests against live services
4. Clean up when tests complete

## Hot Reload

Each service is configured with hot reload:

- **Cloudflare Workers** (most services): Use `wrangler dev` with file watching
- **Knowledge Server**: Uses `tsx watch` for TypeScript hot reload

When you modify code in a service:
1. Wrangler/tsx detects the change
2. Only that specific service restarts
3. Other services continue running
4. Tests can continue running against live services

## Service Configuration

Each service has:
- `wrangler.toml` - Cloudflare Worker configuration with dev port
- `package.json` - Scripts and dependencies
- Dev environment variables in `.dev.vars` (if needed)

### Adding a New Service

1. Create service directory in `services/`
2. Add `package.json` with dev script
3. Create `wrangler.toml` with unique port:
   ```toml
   name = "my-service"
   main = "src/index.ts"

   [dev]
   port = 8XXX  # Assign unique port
   ```
4. Service will automatically be included in `pnpm dev:services`

## Troubleshooting

### Port Conflicts

If a service fails to start due to port conflicts:
1. Check if port is in use: `lsof -i :8001`
2. Kill the process: `kill -9 <PID>`
3. Or change the port in `wrangler.toml`

### Service Not Reloading

If changes aren't reflecting:
1. Check the service logs for errors
2. Restart the specific service: `cd services/<name> && pnpm dev`
3. Check file permissions

### Integration Tests Failing

If integration tests can't connect to services:
1. Ensure services are running: `pnpm dev:services`
2. Check service health endpoints
3. Verify port configuration matches test expectations

## CI/CD Considerations

In CI/CD pipelines:
- Services are built separately
- Each service can be deployed independently
- Only changed services are redeployed
- Turbo cache optimizes build times
