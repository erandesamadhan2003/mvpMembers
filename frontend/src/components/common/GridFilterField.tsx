import { memo, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface GridFilterFieldProps {
    label: string
    htmlFor?: string
    children: ReactNode
    className?: string
}

export const GridFilterField = memo(function GridFilterField({
    label,
    htmlFor,
    children,
    className,
}: GridFilterFieldProps) {
    return (
        <div className={cn('flex min-w-40 flex-col gap-1.5', className)}>
            <Label
                htmlFor={htmlFor}
                className="text-xs font-medium text-muted-foreground"
            >
                {label}
            </Label>
            {children}
        </div>
    )
})