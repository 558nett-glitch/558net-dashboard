import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wifi, Receipt, BarChart3,
  Settings, LogOut, Menu, X, ChevronRight, Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pelanggan', icon: Users, label: 'Data Pelanggan' },
  { path: '/monitoring-ont', icon: Wifi, label: 'Monitoring ONT' },
  { path: '/tagihan', icon: Receipt, label: 'Tagihan' },
  { path: '/laporan', icon: BarChart3, label: 'Laporan' },
  { path: '/pengaturan', icon: Settings, label: 'Pengaturan' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b',
        isDark ? 'border-white/10' : 'border-slate-200'
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Globe size={20} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              558NET
            </h1>
            <p className={cn('text-xs truncate', isDark ? 'text-slate-400' : 'text-slate-500')}>
              CMS Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group transition-all',
              isActive
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              collapsed && 'justify-center'
            )}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{label}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={cn(
        'p-3 border-t',
        isDark ? 'border-white/10' : 'border-slate-200'
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            isDark
              ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
              : 'text-red-600 hover:bg-red-50',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={cn(
          'fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden',
          isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-md'
        )}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 lg:hidden transition-transform duration-300',
        isDark ? 'bg-slate-900' : 'bg-white',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className={cn(
            'absolute top-4 right-4 p-1.5 rounded-lg',
            isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
          )}
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300 border-r',
        collapsed ? 'w-16' : 'w-64',
        isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white border-slate-200',
      )}>
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border z-10 transition-colors',
            isDark
              ? 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
          )}
        >
          <ChevronRight size={12} className={cn('transition-transform', collapsed ? '' : 'rotate-180')} />
        </button>

        <SidebarContent />
      </aside>
    </>
  );
};
