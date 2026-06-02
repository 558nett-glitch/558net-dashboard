import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan';
  trend?: { value: number; label: string };
  subtitle?: string;
}

const colorMap = {
  blue: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
    icon: 'bg-blue-500/20 text-blue-400',
    text: 'text-blue-400',
  },
  green: {
    bg: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
    icon: 'bg-green-500/20 text-green-400',
    text: 'text-green-400',
  },
  yellow: {
    bg: 'from-yellow-500/20 to-yellow-600/10',
    border: 'border-yellow-500/20',
    icon: 'bg-yellow-500/20 text-yellow-400',
    text: 'text-yellow-400',
  },
  red: {
    bg: 'from-red-500/20 to-red-600/10',
    border: 'border-red-500/20',
    icon: 'bg-red-500/20 text-red-400',
    text: 'text-red-400',
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/20',
    icon: 'bg-purple-500/20 text-purple-400',
    text: 'text-purple-400',
  },
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/20',
    icon: 'bg-cyan-500/20 text-cyan-400',
    text: 'text-cyan-400',
  },
};

const colorMapLight = {
  blue: {
    bg: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-600',
  },
  green: {
    bg: 'from-green-50 to-green-100/50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    text: 'text-green-600',
  },
  yellow: {
    bg: 'from-yellow-50 to-yellow-100/50',
    border: 'border-yellow-200',
    icon: 'bg-yellow-100 text-yellow-600',
    text: 'text-yellow-600',
  },
  red: {
    bg: 'from-red-50 to-red-100/50',
    border: 'border-red-200',
    icon: 'bg-red-100 text-red-600',
    text: 'text-red-600',
  },
  purple: {
    bg: 'from-purple-50 to-purple-100/50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    text: 'text-purple-600',
  },
  cyan: {
    bg: 'from-cyan-50 to-cyan-100/50',
    border: 'border-cyan-200',
    icon: 'bg-cyan-100 text-cyan-600',
    text: 'text-cyan-600',
  },
};

export const StatCard = ({ title, value, icon, color, trend, subtitle }: StatCardProps) => {
  const { isDark } = useTheme();
  const colors = isDark ? colorMap[color] : colorMapLight[color];

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default',
      colors.bg,
      colors.border,
      isDark ? 'shadow-lg' : 'shadow-sm'
    )}>
      {/* Background decoration */}
      <div className={cn(
        'absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10',
        colors.icon.split(' ')[0]
      )} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-medium truncate', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {title}
          </p>
          <p className={cn(
            'text-2xl font-bold mt-1',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn('text-xs mt-0.5', colors.text)}>{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs',
              trend.value >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {trend.value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl flex-shrink-0', colors.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const SkeletonStatCard = () => {
  const { isDark } = useTheme();
  return (
    <div className={cn(
      'rounded-2xl p-5 border',
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className={cn('h-3 w-24 rounded', isDark ? 'skeleton' : 'skeleton-light')} />
          <div className={cn('h-7 w-16 rounded', isDark ? 'skeleton' : 'skeleton-light')} />
          <div className={cn('h-3 w-20 rounded', isDark ? 'skeleton' : 'skeleton-light')} />
        </div>
        <div className={cn('w-12 h-12 rounded-xl', isDark ? 'skeleton' : 'skeleton-light')} />
      </div>
    </div>
  );
};
