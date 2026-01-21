export type Language = 'en' | 'uk';

export const translations = {
  en: {
    // Landing page
    heroTitle: "PM Reality Check",
    heroSubtitle: "Get a brutally honest analysis of your product idea. No fluff. No sugarcoating. Just facts.",
    ctaButton: "Analyze my idea",
    
    // How it works
    howItWorks: "How it works",
    step1Title: "Describe your idea",
    step1Desc: "Answer 4-5 quick questions about your product concept",
    step2Title: "AI analyzes",
    step2Desc: "Our AI evaluates assumptions, risks, and product thinking",
    step3Title: "Get your report",
    step3Desc: "Receive a structured reality check with actionable insights",
    
    // Example section
    exampleTitle: "Example output",
    
    // Footer
    disclaimer: "For educational purposes only. Not financial or business advice.",
    
    // Analyzer
    analyzeTitle: "Idea Analysis",
    step: "Step",
    of: "of",
    next: "Next",
    back: "Back",
    generateReport: "Generate Report",
    
    // Form fields
    productIdeaLabel: "What is your product idea?",
    productIdeaPlaceholder: "e.g., An app that helps remote teams track their mood and wellbeing through daily 30-second check-ins",
    targetUserLabel: "Who is your target user?",
    targetUserPlaceholder: "e.g., HR managers and team leads at tech companies with 50-200 employees who struggle with remote team engagement",
    problemLabel: "What problem does it solve?",
    problemPlaceholder: "e.g., Remote teams lose connection and managers can't detect burnout early. Current surveys are too long and infrequent.",
    whyItWorksLabel: "Why do you think this will work?",
    whyItWorksPlaceholder: "e.g., Quick micro-surveys have 3x higher response rates. Early detection of mood changes can reduce turnover by 20%.",
    monetizationLabel: "How will you make money? (optional)",
    monetizationPlaceholder: "e.g., $5/user/month SaaS subscription for teams. Free tier for up to 10 users.",
    
    // Validation
    required: "This field is required",
    maxChars: "Maximum 1000 characters",
    charsRemaining: "characters remaining",
    
    // Loading states
    analyzing: "Analyzing assumptions…",
    scoring: "Scoring product thinking…",
    generating: "Generating improvement plan…",
    
    // Results
    realityCheck: "Reality Check",
    productThinkingScore: "Product Thinking Score",
    improvementPlan: "Improvement Plan",
    finalVerdict: "Final Verdict",
    worthTesting: "Worth testing further",
    notWorthTesting: "Not recommended to proceed",
    
    // Result actions
    copyReport: "Copy Report",
    downloadPDF: "Download PDF",
    runAnother: "Run Another Analysis",
    shareLink: "Share Link",
    copied: "Copied!",
    
    // Result labels
    summary: "Summary",
    assumptions: "Key Assumptions",
    risks: "Identified Risks",
    likelyFailure: "Most Likely Failure Point",
    level: "Level",
    explanation: "Explanation",
    improveOneThing: "Improve one thing",
    validateAssumption: "Validate one assumption",
    runExperiment: "Run one experiment",
    dontBuildYet: "Don't build yet",
    
    // Market research
    marketResearch: "Market Research",
    competitors: "Competitor Insights",
    similarProducts: "Similar Products on Product Hunt",
    marketAnalysis: "Market Analysis",
    votes: "votes",
    noCompetitors: "No competitor data found",
    noSimilarProducts: "No similar products found",
    
    // Levels
    beginner: "Beginner",
    intermediate: "Intermediate",
    strong: "Strong",
    
    // Errors
    errorTitle: "Analysis Failed",
    errorMessage: "Something went wrong while analyzing your idea. Please try again.",
    tryAgain: "Try Again",
    
    // Language toggle
    language: "Language",
  },
  uk: {
    // Landing page
    heroTitle: "PM Reality Check",
    heroSubtitle: "Отримайте брутально чесний аналіз вашої продуктової ідеї. Без прикрас. Без підсолоджування. Тільки факти.",
    ctaButton: "Аналізувати мою ідею",
    
    // How it works
    howItWorks: "Як це працює",
    step1Title: "Опишіть вашу ідею",
    step1Desc: "Дайте відповіді на 4-5 швидких запитань про ваш продукт",
    step2Title: "ШІ аналізує",
    step2Desc: "Наш ШІ оцінює припущення, ризики та продуктове мислення",
    step3Title: "Отримайте звіт",
    step3Desc: "Отримайте структурований аналіз з практичними рекомендаціями",
    
    // Example section
    exampleTitle: "Приклад звіту",
    
    // Footer
    disclaimer: "Лише для освітніх цілей. Не є фінансовою чи бізнес-порадою.",
    
    // Analyzer
    analyzeTitle: "Аналіз ідеї",
    step: "Крок",
    of: "з",
    next: "Далі",
    back: "Назад",
    generateReport: "Згенерувати звіт",
    
    // Form fields
    productIdeaLabel: "Яка ваша продуктова ідея?",
    productIdeaPlaceholder: "напр., Застосунок, який допомагає віддаленим командам відстежувати настрій через щоденні 30-секундні опитування",
    targetUserLabel: "Хто ваш цільовий користувач?",
    targetUserPlaceholder: "напр., HR-менеджери та тімліди в технологічних компаніях з 50-200 працівниками",
    problemLabel: "Яку проблему це вирішує?",
    problemPlaceholder: "напр., Віддалені команди втрачають зв'язок, а менеджери не можуть виявити вигорання рано",
    whyItWorksLabel: "Чому ви вважаєте, що це спрацює?",
    whyItWorksPlaceholder: "напр., Короткі опитування мають у 3 рази вищий показник відповідей",
    monetizationLabel: "Як ви будете заробляти? (необов'язково)",
    monetizationPlaceholder: "напр., $5/користувач/місяць SaaS підписка",
    
    // Validation
    required: "Це поле обов'язкове",
    maxChars: "Максимум 1000 символів",
    charsRemaining: "символів залишилось",
    
    // Loading states
    analyzing: "Аналізуємо припущення…",
    scoring: "Оцінюємо продуктове мислення…",
    generating: "Генеруємо план покращення…",
    
    // Results
    realityCheck: "Перевірка реальністю",
    productThinkingScore: "Оцінка продуктового мислення",
    improvementPlan: "План покращення",
    finalVerdict: "Фінальний вердикт",
    worthTesting: "Варто тестувати далі",
    notWorthTesting: "Не рекомендовано продовжувати",
    
    // Result actions
    copyReport: "Копіювати звіт",
    downloadPDF: "Завантажити PDF",
    runAnother: "Новий аналіз",
    shareLink: "Поділитися",
    copied: "Скопійовано!",
    
    // Result labels
    summary: "Підсумок",
    assumptions: "Ключові припущення",
    risks: "Виявлені ризики",
    likelyFailure: "Найімовірніша точка провалу",
    level: "Рівень",
    explanation: "Пояснення",
    improveOneThing: "Покращіть одну річ",
    validateAssumption: "Перевірте одне припущення",
    runExperiment: "Проведіть один експеримент",
    dontBuildYet: "Поки не будуйте",
    
    // Market research
    marketResearch: "Ринкове дослідження",
    competitors: "Інсайти про конкурентів",
    similarProducts: "Схожі продукти на Product Hunt",
    marketAnalysis: "Аналіз ринку",
    votes: "голосів",
    noCompetitors: "Дані про конкурентів не знайдено",
    noSimilarProducts: "Схожі продукти не знайдено",
    
    // Levels
    beginner: "Початківець",
    intermediate: "Середній",
    strong: "Сильний",
    
    // Errors
    errorTitle: "Аналіз не вдався",
    errorMessage: "Щось пішло не так під час аналізу вашої ідеї. Спробуйте ще раз.",
    tryAgain: "Спробувати ще",
    
    // Language toggle
    language: "Мова",
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key];
}