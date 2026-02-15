/**
 * Webflow API Client
 * 
 * Used for:
 * - Syncing content from CMS
 * - Fetching form submissions
 * - Managing site data
 */

const WEBFLOW_API_URL = 'https://api.webflow.com/v2'

interface WebflowConfig {
  apiToken: string
  siteId?: string
}

class WebflowClient {
  private apiToken: string
  private siteId?: string

  constructor(config: WebflowConfig) {
    this.apiToken = config.apiToken
    this.siteId = config.siteId
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${WEBFLOW_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        'accept-version': '2.0.0',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(
        `Webflow API Error: ${response.status} ${response.statusText} - ${JSON.stringify(error)}`
      )
    }

    return response.json()
  }

  /**
   * Get all sites accessible with this token
   */
  async getSites() {
    return this.request<{ sites: WebflowSite[] }>('/sites')
  }

  /**
   * Get site details
   */
  async getSite(siteId: string) {
    return this.request<WebflowSite>(`/sites/${siteId}`)
  }

  /**
   * Get all collections for a site
   */
  async getCollections(siteId: string) {
    return this.request<{ collections: WebflowCollection[] }>(
      `/sites/${siteId}/collections`
    )
  }

  /**
   * Get items from a collection
   */
  async getCollectionItems(collectionId: string, options?: {
    offset?: number
    limit?: number
  }) {
    const params = new URLSearchParams()
    if (options?.offset) params.set('offset', String(options.offset))
    if (options?.limit) params.set('limit', String(options.limit))
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<{ items: WebflowCollectionItem[] }>(
      `/collections/${collectionId}/items${query}`
    )
  }

  /**
   * Get form submissions
   */
  async getFormSubmissions(formId: string) {
    return this.request<{ submissions: WebflowFormSubmission[] }>(
      `/forms/${formId}/submissions`
    )
  }

  /**
   * Publish site
   */
  async publishSite(siteId: string, domains?: string[]) {
    return this.request<{ publishedOn: string }>(`/sites/${siteId}/publish`, {
      method: 'POST',
      body: JSON.stringify({ domains }),
    })
  }
}

// Types
export interface WebflowSite {
  id: string
  displayName: string
  shortName: string
  previewUrl: string
  timeZone: string
  createdOn: string
  lastPublished: string
  lastUpdated: string
  customDomains: Array<{
    id: string
    url: string
  }>
}

export interface WebflowCollection {
  id: string
  displayName: string
  singularName: string
  slug: string
  createdOn: string
  lastUpdated: string
}

export interface WebflowCollectionItem {
  id: string
  fieldData: Record<string, unknown>
  createdOn: string
  lastUpdated: string
  isArchived: boolean
  isDraft: boolean
}

export interface WebflowFormSubmission {
  id: string
  formId: string
  siteId: string
  data: Record<string, string>
  dateSubmitted: string
}

// Singleton instance
let webflowClient: WebflowClient | null = null

export function getWebflowClient(): WebflowClient {
  if (!webflowClient) {
    const apiToken = process.env.WEBFLOW_API_TOKEN
    if (!apiToken) {
      throw new Error('WEBFLOW_API_TOKEN environment variable is not set')
    }
    webflowClient = new WebflowClient({
      apiToken,
      siteId: process.env.WEBFLOW_SITE_ID,
    })
  }
  return webflowClient
}

export { WebflowClient }
