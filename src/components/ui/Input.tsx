import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const inputBase = (isDark: boolean, hasError: boolean) => cn(
  'w-full rounded-lg px-3 py-2 text-sm transition-all duration-200 focus:outline-none input-field',
  isDark
    ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10'
    : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500',
  hasError && 'border-red-500 focus:border-red-500'
);

export const Input = ({ label, error, icon, className, ...props }: InputProps) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-1">
      {label && (
        <label className={cn('block text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={cn(inputBase(isDark, !!error), icon && 'pl-9', className)}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, options, className, ...props }: SelectProps) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-1">
      {label && (
        <label className={cn('block text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>
          {label}
        </label>
      )}
      <select
        className={cn(inputBase(isDark, !!error), isDark ? 'bg-slate-800' : 'bg-white', className)}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, className, ...props }: TextareaProps) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-1">
      {label && (
        <label className={cn('block text-xs font-medium', isDark ? 'text-slate-300' : 'text-slate-700')}>
          {label}
        </label>
      )}
      <textarea
        className={cn(inputBase(isDark, !!error), 'resize-none', className)}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
