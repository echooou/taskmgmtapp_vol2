import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutList, Plus, Calendar, Settings } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('taskList'), icon: LayoutList },
    { path: '/new', label: t('newTask'), icon: Plus },
    { path: '/calendar', label: t('calendar'), icon: Calendar },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:block bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">{t('taskManagement')}</h1>
            <nav className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800 shadow-sm'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 text-center">{t('taskManagement')}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-blue-100 z-50">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-100 to-purple-100 text-blue-700'
                    : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
