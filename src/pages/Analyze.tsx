import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisOutput } from '@/lib/types';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_CHARS = 1000;
const TOTAL_STEPS = 5;

export default function Analyze() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; output: AnalysisOutput } | null>(null);

  const [formData, setFormData] = useState({
    productIdea: '',
    targetUser: '',
    problem: '',
    whyItWorks: '',
    monetization: '',
  });

  const fields = [
    { key: 'productIdea', label: t('productIdeaLabel'), placeholder: t('productIdeaPlaceholder'), required: true },
    { key: 'targetUser', label: t('targetUserLabel'), placeholder: t('targetUserPlaceholder'), required: true },
    { key: 'problem', label: t('problemLabel'), placeholder: t('problemPlaceholder'), required: true },
    { key: 'whyItWorks', label: t('whyItWorksLabel'), placeholder: t('whyItWorksPlaceholder'), required: true },
    { key: 'monetization', label: t('monetizationLabel'), placeholder: t('monetizationPlaceholder'), required: false },
  ];

  const currentField = fields[step - 1];
  const currentValue = formData[currentField.key as keyof typeof formData];
  const isValid = !currentField.required || currentValue.trim().length > 0;
  const charsRemaining = MAX_CHARS - currentValue.length;

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    const messages = [t('analyzing'), t('scoring'), t('generating')];
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-idea', {
        body: { ...formData, language }
      });

      clearInterval(interval);

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      
      setResult({ id: data.id, output: data.output });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({ productIdea: '', targetUser: '', problem: '', whyItWorks: '', monetization: '' });
    setStep(1);
  };

  if (result) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-8 mesh-gradient">
          <ResultsDisplay output={result.output} reportId={result.id} onReset={handleReset} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold mb-2">{t('analyzeTitle')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('step')} {step} {t('of')} {TOTAL_STEPS}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ transformOrigin: 'left' }}
          >
            <Progress value={(step / TOTAL_STEPS) * 100} className="mb-8 h-2" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="metal-card p-6 md:p-8"
            >
              <label className="block text-sm font-medium mb-3">
                {currentField.label}
                {currentField.required && <span className="text-destructive ml-1">*</span>}
              </label>
              
              <Textarea
                value={currentValue}
                onChange={(e) => setFormData({ ...formData, [currentField.key]: e.target.value.slice(0, MAX_CHARS) })}
                placeholder={currentField.placeholder}
                className="min-h-[150px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                disabled={isLoading}
              />
              
              <p className={`text-xs mt-2 ${charsRemaining < 100 ? 'text-warning' : 'text-muted-foreground'}`}>
                {charsRemaining} {t('charsRemaining')}
              </p>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack} disabled={step === 1 || isLoading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('back')}
                </Button>

                {step < TOTAL_STEPS ? (
                  <Button onClick={handleNext} disabled={!isValid} className="metal-button">
                    {t('next')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading} className="metal-button gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {loadingMessage}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {t('generateReport')}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
