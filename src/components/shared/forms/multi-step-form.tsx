/**
 * Multi-Step Form Component
 * 
 * User-friendly multi-step form for complex workflows like:
 * - Student admission (Personal Info → Academic → Documents → Payment)
 * - Staff onboarding
 * - Material requisition workflows
 * 
 * Features:
 * - Progress indicator
 * - Step validation
 * - Navigation between steps
 * - Responsive design
 * 
 * @see Tvet Erp Requirements Questions (6).txt for use cases
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormStep {
  /** Step title */
  title: string
  /** Step description */
  description?: string
  /** Step content (React node) */
  content: React.ReactNode
  /** Validation function - returns true if step is valid */
  validate?: () => boolean
}

interface MultiStepFormProps {
  /** Form steps */
  steps: FormStep[]
  /** Form title */
  title?: string
  /** Submit handler */
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>
  /** Cancel handler */
  onCancel?: () => void
  /** Submit button text */
  submitText?: string
  /** Show progress bar */
  showProgress?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Multi-Step Form Component
 * 
 * Perfect for student admission, staff onboarding, and other multi-step workflows.
 */
export function MultiStepForm({
  steps,
  title,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  showProgress = true,
  className,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  const progress = ((currentStep + 1) / steps.length) * 100
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  /**
   * Validate current step
   */
  const validateStep = (): boolean => {
    const step = steps[currentStep]
    if (step.validate) {
      const isValid = step.validate()
      setErrors((prev) => ({ ...prev, [currentStep]: !isValid }))
      return isValid
    }
    return true
  }

  /**
   * Go to next step
   */
  const handleNext = () => {
    if (validateStep()) {
      if (isLastStep) {
        handleSubmit()
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    }
  }

  /**
   * Go to previous step
   */
  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  /**
   * Go to specific step
   */
  const handleStepClick = (index: number) => {
    if (index <= currentStep || validateStep()) {
      setCurrentStep(index)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (validateStep()) {
      await onSubmit(formData)
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className='space-y-6'>
        {/* Progress Bar */}
        {showProgress && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>
        )}

        {/* Step Indicators */}
        <div className='flex items-center justify-between'>
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isClickable = index <= currentStep

            return (
              <div
                key={index}
                className='flex flex-1 items-center'
                onClick={() => isClickable && handleStepClick(index)}
              >
                <div className='flex flex-col items-center flex-1'>
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                      isActive && 'border-primary bg-primary text-primary-foreground',
                      isCompleted &&
                        'border-primary bg-primary text-primary-foreground',
                      !isActive &&
                        !isCompleted &&
                        'border-muted bg-background',
                      isClickable && 'cursor-pointer hover:border-primary/50'
                    )}
                  >
                    {isCompleted ? (
                      <Check className='h-5 w-5' />
                    ) : (
                      <span className='text-sm font-medium'>{index + 1}</span>
                    )}
                  </div>
                  <div className='mt-2 text-center'>
                    <div
                      className={cn(
                        'text-xs font-medium',
                        isActive && 'text-primary',
                        !isActive && 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 flex-1',
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Content */}
        <div className='min-h-[300px] rounded-lg border p-6'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold'>
              {steps[currentStep].title}
            </h3>
            {steps[currentStep].description && (
              <p className='text-sm text-muted-foreground'>
                {steps[currentStep].description}
              </p>
            )}
          </div>
          <div>{steps[currentStep].content}</div>
          {errors[currentStep] && (
            <div className='mt-4 text-sm text-destructive'>
              Please complete all required fields
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-between'>
          <div>
            {onCancel && (
              <Button variant='outline' onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
          <div className='flex gap-2'>
            {!isFirstStep && (
              <Button variant='outline' onClick={handlePrevious}>
                <ChevronLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? (
                submitText
              ) : (
                <>
                  Next
                  <ChevronRight className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

