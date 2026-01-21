import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productIdea, targetUser, problem, whyItWorks, monetization, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langName = language === 'uk' ? 'Ukrainian' : 'English';
    
    const systemPrompt = `You are a strict, analytical product manager and startup advisor. Your job is to provide a brutally honest reality check of product ideas. Be factual, direct, and analytical. No motivational fluff. No insults. Just honest assessment.

IMPORTANT: Respond ONLY in ${langName}. All text must be in ${langName}.

Analyze the product idea and return a JSON object with this exact structure:
{
  "reality_check": {
    "summary": "2-3 sentence honest assessment",
    "assumptions": ["assumption 1", "assumption 2", "assumption 3"],
    "risks": ["risk 1", "risk 2", "risk 3"],
    "likely_failure_first": "The most likely way this will fail"
  },
  "product_thinking_score": {
    "score": 0-10,
    "level": "Beginner" or "Intermediate" or "Strong",
    "explanation": ["reason 1", "reason 2", "reason 3"]
  },
  "improvement_plan": {
    "improve_one_thing": "specific actionable improvement",
    "validate_one_assumption": "specific assumption to test and how",
    "run_one_experiment": "concrete experiment to run",
    "one_thing_not_to_build_yet": "feature to avoid building now"
  },
  "final_verdict": {
    "worth_testing": true or false,
    "reason": "1-2 sentence justification"
  }
}

Scoring guide:
- 0-3: Beginner - Missing basic product thinking
- 4-6: Intermediate - Shows understanding but has gaps
- 7-10: Strong - Well-thought-out with clear reasoning

Return ONLY valid JSON, no markdown, no explanation.`;

    const userPrompt = `Product Idea: ${productIdea}

Target User: ${targetUser}

Problem it solves: ${problem}

Why it will work: ${whyItWorks}

${monetization ? `Monetization: ${monetization}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI analysis failed");
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No response from AI");

    // Parse JSON from response (handle potential markdown wrapping)
    let output;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        output = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("JSON parse error:", e, "Content:", content);
      throw new Error("Failed to parse AI response");
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: report, error: dbError } = await supabase
      .from("reports")
      .insert({
        language,
        product_idea: productIdea,
        target_user: targetUser,
        problem,
        why_it_works: whyItWorks,
        monetization: monetization || null,
        output,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      throw new Error("Failed to save report");
    }

    return new Response(JSON.stringify({ id: report.id, output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-idea error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});