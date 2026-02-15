import { NextResponse } from 'next/server';
import { CONNECTOR_CATALOG } from '@integratewise/connectors';

export async function GET() {
  // Map catalog to JSON-safe metadata (exclude class constructors)
  const connectors = CONNECTOR_CATALOG.map(c => ({
    id: c.id,
    name: c.name,
    category: c.category
  }));
  return NextResponse.json({
    object: 'list',
    data: connectors
  });
}
