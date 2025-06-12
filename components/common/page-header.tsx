import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description: string
  children?: ReactNode // For action buttons like "Add Item"
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700 mb-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  )
}
