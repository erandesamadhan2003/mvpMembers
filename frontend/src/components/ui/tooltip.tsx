import { cn } from '@/lib/utils'

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <span className="relative inline-flex group">{children}</span>
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function TooltipContent({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover:block',
        className,
      )}
    >
      {children}
    </span>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
