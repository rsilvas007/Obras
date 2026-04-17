import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'amber' | 'red'
}

export function ProgressBar({ value, className, showLabel = false, size = 'md', color = 'blue' }: ProgressBarProps) {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  }

  const barColor = value >= 100 ? 'bg-emerald-500' : value < 30 ? colors.red : colors[color]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-600 w-10 text-right">{value}%</span>
      )}
    </div>
  )
}
