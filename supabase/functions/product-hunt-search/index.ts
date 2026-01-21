import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 5 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('PRODUCT_HUNT_API_KEY');
    const apiSecret = Deno.env.get('PRODUCT_HUNT_API_SECRET');
    
    if (!apiKey || !apiSecret) {
      console.error('Product Hunt API credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Product Hunt API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Getting Product Hunt access token...');
    
    // Get access token using OAuth2 client credentials
    const tokenResponse = await fetch('https://api.producthunt.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Token error:', tokenError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to authenticate with Product Hunt' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { access_token } = await tokenResponse.json();
    
    console.log('Searching Product Hunt for:', query);

    // GraphQL query to search for products
    const graphqlQuery = `
      query SearchProducts($query: String!) {
        posts(first: ${limit}, order: VOTES, topic: $query) {
          edges {
            node {
              id
              name
              tagline
              description
              url
              votesCount
              website
              thumbnail {
                url
              }
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

    const searchResponse = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { query },
      }),
    });

    if (!searchResponse.ok) {
      const searchError = await searchResponse.text();
      console.error('Search error:', searchError);
      
      // Try alternative search endpoint
      const altQuery = `
        query {
          posts(first: ${limit}, order: RANKING) {
            edges {
              node {
                id
                name
                tagline
                description
                url
                votesCount
                website
              }
            }
          }
        }
      `;
      
      const altResponse = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: altQuery }),
      });
      
      if (!altResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to search Product Hunt' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const altData = await altResponse.json();
      const products = altData.data?.posts?.edges?.map((edge: any) => edge.node) || [];
      
      return new Response(
        JSON.stringify({ success: true, products }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchData = await searchResponse.json();
    const products = searchData.data?.posts?.edges?.map((edge: any) => ({
      ...edge.node,
      topics: edge.node.topics?.edges?.map((t: any) => t.node.name) || [],
    })) || [];

    console.log('Found', products.length, 'products');
    
    return new Response(
      JSON.stringify({ success: true, products }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error searching Product Hunt:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
