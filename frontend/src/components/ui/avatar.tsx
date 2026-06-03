import { cn } from '@/lib/utils'

function Avatar({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        'relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  alt = '',
  ...props
}: React.ComponentProps<'img'>) {
  return (
    <img
      data-slot="avatar-image"
      alt={alt}
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
