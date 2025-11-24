/**
 * Kanban Board Component
 * 
 * Column-based task management board with draggable cards.
 * Features:
 * - Multiple columns (e.g., To Do, In Progress, Done)
 * - Draggable cards (using HTML5 drag and drop)
 * - Theme-colored columns and cards
 * - Status badges integrated
 * - Sample use case: Student application workflow or task management
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'
import { GripVertical, User, Calendar } from 'lucide-react'

export interface KanbanCard {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'review' | 'completed'
  assignee?: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  status: KanbanCard['status']
  color?: string
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  initialCards?: KanbanCard[]
  onCardMove?: (cardId: string, newStatus: KanbanCard['status']) => void
  className?: string
}

const defaultColumns: KanbanColumn[] = [
  { id: 'pending', title: 'To Do', status: 'pending' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'review', title: 'Review', status: 'review' },
  { id: 'completed', title: 'Completed', status: 'completed' },
]

const priorityColors = {
  low: 'border-tertiary/50 bg-tertiary/10',
  medium: 'border-secondary/50 bg-secondary/10',
  high: 'border-primary/50 bg-primary/10',
}

export function KanbanBoard({
  columns = defaultColumns,
  initialCards = [],
  onCardMove,
  className,
}: KanbanBoardProps) {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards)
  const [draggedCard, setDraggedCard] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStatus: KanbanCard['status']) => {
    e.preventDefault()
    if (!draggedCard) return

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === draggedCard ? { ...card, status: targetStatus } : card
      )
    )

    onCardMove?.(draggedCard, targetStatus)
    setDraggedCard(null)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  const getCardsForStatus = (status: KanbanCard['status']) => {
    return cards.filter((card) => card.status === status)
  }

  const getColumnColor = (column: KanbanColumn): string => {
    switch (column.status) {
      case 'pending':
        return 'border-secondary/30 bg-secondary/5'
      case 'in-progress':
        return 'border-primary/30 bg-primary/5'
      case 'review':
        return 'border-tertiary/30 bg-tertiary/5'
      case 'completed':
        return 'border-muted/30 bg-muted/5'
      default:
        return 'border-border bg-background'
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnCards = getCardsForStatus(column.status)
          const columnColor = getColumnColor(column)

          return (
            <div
              key={column.id}
              className={cn(
                'flex flex-col rounded-lg border-2 p-4 min-h-[500px]',
                columnColor
              )}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{column.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {columnCards.length} cards
                </Badge>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {columnCards.map((card) => (
                  <Card
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'cursor-move border-2 bg-background hover:border-primary/50 transition-all',
                      card.priority && priorityColors[card.priority],
                      draggedCard === card.id && 'opacity-50'
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold line-clamp-2">
                          {card.title}
                        </CardTitle>
                        <GripVertical className="size-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {card.description && (
                        <CardDescription className="text-xs line-clamp-2">
                          {card.description}
                        </CardDescription>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={card.status} showIcon />
                        {card.priority && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              card.priority === 'high' && 'border-primary text-primary',
                              card.priority === 'medium' && 'border-secondary text-secondary',
                              card.priority === 'low' && 'border-tertiary text-tertiary'
                            )}
                          >
                            {card.priority}
                          </Badge>
                        )}
                      </div>

                      {(card.assignee || card.dueDate) && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                          {card.assignee && (
                            <div className="flex items-center gap-1">
                              <User className="size-3" />
                              <span>{card.assignee}</span>
                            </div>
                          )}
                          {card.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              <span>{card.dueDate}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {card.tags && card.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap pt-1">
                          {card.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {columnCards.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No cards
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

