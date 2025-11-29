import { FileQuestion, FolderOpen, Inbox, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  variant?: 'default' | 'search' | 'folder' | 'inbox'
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

const iconMap = {
  default: FileQuestion,
  search: Search,
  folder: FolderOpen,
  inbox: Inbox,
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[variant]

  return (
    <Empty className={cn('border', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button onClick={action.onClick}>{action.label}</Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
