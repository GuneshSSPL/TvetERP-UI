import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-muted border-2 border-primary text-primary shadow-xs hover:border-primary focus:border-primary',
        secondary:
          'bg-muted border-2 border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] shadow-xs hover:border-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))]',
        tertiary:
          'bg-muted border-2 border-[hsl(var(--tertiary))] text-[hsl(var(--tertiary))] shadow-xs hover:border-[hsl(var(--tertiary))] focus:border-[hsl(var(--tertiary))]',
        destructive:
          'bg-muted border-2 border-destructive text-destructive shadow-xs hover:border-destructive focus:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-2 bg-background shadow-xs hover:border-primary/50 hover:bg-background dark:bg-background dark:border-input dark:hover:border-primary/50 dark:hover:bg-background',
        ghost:
          'border-2 border-transparent hover:border-primary/50 hover:text-primary dark:hover:text-primary',
        link: 'text-primary underline-offset-4 hover:underline border-0',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
