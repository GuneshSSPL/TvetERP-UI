/**
 * Modal Form Component
 * 
 * For popup forms like:
 * - Quick student add
 * - Material requisition
 * - Leave application popup
 * - Quick fee payment
 * 
 * Features:
 * - Dialog/modal wrapper
 * - Clean form layout
 * - Close on submit/cancel
 * 
 * @see Tvet Erp Requirements Questions (6).txt for use cases
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { type FormField } from './simple-form'
import { cn } from '@/lib/utils'

interface ModalFormProps {
  /** Whether modal is open */
  open: boolean
  /** Close handler */
  onClose: () => void
  /** Form title */
  title: string
  /** Form description */
  description?: string
  /** Form fields */
  fields: FormField[]
  /** Submit handler */
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>
  /** Submit button text */
  submitText?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * Modal Form Component
 * 
 * Perfect for quick popup forms.
 */
export function ModalForm({
  open,
  onClose,
  title,
  description,
  fields,
  onSubmit,
  submitText = 'Submit',
  className,
}: ModalFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {}
    
    fields.forEach((field) => {
      const value = formData.get(field.name)
      if (value !== null) {
        data[field.name] = value
      }
    })
    
    onSubmit(data)
    onClose()
  }

  const getWidthClass = (width?: string) => {
    switch (width) {
      case 'half':
        return 'w-full sm:w-1/2'
      case 'third':
        return 'w-full sm:w-1/3'
      case 'quarter':
        return 'w-full sm:w-1/4'
      default:
        return 'w-full'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn('max-w-2xl', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            {fields.map((field) => (
              <div
                key={field.name}
                className={cn('space-y-2', getWidthClass(field.width))}
              >
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && (
                    <span className='text-destructive ml-1'>*</span>
                  )}
                </Label>
                {field.input}
                {field.description && (
                  <p className='text-xs text-muted-foreground'>
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

