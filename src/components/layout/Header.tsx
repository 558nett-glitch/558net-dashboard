import { Sun, Moon, RefreshCw, Bell, User, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCustomers } from '../../context/CustomerContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { lastSync, refreshData, loading, isUsingDemo } = useCustomers();

  return (
    <header className={cn(
      'sticky top-0 z-20 px-4 sm:px-6 py-4 border-b flex items-center justify-between gap-4',
      isDark
        ? 'bg-slate-900/80 backdrop-blur-xl border-white/10'
        : 'bg-white/80 backdrop-blur-xl border-slate-200'
    )}>
      {/* Title */}
      <div className="min-w-0 pl-10 lg:pl-0">
        <h1 className={cn(
          'text-lg font-bold truncate',
          isDark ? 'text-white' : 'text-slate-900'
        )}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn('text-xs truncate', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Sync Status */}
        <div className={cn(
          'hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs',
          isDark ? 'bg-white/5' : 'bg-slate-100'
        )}>
          {isUsingDemo ? (
            <>
              <WifiOff size={12} className="text-yellow-400" />
              <span className="text-yellow-400">Demo Mode</span>
            </>
          ) : (
            <>
              <Wifi size={12} className="text-green-400" />
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {lastSync ? format(lastSync, 'HH:mm', { locale: id }) : 'Belum sync'}
              </span>
            </>
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={refreshData}
          disabled={loading}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          )}
          title="Refresh data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* Notifications */}
        <button className={cn(
          'relative p-2 rounded-lg transition-colors',
          isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
        )}>
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-lg transition-colors',
            isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          )}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User */}
        <div className={cn(
          'flex items-center gap-2 px-2.5 py-1.5 rounded-lg',
          isDark ? 'bg-white/5' : 'bg-slate-100'
        )}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={12} className="text-white" />
          </div>
          <span className={cn('text-xs font-medium hidden sm:block', isDark ? 'text-slate-300' : 'text-slate-700')}>
            {user?.username}
          </span>
        </div>
      </div>
    </header>
  );
};
