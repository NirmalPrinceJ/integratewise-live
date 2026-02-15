import { NextResponse } from "next/server"

type AppErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR"

export class AppError extends Error {
  code: AppErrorCode
  status: number
  details?: unknown

  constructor(code: AppErrorCode, message: string, status = 500, details?: unknown) {
    super(message)
    this.code = code
    this.status = status
    this.details = details
  }
}

export function createAppError(code: AppErrorCode, message: string, status = 500, details?: unknown): AppError {
  return new AppError(code, message, status, details)
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: { success: false, error: { code: error.code, message: error.message, details: error.details } },
    }
  }

  const message = error instanceof Error ? error.message : "Unknown error"
  return {
    status: 500,
    body: { success: false, error: { code: "INTERNAL_ERROR", message } },
  }
}

export function withErrorHandling<T>(
  handler: (request: any, context?: any) => Promise<T> | T,
): (request: any, context?: any) => Promise<any> {
  return async (request: any, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      const { status, body } = handleApiError(error)
      return NextResponse.json(body, { status })
    }
  }
}
