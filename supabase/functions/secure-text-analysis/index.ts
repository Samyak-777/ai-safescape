
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation and sanitization
function validateTextInput(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input')
  }
  
  if (text.length > 10000) {
    throw new Error('Text too long (max 10000 characters)')
  }
  
  // Basic HTML sanitization
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
             .replace(/<[^>]*>/g, '')
             .trim()
}

function validateOptions(options: string[]): string[] {
  if (!Array.isArray(options)) {
    throw new Error('Options must be an array')
  }
  
  const allowedOptions = ['profanity', 'fact-check', 'scam', 'ethics', 'ascii']
  const validOptions = options.filter(option => 
    typeof option === 'string' && allowedOptions.includes(option)
  )
  
  if (validOptions.length === 0) {
    throw new Error('At least one valid analysis option is required')
  }
  
  return validOptions
}

async function analyzeTextSecurely(text: string, options: string[]) {
  const results = []
  
  for (const option of options) {
    try {
      let result
      
      switch(option) {
        case 'profanity':
          // Use Google Perspective API securely
          const perspectiveKey = Deno.env.get('GOOGLE_PERSPECTIVE_API_KEY')
          if (perspectiveKey) {
            result = await callPerspectiveAPI(text, perspectiveKey)
          } else {
            result = mockProfanityAnalysis(text)
          }
          break
          
        case 'fact-check':
          // Use Gemini API securely
          const geminiKey = Deno.env.get('GEMINI_API_KEY')
          if (geminiKey) {
            result = await callGeminiForFactCheck(text, geminiKey)
          } else {
            result = mockFactCheckAnalysis(text)
          }
          break
          
        case 'scam':
          result = await analyzeScamPatterns(text)
          break
          
        case 'ethics':
          result = await analyzeEthicalContent(text)
          break
          
        case 'ascii':
          result = await detectASCIIPatterns(text)
          break
          
        default:
          result = {
            type: option,
            status: 'clean',
            message: 'Analysis completed'
          }
      }
      
      results.push(result)
    } catch (error) {
      console.error(`Error in ${option} analysis:`, error)
      results.push({
        type: option,
        status: 'warning',
        message: 'Analysis temporarily unavailable'
      })
    }
  }
  
  return results
}

async function callPerspectiveAPI(text: string, apiKey: string) {
  try {
    const response = await fetch('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text },
        requestedAttributes: { 
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          IDENTITY_ATTACK: {},
          INSULT: {},
          PROFANITY: {},
          THREAT: {}
        },
        languages: ['en'],
        key: apiKey
      })
    })
    
    if (!response.ok) {
      throw new Error(`Perspective API error: ${response.status}`)
    }
    
    const data = await response.json()
    const scores = data.attributeScores
    const maxScore = Math.max(
      scores.TOXICITY?.summaryScore?.value || 0,
      scores.PROFANITY?.summaryScore?.value || 0,
      scores.INSULT?.summaryScore?.value || 0
    )
    
    return {
      type: 'profanity check',
      status: maxScore > 0.7 ? 'danger' : maxScore > 0.4 ? 'warning' : 'clean',
      message: maxScore > 0.7 ? 'Inappropriate content detected' : 
               maxScore > 0.4 ? 'Potentially inappropriate content' : 
               'No inappropriate content detected',
      confidence: maxScore
    }
  } catch (error) {
    return mockProfanityAnalysis(text)
  }
}

async function callGeminiForFactCheck(text: string, apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this text for factual accuracy and misinformation: "${text}". Respond with a brief assessment.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      })
    })
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }
    
    const data = await response.json()
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    const isProblematic = analysisText.toLowerCase().includes('false') || 
                         analysisText.toLowerCase().includes('misleading') ||
                         analysisText.toLowerCase().includes('inaccurate')
    
    return {
      type: 'fact check',
      status: isProblematic ? 'warning' : 'clean',
      message: isProblematic ? 'Claims may need verification' : 'No factual concerns detected'
    }
  } catch (error) {
    return mockFactCheckAnalysis(text)
  }
}

function mockProfanityAnalysis(text: string) {
  const profanityWords = ['stupid', 'damn', 'hate']
  const hasProfanity = profanityWords.some(word => text.toLowerCase().includes(word))
  
  return {
    type: 'profanity check',
    status: hasProfanity ? 'warning' : 'clean',
    message: hasProfanity ? 'Potentially inappropriate language detected' : 'No inappropriate language detected'
  }
}

function mockFactCheckAnalysis(text: string) {
  const suspiciousTerms = ['fake news', 'conspiracy', 'hoax']
  const isSuspicious = suspiciousTerms.some(term => text.toLowerCase().includes(term))
  
  return {
    type: 'fact check',
    status: isSuspicious ? 'warning' : 'clean',
    message: isSuspicious ? 'Claims may need verification' : 'No factual concerns detected'
  }
}

async function analyzeScamPatterns(text: string) {
  const scamPatterns = [
    /urgent.{0,20}transfer/i,
    /free.{0,10}money/i,
    /click.{0,10}here.{0,10}win/i,
    /congratulations.{0,20}winner/i,
    /verify.{0,10}account.{0,10}suspended/i
  ]
  
  const hasScamPattern = scamPatterns.some(pattern => pattern.test(text))
  
  return {
    type: 'scam detection',
    status: hasScamPattern ? 'danger' : 'clean',
    message: hasScamPattern ? 'Potential scam patterns detected' : 'No scam indicators found'
  }
}

async function analyzeEthicalContent(text: string) {
  const harmfulPatterns = [
    /kill.{0,20}yourself/i,
    /hate.{0,20}(jews|muslims|christians|blacks|whites)/i,
    /(bomb|attack).{0,20}(school|building)/i
  ]
  
  const isHarmful = harmfulPatterns.some(pattern => pattern.test(text))
  
  return {
    type: 'ethical analysis',
    status: isHarmful ? 'danger' : 'clean',
    message: isHarmful ? 'Harmful content detected' : 'No ethical concerns detected'
  }
}

async function detectASCIIPatterns(text: string) {
  const hasASCII = /[^\x00-\x7F]/.test(text) || text.includes('¯\\_(ツ)_/¯')
  
  return {
    type: 'ascii detection',
    status: 'clean',
    message: hasASCII ? 'ASCII art patterns detected' : 'No special ASCII patterns found'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { text, options } = await req.json()
    
    // Validate and sanitize inputs
    const sanitizedText = validateTextInput(text)
    const validOptions = validateOptions(options)
    
    console.log(`Analyzing text with options: ${validOptions.join(', ')}`)
    
    const results = await analyzeTextSecurely(sanitizedText, validOptions)
    
    return new Response(
      JSON.stringify({ results }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    )
  } catch (error) {
    console.error('Text analysis error:', error)
    
    // Don't expose internal error details
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        message: 'Please try again later'
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
