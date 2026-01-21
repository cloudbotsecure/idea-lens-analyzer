export interface AnalysisInput {
  productIdea: string;
  targetUser: string;
  problem: string;
  whyItWorks: string;
  monetization?: string;
}

export interface RealityCheck {
  summary: string;
  assumptions: string[];
  risks: string[];
  likely_failure_first: string;
}

export interface ProductThinkingScore {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Strong';
  explanation: string[];
}

export interface ImprovementPlan {
  improve_one_thing: string;
  validate_one_assumption: string;
  run_one_experiment: string;
  one_thing_not_to_build_yet: string;
}

export interface FinalVerdict {
  worth_testing: boolean;
  reason: string;
}

export interface CompetitorInsight {
  name: string;
  url: string;
  summary: string;
}

export interface SimilarProduct {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  url: string;
  votesCount: number;
  website?: string;
  topics?: string[];
}

export interface MarketResearch {
  competitors: CompetitorInsight[];
  similar_products: SimilarProduct[];
  market_analysis?: string;
}

export interface AnalysisOutput {
  reality_check: RealityCheck;
  product_thinking_score: ProductThinkingScore;
  improvement_plan: ImprovementPlan;
  final_verdict: FinalVerdict;
  market_research?: MarketResearch;
}

export interface Report {
  id: string;
  language: 'en' | 'uk';
  product_idea: string;
  target_user: string;
  problem: string;
  why_it_works: string;
  monetization: string | null;
  output: AnalysisOutput;
  created_at: string;
}