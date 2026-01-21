import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExampleOutput() {
  const { language, t } = useLanguage();

  const exampleData = {
    en: {
      idea: "An app that helps remote teams track their mood through daily 30-second check-ins",
      realityCheck: {
        summary: "The idea addresses a real pain point but enters a crowded market with established players. Success depends heavily on achieving high engagement rates, which is the primary risk.",
        assumptions: [
          "Remote workers will consistently participate in daily check-ins",
          "30 seconds is the optimal duration for engagement vs data quality",
          "Managers will act on mood data to improve outcomes"
        ],
        risks: [
          "Survey fatigue leads to low completion rates",
          "Competitors with deeper integrations dominate enterprise sales",
          "Privacy concerns from employees being monitored"
        ],
        likelyFailure: "Users complete check-ins for 2-3 weeks then abandon the habit. Without sustained engagement, the data becomes unreliable and managers lose interest."
      },
      score: {
        score: 6,
        level: "Intermediate",
        explanation: [
          "Clear problem identification with supporting data",
          "Reasonable understanding of target market",
          "Missing competitive differentiation strategy"
        ]
      },
      improvement: {
        improve: "Define what makes your solution different from Culture Amp, Officevibe, and 15Five",
        validate: "Interview 10 HR managers to confirm they would act on mood data",
        experiment: "Run a 2-week paper prototype with one team using a simple form",
        dontBuild: "Don't build analytics dashboards until you've proven daily engagement works"
      },
      verdict: {
        worth: true,
        reason: "The core problem is valid and the hypothesis is testable with minimal investment. Worth validating with a basic prototype."
      }
    },
    uk: {
      idea: "Застосунок, який допомагає віддаленим командам відстежувати настрій через щоденні 30-секундні опитування",
      realityCheck: {
        summary: "Ідея вирішує реальну проблему, але виходить на насичений ринок з усталеними гравцями. Успіх залежить від досягнення високого рівня залученості.",
        assumptions: [
          "Віддалені працівники будуть регулярно заповнювати щоденні опитування",
          "30 секунд — оптимальна тривалість для залученості та якості даних",
          "Менеджери будуть діяти на основі даних про настрій"
        ],
        risks: [
          "Втома від опитувань призведе до низького відсотка заповнення",
          "Конкуренти з глибшими інтеграціями домінують на ринку",
          "Занепокоєння конфіденційністю через моніторинг працівників"
        ],
        likelyFailure: "Користувачі заповнюють опитування 2-3 тижні, а потім припиняють. Без стабільної залученості дані стають ненадійними."
      },
      score: {
        score: 6,
        level: "Середній",
        explanation: [
          "Чітке визначення проблеми з підтверджуючими даними",
          "Розумне розуміння цільового ринку",
          "Відсутня стратегія диференціації від конкурентів"
        ]
      },
      improvement: {
        improve: "Визначте, чим ваше рішення відрізняється від Culture Amp, Officevibe та 15Five",
        validate: "Проведіть інтерв'ю з 10 HR-менеджерами щодо використання даних про настрій",
        experiment: "Проведіть 2-тижневий тест з однією командою використовуючи просту форму",
        dontBuild: "Не будуйте аналітичні дашборди поки не підтвердите щоденну залученість"
      },
      verdict: {
        worth: true,
        reason: "Проблема валідна, а гіпотезу можна перевірити з мінімальними витратами. Варто провести валідацію."
      }
    }
  };

  const data = exampleData[language];

  return (
    <motion.div 
      className="metal-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="bg-gradient-to-r from-muted/80 to-muted/40 px-6 py-4 border-b border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t('productIdeaLabel')}</span>{' '}
          {data.idea}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {/* Reality Check */}
        <AccordionItem value="reality-check" className="border-b border-border/30">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <span className="font-semibold">{t('realityCheck')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{data.realityCheck.summary}</p>
              
              <div className="glass-card p-4">
                <h4 className="text-sm font-medium mb-2">{t('assumptions')}</h4>
                <ul className="space-y-1.5">
                  {data.realityCheck.assumptions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-warning">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-4">
                <h4 className="text-sm font-medium mb-2">{t('risks')}</h4>
                <ul className="space-y-1.5">
                  {data.realityCheck.risks.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <h4 className="text-sm font-medium mb-1.5 text-destructive">{t('likelyFailure')}</h4>
                <p className="text-sm text-muted-foreground">{data.realityCheck.likelyFailure}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Score */}
        <AccordionItem value="score" className="border-b border-border/30">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-score/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-score" />
              </div>
              <span className="font-semibold">{t('productThinkingScore')}</span>
              <span className="score-badge ml-2">{data.score.score}/10</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0">
            <div className="space-y-4">
              <p className="text-sm">
                <span className="font-medium">{t('level')}:</span>{' '}
                <span className="text-muted-foreground px-2 py-0.5 rounded-md bg-muted">{data.score.level}</span>
              </p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">{t('explanation')}</h4>
                <ul className="space-y-1.5">
                  {data.score.explanation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Improvement Plan */}
        <AccordionItem value="improvement" className="border-b border-border/30">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">{t('improvementPlan')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg glass-card">
                <span className="text-xs font-bold text-primary-foreground metal-button w-6 h-6 flex items-center justify-center rounded-md">1</span>
                <div>
                  <p className="text-sm font-medium">{t('improveOneThing')}</p>
                  <p className="text-sm text-muted-foreground">{data.improvement.improve}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg glass-card">
                <span className="text-xs font-bold text-primary-foreground metal-button w-6 h-6 flex items-center justify-center rounded-md">2</span>
                <div>
                  <p className="text-sm font-medium">{t('validateAssumption')}</p>
                  <p className="text-sm text-muted-foreground">{data.improvement.validate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg glass-card">
                <span className="text-xs font-bold text-primary-foreground metal-button w-6 h-6 flex items-center justify-center rounded-md">3</span>
                <div>
                  <p className="text-sm font-medium">{t('runExperiment')}</p>
                  <p className="text-sm text-muted-foreground">{data.improvement.experiment}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('dontBuildYet')}</p>
                  <p className="text-sm text-muted-foreground">{data.improvement.dontBuild}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Final Verdict */}
        <AccordionItem value="verdict" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                data.verdict.worth ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {data.verdict.worth ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <span className="font-semibold">{t('finalVerdict')}</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                data.verdict.worth 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              }`}>
                {data.verdict.worth ? t('worthTesting') : t('notWorthTesting')}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-0">
            <p className="text-sm text-muted-foreground">{data.verdict.reason}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
