/**
 * Simple Form Component
 * 
 * User-friendly single-page form for quick inputs like:
 * - Leave application
 * - Fee payment
 * - Quick student registration
 * - Material requisition
 * 
 * Features:
 * - Clean, simple layout
 * - Field validation
 * - Responsive design
 * - Accessible form controls
 * 
 * @see Tvet Erp Requirements Questions (6).txt for use cases
 */

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormField {
  /** Field label */
  label: string
  /** Field name (for form data) */
  name: string
  /** Field input component */
  input: ReactNode
  /** Field description/help text */
  description?: string
  /** Whether field is required */
  required?: boolean
  /** Field width (default: full) */
  width?: 'full' | 'half' | 'third' | 'quarter'
}

interface SimpleFormProps {
  /** Form title */
  title: string
  /** Form description */
  description?: string
  /** Form fields */
  fields: FormField[]
  /** Submit handler */
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>
  /** Cancel handler */
  onCancel?: () => void
  /** Submit button text */
  submitText?: string
  /** Cancel button text */
  cancelText?: string
  /** Show cancel button */
  showCancel?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Simple Form Component
 * 
 * Perfect for quick forms like leave applications, fee payments, etc.
 */
export function SimpleForm({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showCancel = true,
  className,
}: SimpleFormProps) {
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
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6 sm:grid-cols-2'>
            {fields.map((field) => (
              <div
                key={field.name}
                className={cn('space-y-2', getWidthClass(field.width))}
              >
                <label
                  htmlFor={field.name}
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {field.label}
                  {field.required && (
                    <span className='text-destructive ml-1'>*</span>
                  )}
                </label>
                {field.input}
                {field.description && (
                  <p className='text-xs text-muted-foreground'>
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className='flex flex-col sm:flex-row justify-end gap-2 pt-4'>
            {showCancel && onCancel && (
              <Button type='button' variant='outline' onClick={onCancel} className='w-full sm:w-auto'>
                {cancelText}
              </Button>
            )}
            <Button type='submit' className='w-full sm:w-auto'>{submitText}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

