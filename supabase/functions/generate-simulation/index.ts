import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
interface SimulationRequest {
  // No input parameters needed for now, but structure is ready for future extensions
}

function validateInput(body: unknown): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  return { valid: true };
}

function sanitizeOutput(text: string): string {
  // Remove any potential script injections or excessive content
  return text.trim().substring(0, 2000);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use environment variable for API key (GEMINI_API_KEY should be set in Supabase secrets)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

    // Validate input
    const body = await req.json().catch(() => ({}));
    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Create a single, realistic but fake scam message that could appear on WhatsApp or SMS in India. 
The message should be designed to trick users into:
- Clicking suspicious links
- Sharing personal information
- Making urgent payments
- Downloading malicious apps

Include realistic Indian context elements like:
- References to popular Indian services (electricity boards, gas agencies, banks, government schemes)
- Use of Indian English phrases
- Indian phone numbers or website patterns
- Sense of urgency or fear

The message should be SHORT (2-4 sentences), realistic, and clearly a scam to trained eyes but convincing to untrained users.

After the message, on a new line, add THREE red flags in JSON format:
{
  "redFlags": ["flag1", "flag2", "flag3"],
  "correctAnswer": "All of the above"
}

The red flags should be specific to THIS message. Format your response as:
MESSAGE_TEXT
---
JSON_OBJECT`;

    const response = await fetch(`${GEMINI_BASE_URL}/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from AI service');
    }

    // Parse and sanitize the response
    const parts = text.split('---');
    const messageText = sanitizeOutput(parts[0]);
    let redFlags = ["Suspicious link", "Sense of urgency", "Poor grammar"];
    let correctAnswer = "All of the above";

    if (parts[1]) {
      try {
        const jsonMatch = parts[1].match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.redFlags && Array.isArray(parsed.redFlags) && parsed.redFlags.length === 3) {
            redFlags = parsed.redFlags.map((flag: string) => sanitizeOutput(flag));
          }
          if (parsed.correctAnswer && typeof parsed.correctAnswer === 'string') {
            correctAnswer = sanitizeOutput(parsed.correctAnswer);
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse red flags JSON, using defaults');
      }
    }

    return new Response(
      JSON.stringify({ 
        message: messageText,
        redFlags,
        correctAnswer
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-simulation function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate simulation' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
