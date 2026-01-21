import { useLanguage } from '@/contexts/LanguageContext';
import { AnalysisOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, TrendingUp, Copy, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ResultsDisplayProps {
  output: AnalysisOutput;
  reportId: string;
  onReset?: () => void;
  readOnly?: boolean;
}

export function ResultsDisplay({ output, reportId, onReset, readOnly }: ResultsDisplayProps) {
  const { t } = useLanguage();

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* Reality Check */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <h2 className="text-xl font-bold">{t('realityCheck')}</h2>
        </div>
        <p className="text-muted-foreground mb-4">{output.reality_check.summary}</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">{t('assumptions')}</h4>
            <ul className="space-y-1">
              {output.reality_check.assumptions.map((a, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-warning">•</span>{a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">{t('risks')}</h4>
            <ul className="space-y-1">
              {output.reality_check.risks.map((r, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-destructive">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
          <h4 className="font-medium text-sm mb-1">{t('likelyFailure')}</h4>
          <p className="text-sm text-muted-foreground">{output.reality_check.likely_failure_first}</p>
        </div>
      </div>

      {/* Score */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-score" />
          <h2 className="text-xl font-bold">{t('productThinkingScore')}</h2>
          <span className="score-badge">{output.product_thinking_score.score}/10</span>
          <span className="text-sm text-muted-foreground">({output.product_thinking_score.level})</span>
        </div>
        <ul className="space-y-1">
          {output.product_thinking_score.explanation.map((e, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-primary">•</span>{e}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvement Plan */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">{t('improvementPlan')}</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: t('improveOneThing'), value: output.improvement_plan.improve_one_thing },
            { label: t('validateAssumption'), value: output.improvement_plan.validate_one_assumption },
            { label: t('runExperiment'), value: output.improvement_plan.run_one_experiment },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-accent/50">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded h-fit">{i + 1}</span>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <XCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium">{t('dontBuildYet')}</p>
              <p className="text-sm text-muted-foreground">{output.improvement_plan.one_thing_not_to_build_yet}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Verdict */}
      <div className={`glass-card rounded-xl p-6 border-2 ${output.final_verdict.worth_testing ? 'border-success/30' : 'border-destructive/30'}`}>
        <div className="flex items-center gap-3 mb-4">
          {output.final_verdict.worth_testing ? (
            <CheckCircle2 className="h-6 w-6 text-success" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" />
          )}
          <h2 className="text-xl font-bold">{t('finalVerdict')}</h2>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            output.final_verdict.worth_testing ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {output.final_verdict.worth_testing ? t('worthTesting') : t('notWorthTesting')}
          </span>
        </div>
        <p className="text-muted-foreground">{output.final_verdict.reason}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" onClick={copyReport}>
          <Copy className="h-4 w-4 mr-2" />
          {t('copyReport')}
        </Button>
        <Button variant="outline" onClick={copyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          {t('shareLink')}
        </Button>
        {!readOnly && onReset && (
          <Button onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('runAnother')}
          </Button>
        )}
        {readOnly && (
          <Button asChild>
            <Link to="/analyze">
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('runAnother')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}