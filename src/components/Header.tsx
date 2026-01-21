import { Link, useLocation } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const { t } = useLanguage();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          <BarChart3 className="h-5 w-5 text-primary" />
          <span>PM Reality Check</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {isHome && (
            <Link
              to="/analyze"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              {t('ctaButton')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}