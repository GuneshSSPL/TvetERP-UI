/**
 * Line Chart Component
 * 
 * Reusable line chart component using Recharts.
 * Automatically uses theme colors from the color palette.
 * 
 * Use Cases:
 * - Enrollment trends over time
 * - Revenue trends
 * - Performance curves
 * - Attendance trends
 * 
 * @see Tvet Erp Requirements Questions (6).txt Section 12.4
 */

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useTenantTheme } from '@/context/tenant-theme-provider'

interface LineChartData {
  name: string
  [key: string]: string | number
}

interface LineChartProps {
  /** Chart title */
  title: string
  /** Chart description */
  description?: string
  /** Chart data */
  data: LineChartData[]
  /** Data keys to display (lines) */
  dataKeys: string[]
  /** X-axis key (usually 'name') */
  xAxisKey?: string
  /** Chart height */
  height?: number
  /** Show legend */
  showLegend?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Line Chart Component
 * 
 * Automatically uses theme colors from the institution's color palette.
 */
export function LineChart({
  title,
  description,
  data,
  dataKeys,
  xAxisKey = 'name',
  height = 300,
  showLegend = true,
  className,
}: LineChartProps) {
  const { config } = useTenantTheme()
  const palette = config.colorPalette || {
    primary: config.primaryColor || '#0ea5e9',
    secondary: config.primaryColor || '#0ea5e9',
    tertiary: config.primaryColor || '#0ea5e9',
    quaternary: config.primaryColor || '#0ea5e9',
  }

  // Map data keys to palette colors
  const colorMap = [
    palette.primary,
    palette.secondary,
    palette.tertiary,
    palette.quaternary,
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={height}>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis
              dataKey={xAxisKey}
              className='text-xs text-muted-foreground'
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className='text-xs text-muted-foreground' tick={{ fill: 'currentColor' }} />
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
                iconType='line'
              />
            )}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type='monotone'
                dataKey={key}
                stroke={colorMap[index % colorMap.length]}
                strokeWidth={2}
                dot={{ fill: colorMap[index % colorMap.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

