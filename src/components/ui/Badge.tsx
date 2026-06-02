import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    default: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Aktif') return <Badge variant="success">{status}</Badge>;
  if (status === 'Suspend') return <Badge variant="warning">{status}</Badge>;
  if (status === 'Nonaktif') return <Badge variant="danger">{status}</Badge>;
  if (status === 'Lunas') return <Badge variant="success">{status}</Badge>;
  if (status === 'Belum Lunas') return <Badge variant="warning">{status}</Badge>;
  if (status === 'Menunggak') return <Badge variant="danger">{status}</Badge>;
  return <Badge>{status}</Badge>;
};
