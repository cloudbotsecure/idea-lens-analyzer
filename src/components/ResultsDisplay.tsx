import { useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnalysisOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, TrendingUp, Copy, Link as LinkIcon, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsDisplayProps {
  output: AnalysisOutput;
  reportId: string;
  onReset?: () => void;
  readOnly?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function ResultsDisplay({ output, reportId, onReset, readOnly }: ResultsDisplayProps) {
  const { t } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);

  const copyReport = () => {
    const text = `PM Reality Check Report\n\n` +
      `Reality Check:\n${output.reality_check.summary}\n\n` +
      `Score: ${output.product_thinking_score.score}/10 (${output.product_thinking_score.level})\n\n` +
      `Verdict: ${output.final_verdict.worth_testing ? 'Worth testing' : 'Not recommended'}\n${output.final_verdict.reason}`;
    navigator.clipboard.writeText(text);
    toast.success(t('copied'));
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/r/${reportId}`);
    toast.success(t('copied'));
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    toast.loading('Generating PDF...');
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`pm-reality-check-${reportId.slice(0, 8)}.pdf`);
      toast.dismiss();
      toast.success('PDF downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div ref={reportRef} className="space-y-6 p-1">
        {/* Reality Check */}
        <motion.div variants={fadeInUp} className="metal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-xl font-bold">{t('realityCheck')}</h2>
          </div>
          <p className="text-muted-foreground mb-5">{output.reality_check.summary}</p>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass-card p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t('assumptions')}</h4>
              <ul className="space-y-2">
                {output.reality_check.assumptions.map((a, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-warning shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-muted-foreground">{t('risks')}</h4>
              <ul className="space-y-2">
                {output.reality_check.risks.map((r, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-destructive shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-5 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <h4 className="font-medium text-sm mb-1.5 text-destructive">{t('likelyFailure')}</h4>
            <p className="text-sm text-muted-foreground">{output.reality_check.likely_failure_first}</p>
          </div>
        </motion.div>

        {/* Score */}
        <motion.div variants={fadeInUp} className="metal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-score/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-score" />
            </div>
            <h2 className="text-xl font-bold">{t('productThinkingScore')}</h2>
            <motion.span 
              className="score-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
            >
              {output.product_thinking_score.score}/10
            </motion.span>
            <span className="text-sm text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
              {output.product_thinking_score.level}
            </span>
          </div>
          <ul className="space-y-2">
            {output.product_thinking_score.explanation.map((e, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0">•</span>{e}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvement Plan */}
        <motion.div variants={fadeInUp} className="metal-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{t('improvementPlan')}</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: t('improveOneThing'), value: output.improvement_plan.improve_one_thing },
              { label: t('validateAssumption'), value: output.improvement_plan.validate_one_assumption },
              { label: t('runExperiment'), value: output.improvement_plan.run_one_experiment },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex gap-3 p-4 rounded-xl glass-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-xs font-bold text-primary-foreground metal-button w-7 h-7 flex items-center justify-center rounded-lg shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium mb-0.5">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </motion.div>
            ))}
            <motion.div 
              className="flex gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-0.5">{t('dontBuildYet')}</p>
                <p className="text-sm text-muted-foreground">{output.improvement_plan.one_thing_not_to_build_yet}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final Verdict */}
        <motion.div 
          variants={fadeInUp}
          className={`metal-card p-6 border-2 ${output.final_verdict.worth_testing ? 'border-success/40' : 'border-destructive/40'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              output.final_verdict.worth_testing ? 'bg-success/10' : 'bg-destructive/10'
            }`}>
              {output.final_verdict.worth_testing ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <h2 className="text-xl font-bold">{t('finalVerdict')}</h2>
            <motion.span 
              className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                output.final_verdict.worth_testing 
                  ? 'bg-success/10 text-success border border-success/20' 
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              {output.final_verdict.worth_testing ? t('worthTesting') : t('notWorthTesting')}
            </motion.span>
          </div>
          <p className="text-muted-foreground">{output.final_verdict.reason}</p>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div 
        variants={fadeInUp}
        className="flex flex-wrap gap-3 justify-center pt-4"
      >
        <Button variant="outline" onClick={copyReport} className="gap-2">
          <Copy className="h-4 w-4" />
          {t('copyReport')}
        </Button>
        <Button variant="outline" onClick={downloadPDF} className="gap-2">
          <Download className="h-4 w-4" />
          {t('downloadPDF')}
        </Button>
        <Button variant="outline" onClick={copyLink} className="gap-2">
          <LinkIcon className="h-4 w-4" />
          {t('shareLink')}
        </Button>
        {!readOnly && onReset && (
          <Button onClick={onReset} className="gap-2 metal-button">
            <RotateCcw className="h-4 w-4" />
            {t('runAnother')}
          </Button>
        )}
        {readOnly && (
          <Button asChild className="gap-2 metal-button">
            <Link to="/analyze">
              <RotateCcw className="h-4 w-4" />
              {t('runAnother')}
            </Link>
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
