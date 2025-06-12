"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  Icon: LucideIcon
  title: string
  description: string
  actionText?: string
  onActionClick?: () => void
}

export function EmptyState({ Icon, title, description, actionText, onActionClick }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
        <Icon className="h-8 w-8 text-slate-500 dark:text-slate-400" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-base text-slate-500 dark:text-slate-400">{description}</p>
      {actionText && onActionClick && (
        <div className="mt-6">
          <Button onClick={onActionClick}>{actionText}</Button>
        </div>
      )}
    </div>
  )
}
