/**
 * Inline Form Component
 * 
 * For inline editing in tables, like:
 * - Grade entry in grade sheets
 * - Quick attendance marking
 * - Inline student info updates
 * 
 * Features:
 * - Compact design
 * - Inline validation
 * - Quick save/cancel
 * 
 * @see Tvet Erp Requirements Questions (6).txt for use cases
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InlineField {
  /** Field label */
  label: string
  /** Field name */
  name: string
  /** Field type */
  type?: 'text' | 'number' | 'email' | 'date' | 'select'
  /** Default value */
  defaultValue?: string | number
  /** Select options (if type is select) */
  options?: { label: string; value: string }[]
  /** Whether field is required */
  required?: boolean
}

interface InlineFormProps {
  /** Form fields */
  fields: InlineField[]
  /** Save handler */
  onSave: (data: Record<string, unknown>) => void | Promise<void>
  /** Cancel handler */
  onCancel?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Inline Form Component
 * 
 * Perfect for quick inline edits in tables.
 */
export function InlineForm({
  fields,
  onSave,
  onCancel,
  className,
}: InlineFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {}
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? ''
    })
    return initial
  })

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className={cn('flex flex-wrap items-end gap-4', className)}>
      {fields.map((field) => (
        <div key={field.name} className='flex-1 min-w-[150px]'>
          <Label htmlFor={field.name} className='text-xs'>
            {field.label}
            {field.required && (
              <span className='text-destructive ml-1'>*</span>
            )}
          </Label>
          {field.type === 'select' && field.options ? (
            <select
              id={field.name}
              name={field.name}
              value={String(formData[field.name] ?? '')}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={String(formData[field.name] ?? '')}
              onChange={(e) =>
                handleChange(
                  field.name,
                  field.type === 'number'
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              required={field.required}
              className='h-9'
            />
          )}
        </div>
      ))}
      <div className='flex gap-2'>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={onCancel || (() => {})}
        >
          <X className='h-4 w-4' />
        </Button>
        <Button type='button' size='sm' onClick={handleSave}>
          <Check className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

