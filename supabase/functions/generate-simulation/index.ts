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
    const GEMINI_API_KEY = 'AIzaSyBGYfToFI7spphZQ7VgEGxdLKstZjbUh1g';
    const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

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
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Parse the response
    const parts = text.split('---');
    const messageText = parts[0].trim();
    let redFlags = ["Suspicious link", "Sense of urgency", "Poor grammar"];
    let correctAnswer = "All of the above";

    if (parts[1]) {
      try {
        const jsonMatch = parts[1].match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.redFlags && Array.isArray(parsed.redFlags)) {
            redFlags = parsed.redFlags;
          }
          if (parsed.correctAnswer) {
            correctAnswer = parsed.correctAnswer;
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
      JSON.stringify({ error: error.message || 'Failed to generate simulation' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});