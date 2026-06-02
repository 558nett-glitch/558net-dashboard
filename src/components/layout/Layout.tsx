import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout = ({ children, title, subtitle }: LayoutProps) => {
  const { isDark } = useTheme();

  return (
    <div className={cn(
      'min-h-screen flex',
      isDark ? 'gradient-bg' : 'gradient-bg-light'
    )}>
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
