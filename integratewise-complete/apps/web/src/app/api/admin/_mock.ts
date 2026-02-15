import { NextResponse } from "next/server"

export function ok<T>(data: T) {
  return NextResponse.json({ success: true, data })
}

export function created<T>(data: T, auditId = `audit_${Math.random().toString(16).slice(2)}`) {
  return NextResponse.json({ success: true, created: true, auditId, data })
}

export function updated<T>(data: T, auditId = `audit_${Math.random().toString(16).slice(2)}`) {
  return NextResponse.json({ success: true, updated: true, auditId, data })
}
