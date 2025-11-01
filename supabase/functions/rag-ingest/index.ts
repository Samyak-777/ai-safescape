import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Curated misinformation dataset for India (2024-2025)
const misinformationDataset = [
  {
    id: "health_1",
    category: "Health & Wellness",
    text: "Government health official confirms that the new 'X-variant' of COVID is airborne and spreads through mobile phone signals. The only way to be safe is to keep your phone in airplane mode for 12 hours a day. Share this to save lives!",
    tags: ["covid", "health", "fear-mongering"]
  },
  {
    id: "health_2",
    category: "Health & Wellness",
    text: "BIG PHARMA HIDING CURE: A renowned Ayurvedic doctor from Kerala has found a 100% cure for diabetes using a simple mixture of neem and tulsi leaves. The video was banned on YouTube to protect pharmaceutical company profits.",
    tags: ["health", "conspiracy", "ayurveda"]
  },
  {
    id: "health_3",
    category: "Health & Wellness",
    text: "WARNING: Do not drink cold drinks or eat ice cream after getting the new flu vaccine. It causes immediate blood clotting and can be fatal. This is a secret memo from a doctor at a top Delhi hospital.",
    tags: ["vaccine", "health", "false-warning"]
  },
  {
    id: "financial_1",
    category: "Financial & Scams",
    text: "Due to the new RBI guidelines, your bank account will be blocked if you don't update your PAN card details immediately. Click this official-looking link to update now and avoid suspension: http://rbi-kyc-update-portal.info",
    tags: ["scam", "financial", "phishing"]
  },
  {
    id: "financial_2",
    category: "Financial & Scams",
    text: "The Indian government has launched the 'PM Yuva Rozgar Yojana 2025' offering ₹5,000 unemployment allowance to all youth. Registration is free for the next 24 hours only. Apply here: [scam link]",
    tags: ["government-scheme", "scam", "urgency"]
  },
  {
    id: "financial_3",
    category: "Financial & Scams",
    text: "Your electricity bill for last month is unpaid. Your power connection will be disconnected tonight at 10:30 PM. To avoid this, please contact our officer [Mobile Number] immediately.",
    tags: ["utility-scam", "urgency", "threat"]
  },
  {
    id: "political_1",
    category: "Political & Social",
    text: "This is not a festival. This is a crowd of [specific community] protesting against the new Uniform Civil Code in Mumbai. The media is not showing you this.",
    tags: ["communal", "protest", "misleading-context"]
  },
  {
    id: "political_2",
    category: "Political & Social",
    text: "UNESCO has just declared India's new national anthem as the best in the world. A proud moment for all Indians! Jai Hind!",
    tags: ["unesco-hoax", "nationalism", "false-claim"]
  },
  {
    id: "political_3",
    category: "Political & Social",
    text: "The Supreme Court has just ordered that all reservations in government jobs will be canceled from next month. This is a historic decision.",
    tags: ["legal", "false-claim", "divisive"]
  },
  {
    id: "political_4",
    category: "Political & Social",
    text: "New ₹2000 Note with GPS Chip to be Scrapped by RBI Next Week.",
    tags: ["currency", "conspiracy", "gps-chip-hoax"]
  },
  {
    id: "tech_1",
    category: "Technology & General",
    text: "WhatsApp is changing its privacy policy tomorrow. All your private chats and photos will become public. To prevent this, forward this message to 20 of your contacts. You will get a green tick once it's done.",
    tags: ["chain-message", "privacy-fear", "hoax"]
  },
  {
    id: "tech_2",
    category: "Technology & General",
    text: "NASA satellite images have confirmed that a major earthquake will hit Delhi-NCR in the next 72 hours. The government is hiding this to prevent panic. Please evacuate if you can.",
    tags: ["disaster", "nasa-fake", "panic"]
  },
  {
    id: "tech_3",
    category: "Technology & General",
    text: "Indian Student Wins Nobel Prize for Physics for Inventing Free Energy Device.",
    tags: ["fake-achievement", "nobel-hoax", "clickbait"]
  },
  {
    id: "social_1",
    category: "Political & Social",
    text: "Another temple vandalized by extremists in West Bengal last night. Where is the outrage? #HinduismUnderAttack",
    tags: ["communal", "misleading-image", "inflammatory"]
  },
  {
    id: "tech_4",
    category: "Technology & General",
    text: "A new social media app called 'Sarva' is being launched by the government to replace WhatsApp. It will be mandatory to download it, and it will monitor all your activity. This is the end of privacy.",
    tags: ["government-surveillance", "privacy-fear", "false-app"]
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_CLOUD_PROJECT_ID = Deno.env.get('GOOGLE_CLOUD_PROJECT_ID');
    const VERTEX_AI_LOCATION = Deno.env.get('VERTEX_AI_LOCATION') || 'us-central1';

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting RAG ingestion process...');
    const embeddedDocuments = [];

    // Generate embeddings for each misinformation example
    for (const doc of misinformationDataset) {
      console.log(`Processing document: ${doc.id}`);
      
      // Call Gemini embedding model via Lovable AI
      const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-004',
          input: doc.text,
        }),
      });

      if (!embeddingResponse.ok) {
        const errorText = await embeddingResponse.text();
        console.error(`Embedding failed for ${doc.id}:`, errorText);
        continue;
      }

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      embeddedDocuments.push({
        id: doc.id,
        category: doc.category,
        text: doc.text,
        tags: doc.tags,
        embedding: embedding,
        dimension: embedding.length
      });

      console.log(`✓ Embedded ${doc.id} (${embedding.length} dimensions)`);
    }

    console.log(`Successfully embedded ${embeddedDocuments.length} documents`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully embedded ${embeddedDocuments.length} misinformation examples`,
        documents: embeddedDocuments,
        note: 'In production, these embeddings would be stored in Vertex AI Vector Search'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('RAG ingestion error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to ingest misinformation dataset'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
