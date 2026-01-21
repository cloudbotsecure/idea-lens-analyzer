import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, FileText, Target, Sparkles } from 'lucide-react';
import { ExampleOutput } from '@/components/ExampleOutput';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden hero-gradient min-h-[70vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="container py-20 md:py-28">
        <motion.div 
          className="mx-auto max-w-3xl text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Product Analysis
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-balance bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text"
          >
            {t('heroTitle')}
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="mt-6 text-lg text-muted-foreground md:text-xl text-balance"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div variants={fadeInUp} className="mt-10">
            <Button asChild size="lg" className="gap-2 text-base px-8 py-6 metal-button">
              <Link to="/analyze">
                {t('ctaButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
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
    <section className="relative border-t border-border/40">
      <div className="absolute inset-0 mesh-gradient -z-10" />
      <div className="container py-16 md:py-24">
        <motion.h2 
          className="text-2xl font-bold text-center mb-16 md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('howItWorks')}
        </motion.h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="metal-card p-8 h-full flex flex-col items-center text-center">
                {/* Step number badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full metal-button text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon container with glow */}
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 mt-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <step.icon className="w-8 h-8 text-primary" />
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl -z-10" />
                </motion.div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
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
      <div className="container py-16 md:py-24">
        <motion.h2 
          className="text-2xl font-bold text-center mb-10 md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('exampleTitle')}
        </motion.h2>
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <ExampleOutput />
        </motion.div>
      </div>
    </section>
  );
}
