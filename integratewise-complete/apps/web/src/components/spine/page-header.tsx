import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  stageId?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, stageId, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {stageId && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">{stageId}</span>
          )}
        </div>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
