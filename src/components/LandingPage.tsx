import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, FileText, Target } from 'lucide-react';
import { ExampleOutput } from '@/components/ExampleOutput';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/50 to-background" />
      
      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance fade-in">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl text-balance fade-in" style={{ animationDelay: '0.1s' }}>
            {t('heroSubtitle')}
          </p>
          <div className="mt-10 fade-in" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="lg" className="gap-2 text-base px-8 py-6">
              <Link to="/analyze">
                {t('ctaButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      icon: Brain,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      icon: Target,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <section className="border-t border-border/40 bg-card/50">
      <div className="container py-16 md:py-20">
        <h2 className="text-2xl font-bold text-center mb-12 md:text-3xl">
          {t('howItWorks')}
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center p-6"
            >
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExampleSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border/40">
      <div className="container py-16 md:py-20">
        <h2 className="text-2xl font-bold text-center mb-8 md:text-3xl">
          {t('exampleTitle')}
        </h2>
        <div className="max-w-4xl mx-auto">
          <ExampleOutput />
        </div>
      </div>
    </section>
  );
}