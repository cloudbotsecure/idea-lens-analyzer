import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border/40 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient -z-10 opacity-50" />
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium">PM Reality Check</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
}
