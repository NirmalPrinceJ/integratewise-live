import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

const SCHEMA = 'hub';
const SEARCH_PATH_OPTION = `options=-c%20search_path%3D${SCHEMA}%2Cpublic`;

/**
 * Appends search_path=hub,public to a Neon connection string
 * if it isn't already present.
 */
export function withHubSchema(connectionString: string): string {
  if (connectionString.includes('search_path')) return connectionString;
  const sep = connectionString.includes('?') ? '&' : '?';
  return `${connectionString}${sep}${SEARCH_PATH_OPTION}`;
}

/**
 * Creates a Neon SQL client with search_path=hub,public.
 * Drop-in replacement for `neon(env.DATABASE_URL)`.
 *
 * Usage in a Cloudflare Worker:
 *   import { createDb } from '@integratewise/db';
 *   const sql = createDb(c.env.DATABASE_URL);
 *   const rows = await sql`SELECT * FROM users`; // resolves to hub.users
 */
export function createDb(connectionString: string): NeonQueryFunction<false, false> {
  return neon(withHubSchema(connectionString));
}

export { neon } from '@neondatabase/serverless';
export type { NeonQueryFunction } from '@neondatabase/serverless';
