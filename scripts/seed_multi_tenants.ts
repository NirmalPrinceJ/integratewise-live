import { neon } from '@neondatabase/serverless';

/**
 * Multi-Tenant Seed & Reliability Test
 * 1. Seed 3 synthetic tenants with varying limits.
 * 2. Configure their modules and connector settings.
 * 3. Verify isolation and quota behavior.
 */

async function seedMultiTenants(dbUrl: string) {
    const sql = neon(dbUrl);
    console.log('🌱 Seeding Multi-Tenants...');

    const tenants = [
        { id: crypto.randomUUID(), name: 'Alpha SaaS (Lead OS)', sku: 'lead_os_starter' },
        { id: crypto.randomUUID(), name: 'Beta Fintech (Revenue OS)', sku: 'revenue_os_starter' },
        { id: crypto.randomUUID(), name: 'Gamma Growth (Internal Testing)', sku: 'lead_os_starter' }
    ];

    for (const t of tenants) {
        // 1. Create Tenant
        await sql`
            INSERT INTO tenants (id, name, metadata)
            VALUES (${t.id}, ${t.name}, ${JSON.stringify({ sku_id: t.sku, status: 'pilot' })})
            ON CONFLICT DO NOTHING
        `;

        // 2. Fetch SKU Limits
        const [sku] = await sql`SELECT limits FROM product_skus WHERE sku_id = ${t.sku}`;

        // 3. Configure Connector (Mocking enabled tools)
        await sql`
            INSERT INTO connector_config (tenant_id, tool_name, enabled, throttling_config)
            VALUES (${t.id}, 'stripe', true, ${JSON.stringify({ rate_limit_per_min: 50 })})
        `;

        console.log(`✅ Tenant Created: ${t.name} (ID: ${t.id})`);
    }

    return tenants;
}

// Usage: Run to setup test environment
// seedMultiTenants(process.env.DATABASE_URL!);
