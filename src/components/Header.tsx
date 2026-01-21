import { Link, useLocation } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const location = useLocation();
  const { t } = useLanguage();
  const isHome = location.pathname === '/';

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(to bottom, hsl(var(--background) / 0.95), hsl(var(--background) / 0.85))'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-lg metal-button flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-lg tracking-tight">PM Reality Check</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          {isHome && (
            <Link
              to="/analyze"
              className="hidden sm:inline-flex items-center justify-center rounded-lg metal-button px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all"
            >
              {t('ctaButton')}
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
