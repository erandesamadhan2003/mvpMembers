import { memo, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: ReactNode
  description?: string
  icon?: ReactNode
  className?: string
}

export const StatCard = memo(function StatCard({
  title,
  value,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  )
})
