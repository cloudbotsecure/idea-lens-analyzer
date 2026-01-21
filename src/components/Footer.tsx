import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t('disclaimer')}
        </p>
      </div>
    </footer>
  );
}