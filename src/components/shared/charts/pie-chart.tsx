/**
 * Pie Chart Component
 * 
 * Reusable pie chart component using Recharts.
 * Automatically uses theme colors from the color palette.
 * 
 * Use Cases:
 * - Programme distribution
 * - Fee payment status breakdown
 * - Student status distribution
 * - Department allocation
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 12.4
 */

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTenantTheme } from '@/context/tenant-theme-provider'

interface PieChartData {
  name: string
  value: number
}

interface PieChartProps {
  /** Chart title */
  title: string
  /** Chart description */
  description?: string
  /** Chart data */
  data: PieChartData[]
  /** Data key for values */
  dataKey?: string
  /** Chart height */
  height?: number
  /** Show legend */
  showLegend?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Pie Chart Component
 * 
 * Automatically uses theme colors from the institution's color palette.
 */
export function PieChart({
  title,
  description,
  data,
  dataKey = 'value',
  height = 300,
  showLegend = true,
  className,
}: PieChartProps) {
  const { config } = useTenantTheme()
  const palette = config.colorPalette || {
    primary: config.primaryColor || '#0ea5e9',
    secondary: config.primaryColor || '#0ea5e9',
    tertiary: config.primaryColor || '#0ea5e9',
    quaternary: config.primaryColor || '#0ea5e9',
  }

  // Create color array from palette (cycle if needed)
  const colors = [
    palette.primary,
    palette.secondary,
    palette.tertiary,
    palette.quaternary,
  ]

  // Extend colors if we have more data points than colors
  const extendedColors = data.map((_, index) => colors[index % colors.length])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill='#8884d8'
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={extendedColors[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                iconType='circle'
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

