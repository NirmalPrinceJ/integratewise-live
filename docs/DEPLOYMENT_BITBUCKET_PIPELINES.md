# Deployment via Bitbucket Pipelines

This repository is configured with Bitbucket Pipelines for automated testing, database migrations, and Cloudflare Worker deployment.

## Pipeline Structure

- **Default**: Every push triggers a build and lint check.
- **feature/integratewise-os-internal**: Automatically deploys to the `dev` environment.
- **main**: Deploys to `prod` (manual trigger required).

## Environment Variables

The following variables must be configured in Bitbucket (Repository Settings > Pipelines > Repository Variables):

- `NEON_DATABASE_URL`: Connection string for the Neon database.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token with "Workers Deployment" permissions.

## Database Migrations

Migrations are stored in `sql-migrations/*.sql`. The pipeline applies these using `psql`.

- Migrations are applied BEFORE the code deployment to ensure the schema is ready.
- To run migrations manually:

  ```bash
  psql $NEON_DATABASE_URL -f sql-migrations/00X_migration_name.sql
  ```

## Rollbacks

- **Code**: To roll back a worker, deploy the previous successful build or re-run an older pipeline.
- **Database**: The system currently uses forward-only migrations. For database rollbacks, you must manually run a reverse SQL script or use Neon's "Point-in-Time Recovery" (PITR).
