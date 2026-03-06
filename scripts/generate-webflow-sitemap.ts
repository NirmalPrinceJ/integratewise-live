/**
 * Generate a proper sitemap.xml for Webflow site
 * 
 * Run: npx ts-node scripts/generate-webflow-sitemap.ts
 * 
 * This generates a sitemap that can be:
 * 1. Uploaded to Webflow via custom code
 * 2. Hosted on your Next.js app and proxied
 */

const WEBFLOW_API_URL = 'https://api.webflow.com/v2'
const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID || '696dbefa23d782ae6fb81d40'

// Your production domain
const SITE_DOMAIN = 'https://integratewise.ai'

// Pages to exclude from sitemap
const EXCLUDED_PATHS = [
  '/404',
  '/401',
  '/style-guide',
]

// Pages with duplicate slugs - use the canonical version
const CANONICAL_SLUGS: Record<string, string> = {
  '/how-it-works-2': '/how-it-works',
  '/how-it-works-3': '/how-it-works',
  '/use-cases-2': '/use-cases',
  '/roles-2': '/roles',
  '/case-studies-2': '/case-studies',
  '/blog-2': '/blog',
}

// Priority by page type
const PRIORITY_MAP: Record<string, number> = {
  '/': 1.0,
  '/pricing': 0.9,
  '/integrations': 0.8,
  '/how-it-works': 0.8,
  '/use-cases': 0.7,
  '/roles': 0.7,
  '/architecture': 0.7,
  '/security-governance': 0.7,
  '/case-studies': 0.6,
  '/blog': 0.6,
}

interface WebflowPage {
  id: string
  title: string
  slug: string | null
  publishedPath: string
  lastUpdated: string
  draft: boolean
  archived: boolean
}

async function fetchWebflowPages(): Promise<WebflowPage[]> {
  const response = await fetch(`${WEBFLOW_API_URL}/sites/${WEBFLOW_SITE_ID}/pages`, {
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'accept-version': '2.0.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`)
  }

  const data = await response.json()
  return data.pages
}

function shouldIncludePage(page: WebflowPage): boolean {
  if (page.draft || page.archived) return false
  
  const path = page.publishedPath
  
  // Exclude specific paths
  if (EXCLUDED_PATHS.some(excluded => path.startsWith(excluded))) {
    return false
  }
  
  // Exclude duplicate slugs (use canonical instead)
  if (CANONICAL_SLUGS[path]) {
    return false
  }
  
  return true
}

function getPriority(path: string): number {
  // Exact match
  if (PRIORITY_MAP[path]) return PRIORITY_MAP[path]
  
  // Parent path match
  const parentPath = '/' + path.split('/')[1]
  if (PRIORITY_MAP[parentPath]) return PRIORITY_MAP[parentPath] - 0.1
  
  return 0.5
}

function getChangeFreq(path: string): string {
  if (path === '/') return 'daily'
  if (path === '/blog' || path.startsWith('/blog/')) return 'daily'
  if (path === '/pricing') return 'weekly'
  return 'monthly'
}

function generateSitemapXml(pages: WebflowPage[]): string {
  const filteredPages = pages.filter(shouldIncludePage)
  
  const urls = filteredPages.map(page => {
    const path = page.publishedPath
    const lastMod = new Date(page.lastUpdated).toISOString().split('T')[0]
    const priority = getPriority(path)
    const changeFreq = getChangeFreq(path)
    
    return `  <url>
    <loc>${SITE_DOMAIN}${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

function generateSitemapReport(pages: WebflowPage[]): string {
  const included = pages.filter(shouldIncludePage)
  const excluded = pages.filter(p => !shouldIncludePage(p))
  
  let report = `# Sitemap Generation Report\n\n`
  report += `Generated: ${new Date().toISOString()}\n\n`
  report += `## Summary\n`
  report += `- Total pages: ${pages.length}\n`
  report += `- Included in sitemap: ${included.length}\n`
  report += `- Excluded: ${excluded.length}\n\n`
  
  report += `## Included Pages\n`
  included.forEach(p => {
    report += `- ${p.publishedPath} (${p.title})\n`
  })
  
  report += `\n## Excluded Pages\n`
  excluded.forEach(p => {
    const reason = p.draft ? 'Draft' : 
                   p.archived ? 'Archived' : 
                   CANONICAL_SLUGS[p.publishedPath] ? 'Duplicate' :
                   'Excluded path'
    report += `- ${p.publishedPath} (${p.title}) - ${reason}\n`
  })
  
  return report
}

async function main() {
  console.log('🔍 Fetching Webflow pages...')
  
  const pages = await fetchWebflowPages()
  console.log(`📄 Found ${pages.length} pages`)
  
  const sitemap = generateSitemapXml(pages)
  const report = generateSitemapReport(pages)
  
  // Output sitemap
  console.log('\n📋 Generated Sitemap:\n')
  console.log(sitemap)
  
  console.log('\n📊 Report:\n')
  console.log(report)
  
  // In a real scenario, you'd write these to files:
  // fs.writeFileSync('public/sitemap.xml', sitemap)
  // fs.writeFileSync('sitemap-report.md', report)
}

// Export for use as module
export { fetchWebflowPages, generateSitemapXml, generateSitemapReport }

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
