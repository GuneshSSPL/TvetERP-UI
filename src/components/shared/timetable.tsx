/**
 * Timetable Component
 * 
 * Weekly schedule grid showing classes, events, and time slots.
 * Features:
 * - Monday-Sunday columns
 * - Time slots (8:00 AM - 6:00 PM)
 * - Class blocks with subject, room, instructor
 * - Theme-colored blocks based on subject/programme
 * - Responsive design
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface TimetableEvent {
  id: string
  subject: string
  room: string
  instructor: string
  programme?: string
  startTime: string // Format: "HH:MM" (e.g., "09:00")
  endTime: string // Format: "HH:MM" (e.g., "10:30")
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
}

interface TimetableProps {
  events: TimetableEvent[]
  startHour?: number // Default: 8
  endHour?: number // Default: 18
  className?: string
}

const daysOfWeek: TimetableEvent['day'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Generate time slots from startHour to endHour
function generateTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    if (hour < endHour - 1) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
  }
  return slots
}

// Convert time string to minutes from start of day
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Get color class based on subject/programme
function getEventColor(subject: string, programme?: string): string {
  // Use hash of subject name to get consistent color
  const hash = (subject + (programme || '')).split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  const colors = [
    'bg-primary/20 border-primary text-primary',
    'bg-secondary/20 border-secondary text-secondary',
    'bg-tertiary/20 border-tertiary text-tertiary',
    'bg-accent/20 border-accent text-accent-foreground',
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

export function Timetable({
  events,
  startHour = 8,
  endHour = 18,
  className,
}: TimetableProps) {
  const timeSlots = generateTimeSlots(startHour, endHour)
  const slotHeight = 60 // Height in pixels per 30-minute slot

  // Group events by day
  const eventsByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = events.filter((event) => event.day === day)
    return acc
  }, {} as Record<string, TimetableEvent[]>)

  // Calculate position and height for each event
  const getEventStyle = (event: TimetableEvent) => {
    const startMinutes = timeToMinutes(event.startTime)
    const endMinutes = timeToMinutes(event.endTime)
    const duration = endMinutes - startMinutes
    const startSlot = (startMinutes - startHour * 60) / 30
    
    return {
      top: `${startSlot * (slotHeight / 2)}px`,
      height: `${(duration / 30) * (slotHeight / 2)}px`,
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
        <CardDescription>Class schedule for the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
              <div className="p-2 font-semibold text-sm border-r">Time</div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-2 font-semibold text-sm text-center border-r last:border-r-0"
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Time slots and events */}
            <div className="relative">
              {/* Time slot grid */}
              <div className="grid grid-cols-8">
                {timeSlots.map((time, index) => {
                  if (index % 2 === 0) {
                    return (
                      <React.Fragment key={time}>
                        <div className="p-1 text-xs text-muted-foreground border-r border-b border-dashed">
                          {time}
                        </div>
                        {daysOfWeek.map((day) => (
                          <div
                            key={`${day}-${time}`}
                            className="border-r border-b border-dashed last:border-r-0 min-h-[30px]"
                          />
                        ))}
                      </React.Fragment>
                    )
                  }
                  return null
                })}
              </div>

              {/* Event blocks */}
              <div className="absolute inset-0 pointer-events-none">
                {events.map((event) => {
                  const dayIndex = daysOfWeek.indexOf(event.day) + 1
                  const style = getEventStyle(event)
                  const colorClass = getEventColor(event.subject, event.programme)

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        'absolute left-0 right-0 mx-1 p-1.5 rounded border-2 pointer-events-auto',
                        'hover:opacity-90 transition-opacity',
                        colorClass
                      )}
                      style={{
                        ...style,
                        left: `${(dayIndex * 100) / 8}%`,
                        width: `${100 / 8 - 2}%`,
                      }}
                    >
                      <div className="text-xs font-semibold truncate">
                        {event.subject}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {event.room} • {event.instructor}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

