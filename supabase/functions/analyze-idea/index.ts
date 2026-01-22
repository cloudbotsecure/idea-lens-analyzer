import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompetitorInsight {
  name: string;
  url: string;
  summary: string;
}

interface SimilarProduct {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  url: string;
  votesCount: number;
  website?: string;
  topics?: string[];
}

function extractKeywords(text: string): string[] {
  // Extract meaningful words (4+ chars), remove common stop words
  const stopWords = new Set(['with', 'that', 'this', 'from', 'have', 'will', 'been', 'were', 'they', 'their', 'what', 'when', 'where', 'which', 'while', 'about', 'after', 'before', 'between', 'through', 'during', 'without', 'again', 'further', 'then', 'once', 'here', 'there', 'each', 'other', 'some', 'such', 'more', 'most', 'very', 'just', 'also', 'only', 'into', 'over', 'could', 'would', 'should', 'using', 'based', 'across', 'powered', 'users', 'teams', 'tools', 'platform', 'solution', 'product', 'application']);
  
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 4 && !stopWords.has(word))
    .slice(0, 6);
}

async function searchCompetitors(productIdea: string, problem: string, targetUser: string): Promise<CompetitorInsight[]> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) {
    console.log("Firecrawl not configured, skipping competitor search");
    return [];
  }

  try {
    // Extract key terms and build a simple, effective search query
    const ideaKeywords = extractKeywords(productIdea);
    const problemKeywords = extractKeywords(problem);
    const targetKeywords = extractKeywords(targetUser);
    
    // Combine most relevant keywords
    const allKeywords = [...new Set([...ideaKeywords.slice(0, 3), ...problemKeywords.slice(0, 2), ...targetKeywords.slice(0, 1)])];
    const searchQuery = `${allKeywords.join(' ')} software alternatives competitors`;
    
    console.log("Firecrawl search keywords:", allKeywords);
    console.log("Firecrawl search query:", searchQuery);
    
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: 8,
        scrapeOptions: {
          formats: ['markdown'],
          onlyMainContent: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Firecrawl search failed:", response.status, errorText);
      return [];
    }

    const data = await response.json();
    const results = data.data || [];
    
    console.log("Firecrawl found", results.length, "results");
    
    // Filter for software/product related pages
    return results
      .filter((result: any) => {
        const url = (result.url || '').toLowerCase();
        const title = (result.title || '').toLowerCase();
        // Prioritize relevant sites
        return url.includes('producthunt') || url.includes('g2.com') || url.includes('capterra') || 
               url.includes('alternativeto') || url.includes('saasworthy') ||
               title.includes('alternative') || title.includes('competitor') || title.includes('vs');
      })
      .slice(0, 5)
      .map((result: any) => ({
        name: result.title || result.url,
        url: result.url,
        summary: result.description || result.markdown?.slice(0, 300) || "No description available",
      }));
  } catch (error) {
    console.error("Competitor search error:", error);
    return [];
  }
}

async function searchProductHunt(productIdea: string, targetUser: string, problem: string): Promise<SimilarProduct[]> {
  const apiKey = Deno.env.get("PRODUCT_HUNT_API_KEY");
  const apiSecret = Deno.env.get("PRODUCT_HUNT_API_SECRET");
  
  if (!apiKey || !apiSecret) {
    console.log("Product Hunt not configured, skipping");
    return [];
  }

  try {
    // Extract 2-3 core keywords for search
    const ideaKeywords = extractKeywords(productIdea);
    const searchTerm = ideaKeywords.slice(0, 2).join(' ');
    
    console.log("Product Hunt search term:", searchTerm);
    
    // Get access token
    const tokenResponse = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Product Hunt token error:", await tokenResponse.text());
      return [];
    }

    const { access_token } = await tokenResponse.json();
    
    // Search for topics first to find relevant category
    const topicQuery = `
      query SearchTopics($query: String!) {
        topics(query: $query, first: 3) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
      }
    `;
    
    const topicResponse = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: topicQuery, variables: { query: searchTerm } }),
    });
    
    let topicSlug = null;
    if (topicResponse.ok) {
      const topicData = await topicResponse.json();
      const topics = topicData.data?.topics?.edges || [];
      if (topics.length > 0) {
        topicSlug = topics[0].node.slug;
        console.log("Found topic:", topicSlug);
      }
    }
    
    // Get posts from the topic or recent posts with search filtering
    const postsQuery = topicSlug ? `
      query GetTopicPosts($slug: String!) {
        topic(slug: $slug) {
          posts(first: 20, order: VOTES) {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                website
                topics {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    ` : `
      query GetRecentPosts {
        posts(first: 30, order: VOTES, postedAfter: "2024-01-01T00:00:00Z") {
          edges {
            node {
              id
              name
              tagline
              description
              url
              votesCount
              website
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const postsResponse = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: postsQuery, 
        variables: topicSlug ? { slug: topicSlug } : {} 
      }),
    });

    if (!postsResponse.ok) {
      console.error("Product Hunt posts query failed:", await postsResponse.text());
      return [];
    }

    const postsData = await postsResponse.json();
    const postsEdges = topicSlug 
      ? postsData.data?.topic?.posts?.edges 
      : postsData.data?.posts?.edges;
    
    const allProducts = (postsEdges || []).map((edge: any) => ({
      ...edge.node,
      topics: edge.node.topics?.edges?.map((t: any) => t.node.name) || [],
    }));
    
    console.log("Product Hunt returned", allProducts.length, "products");
    
    // Filter for relevance using keywords from idea, target user, and problem
    const allKeywords = [...extractKeywords(productIdea), ...extractKeywords(targetUser), ...extractKeywords(problem)];
    
    const scoredProducts = allProducts.map((product: any) => {
      const searchableText = `${product.name} ${product.tagline} ${product.description || ''} ${(product.topics || []).join(' ')}`.toLowerCase();
      
      let score = 0;
      allKeywords.forEach((keyword: string) => {
        if (searchableText.includes(keyword)) {
          score += 1;
        }
      });
      
      return { ...product, relevanceScore: score };
    });
    
    const relevantProducts = scoredProducts
      .filter((p: any) => p.relevanceScore >= 1)
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore || b.votesCount - a.votesCount)
      .slice(0, 5);
    
    console.log("Found", relevantProducts.length, "relevant products");
    
    return relevantProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      url: p.url,
      votesCount: p.votesCount,
      website: p.website,
      topics: p.topics,
    }));
  } catch (error) {
    console.error("Product Hunt error:", error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productIdea, targetUser, problem, whyItWorks, monetization, language } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch external data in parallel using product idea AND problem for better relevance
    console.log("Fetching market research data for:", productIdea);
    const [competitors, similarProducts] = await Promise.all([
      searchCompetitors(productIdea, problem, targetUser),
      searchProductHunt(productIdea, targetUser, problem),
    ]);
    
    console.log(`Found ${competitors.length} competitors, ${similarProducts.length} similar products`);

    const langName = language === 'uk' ? 'Ukrainian' : 'English';
    
    // Build context from external data
    let marketContext = "";
    if (competitors.length > 0) {
      marketContext += "\n\nCompetitor/Market Research Data:\n";
      competitors.forEach((c, i) => {
        marketContext += `${i + 1}. ${c.name} (${c.url}): ${c.summary}\n`;
      });
    }
    if (similarProducts.length > 0) {
      marketContext += "\n\nSimilar Products from Product Hunt:\n";
      similarProducts.forEach((p, i) => {
        marketContext += `${i + 1}. ${p.name} - ${p.tagline} (${p.votesCount} votes)\n`;
      });
    }
    
    const systemPrompt = `You are a strict, analytical product manager and startup advisor. Your job is to provide a brutally honest reality check of product ideas. Be factual, direct, and analytical. No motivational fluff. No insults. Just honest assessment.

IMPORTANT: Respond ONLY in ${langName}. All text must be in ${langName}.

${marketContext ? `Use this market research data to inform your analysis:${marketContext}` : ""}

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
  }${marketContext ? `,
  "market_analysis": "2-3 sentence analysis based on competitor and market data provided"` : ""}
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

    // Add market research data to output
    output.market_research = {
      competitors,
      similar_products: similarProducts,
      market_analysis: output.market_analysis || null,
    };

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