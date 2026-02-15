export type SortOrder = "asc" | "desc"

export type PaginationOptions = {
  limit: number
  offset: number
  sortBy?: string
  sortOrder?: SortOrder
}

export type PaginationResult<T> = {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  sortBy?: string
  sortOrder?: SortOrder
}

export function parsePaginationOptions(searchParams: URLSearchParams): PaginationOptions {
  const limitRaw = parseInt(searchParams.get("limit") || "50", 10)
  const offsetRaw = parseInt(searchParams.get("offset") || "0", 10)

  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50
  const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0

  const sortBy = searchParams.get("sortBy") || undefined
  const sortOrder = validateSortOrder(searchParams.get("sortOrder") || undefined) || undefined

  return { limit, offset, sortBy, sortOrder }
}

export function createPaginationResult<T>(data: T[], total: number, options: PaginationOptions): PaginationResult<T> {
  const totalSafe = Number.isFinite(total) ? total : 0
  const totalPages = Math.max(1, Math.ceil(totalSafe / options.limit))
  const currentPage = Math.floor(options.offset / options.limit) + 1

  return {
    data,
    total: totalSafe,
    limit: options.limit,
    offset: options.offset,
    hasMore: totalSafe > options.offset + options.limit,
    currentPage,
    totalPages,
    sortBy: options.sortBy,
    sortOrder: options.sortOrder,
  }
}

export function getPaginationHeaders(result: PaginationResult<unknown>): Record<string, string> {
  return {
    "x-total-count": String(result.total),
    "x-limit": String(result.limit),
    "x-offset": String(result.offset),
    "x-has-more": String(result.hasMore),
    "x-current-page": String(result.currentPage),
    "x-total-pages": String(result.totalPages),
  }
}

export function validateSortField(value: string | undefined, allow: string[]): string | null {
  if (!value) return null
  return allow.includes(value) ? value : null
}

export function validateSortOrder(value: string | undefined): SortOrder | null {
  if (!value) return null
  return value === "asc" || value === "desc" ? value : null
}
