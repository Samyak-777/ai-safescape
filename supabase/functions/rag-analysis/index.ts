import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulated vector database (in production, this would be Vertex AI Vector Search)
const knownMisinformationVectors = [
  {
    id: "health_1",
    category: "Health & Wellness",
    text: "Government health official confirms that the new 'X-variant' of COVID is airborne and spreads through mobile phone signals.",
    tags: ["covid", "health", "fear-mongering"],
    embedding: [] // Would contain actual embedding vector
  },
  {
    id: "financial_1",
    category: "Financial & Scams",
    text: "Due to the new RBI guidelines, your bank account will be blocked if you don't update your PAN card details immediately.",
    tags: ["scam", "financial", "phishing"]
  },
  {
    id: "political_2",
    category: "Political & Social",
    text: "UNESCO has just declared India's new national anthem as the best in the world.",
    tags: ["unesco-hoax", "nationalism", "false-claim"]
  }
];

// Paywall detection patterns
const paywallIndicators = [
  'subscribe to read',
  'subscribers only',
  'premium content',
  'members only',
  'unlock this story',
  'paywall',
  'subscription required',
  'sign in to continue',
  'register to read'
];

async function detectPaywall(url: string, htmlContent: string): Promise<boolean> {
  const lowerContent = htmlContent.toLowerCase();
  
  // Check for common paywall indicators
  for (const indicator of paywallIndicators) {
    if (lowerContent.includes(indicator)) {
      console.log(`Paywall detected: Found "${indicator}"`);
      return true;
    }
  }
  
  // Check for specific class names used by major news sites
  const paywallClasses = ['paywall', 'subscription-wall', 'metered-wall'];
  for (const className of paywallClasses) {
    if (lowerContent.includes(`class="${className}"`)) {
      console.log(`Paywall detected: Found class "${className}"`);
      return true;
    }
  }
  
  return false;
}

async function fetchUrlContent(url: string): Promise<{ content: string; title: string; isPaywalled: boolean }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SafeScape/1.0; +https://safescape.app)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
    
    // Check for paywall
    const isPaywalled = await detectPaywall(url, html);
    
    // Extract text content (simplified)
    const textContent = html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit content size
    
    return { content: textContent, title, isPaywalled };
  } catch (error) {
    console.error('Error fetching URL:', error);
    throw error;
  }
}

async function searchKnownMisinformation(queryText: string): Promise<{ match: boolean; matchedDoc?: any; similarity?: number }> {
  // Simple keyword-based similarity check (in production, use cosine similarity with vectors)
  const queryLower = queryText.toLowerCase();
  
  for (const doc of knownMisinformationVectors) {
    const docLower = doc.text.toLowerCase();
    
    // Check for significant keyword overlap
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
    const docWords = docLower.split(/\s+/).filter(w => w.length > 3);
    
    const commonWords = queryWords.filter(w => docWords.includes(w));
    const similarity = commonWords.length / Math.max(queryWords.length, 1);
    
    if (similarity > 0.3) { // 30% threshold
      return {
        match: true,
        matchedDoc: doc,
        similarity: similarity
      };
    }
  }
  
  return { match: false };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!url && !text) {
      throw new Error('Either URL or text must be provided');
    }

    console.log('Starting RAG-powered analysis...');
    
    let analysisText = text;
    let urlMetadata = null;
    let paywallDetected = false;

    // If URL is provided, fetch and analyze it
    if (url) {
      console.log(`Fetching URL: ${url}`);
      const urlData = await fetchUrlContent(url);
      analysisText = urlData.content;
      paywallDetected = urlData.isPaywalled;
      
      const urlObj = new URL(url);
      urlMetadata = {
        domain: urlObj.hostname,
        title: urlData.title,
        isPaywalled: paywallDetected
      };
      
      console.log(`URL fetched. Paywall: ${paywallDetected}`);
    }

    // Step 1: RAG Check - Search for known misinformation
    console.log('Step 1: Checking against known misinformation database...');
    const ragResult = await searchKnownMisinformation(analysisText);

    if (ragResult.match && ragResult.matchedDoc) {
      console.log(`✓ Match found: ${ragResult.matchedDoc.id} (${Math.round((ragResult.similarity || 0) * 100)}% similar)`);
      
      return new Response(
        JSON.stringify({
          analysisType: 'rag-match',
          isKnownMisinformation: true,
          confidence: ragResult.similarity,
          matchedDocument: {
            id: ragResult.matchedDoc.id,
            category: ragResult.matchedDoc.category,
            explanation: `This content matches a known piece of misinformation: "${ragResult.matchedDoc.text.substring(0, 100)}..."`,
            tags: ragResult.matchedDoc.tags
          },
          verdict: 'MISINFORMATION DETECTED',
          message: 'This content has been identified as known misinformation based on our verified database.',
          recommendation: 'Do not share or trust this information. Report if seen on social media.',
          urlMetadata
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log('No match in RAG database. Proceeding to deep analysis...');

    // Step 2: Paywall Fallback
    if (paywallDetected && urlMetadata) {
      console.log('Paywall detected. Using limited analysis mode.');
      
      const limitedPrompt = `The content of this URL is behind a paywall and cannot be fully analyzed. 
Based ONLY on the URL itself, the domain '${urlMetadata.domain}', and the page title '${urlMetadata.title}', perform a credibility analysis. 

Provide:
1. Domain credibility assessment
2. Any red flags in the URL or title
3. General trustworthiness based on domain reputation
4. Mention that your analysis is limited due to the paywall

Format your response as JSON with keys: credibility_score (0-100), verdict, analysis, limitations.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a misinformation detection expert. Provide clear, concise analysis.' },
            { role: 'user', content: limitedPrompt }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('AI service payment required. Please add credits to your workspace.');
        }
        throw new Error('AI analysis failed');
      }

      const aiData = await response.json();
      const aiAnalysis = aiData.choices[0].message.content;

      return new Response(
        JSON.stringify({
          analysisType: 'paywall-limited',
          isPaywalled: true,
          aiAnalysis,
          urlMetadata,
          warning: 'Limited Analysis: This page is behind a paywall. Assessment is based on public metadata only.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Step 3: Full Gemini Analysis (no RAG match, no paywall)
    console.log('Step 3: Performing full Gemini 2.5 analysis...');
    
    const deepAnalysisPrompt = `Analyze the following content for misinformation, scams, or misleading information:

Content: "${analysisText.substring(0, 2000)}"

Provide a comprehensive analysis including:
1. Credibility score (0-100)
2. Risk level (low, medium, high, critical)
3. Specific red flags or concerns
4. Verdict (credible, questionable, misinformation, scam)
5. Recommended action

Format as JSON with keys: credibility_score, risk_level, red_flags (array), verdict, analysis, recommendation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert misinformation analyst. Provide detailed, evidence-based analysis.' },
          { role: 'user', content: deepAnalysisPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('AI service payment required. Please add credits to your workspace.');
      }
      throw new Error('AI analysis failed');
    }

    const aiData = await response.json();
    const deepAnalysis = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        analysisType: 'full-gemini',
        isKnownMisinformation: false,
        aiAnalysis: deepAnalysis,
        urlMetadata,
        message: 'Full AI analysis completed using Gemini 2.5 Flash'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('RAG analysis error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'RAG analysis failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
