-- Create reports table to store analysis results
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'uk')),
  product_idea TEXT NOT NULL,
  target_user TEXT NOT NULL,
  problem TEXT NOT NULL,
  why_it_works TEXT NOT NULL,
  monetization TEXT,
  output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports (for share links)
CREATE POLICY "Reports are publicly readable" 
ON public.reports 
FOR SELECT 
USING (true);

-- Allow anyone to insert reports (no auth required for this app)
CREATE POLICY "Anyone can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);