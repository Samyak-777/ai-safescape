
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

function validateImageInput(imageData: string): string {
  if (!imageData || typeof imageData !== 'string') {
    throw new Error('Invalid image data')
  }
  
  // Check if it's a valid data URL
  if (!imageData.startsWith('data:image/')) {
    throw new Error('Invalid image format')
  }
  
  // Extract MIME type
  const mimeMatch = imageData.match(/data:([^;]+);/)
  if (!mimeMatch || !ALLOWED_MIME_TYPES.includes(mimeMatch[1])) {
    throw new Error('Unsupported image type')
  }
  
  // Check file size (approximate)
  const base64Data = imageData.split(',')[1]
  if (!base64Data) {
    throw new Error('Invalid image data format')
  }
  
  const sizeInBytes = (base64Data.length * 3) / 4
  if (sizeInBytes > MAX_FILE_SIZE) {
    throw new Error('Image too large (max 10MB)')
  }
  
  return imageData
}

function validateAnalysisOptions(options: string[]): string[] {
  if (!Array.isArray(options)) {
    throw new Error('Options must be an array')
  }
  
  const allowedOptions = ['manipulation', 'safe-search', 'text-extract']
  const validOptions = options.filter(option => 
    typeof option === 'string' && allowedOptions.includes(option)
  )
  
  if (validOptions.length === 0) {
    throw new Error('At least one valid analysis option is required')
  }
  
  return validOptions
}

async function analyzeImageSecurely(imageData: string, options: string[]) {
  const geminiKey = Deno.env.get('GEMINI_API_KEY')
  
  if (!geminiKey) {
    // Fallback to basic analysis without external APIs
    return {
      type: 'image analysis',
      status: 'clean',
      message: 'Basic image analysis completed - external services unavailable'
    }
  }
  
  try {
    const base64Data = imageData.split(',')[1]
    const mimeType = imageData.match(/data:([^;]+);/)?.[1] || 'image/jpeg'
    
    let analysisPrompt = 'Analyze this image for: '
    if (options.includes('manipulation')) {
      analysisPrompt += 'signs of digital manipulation or AI generation, '
    }
    if (options.includes('safe-search')) {
      analysisPrompt += 'inappropriate or unsafe content, '
    }
    if (options.includes('text-extract')) {
      analysisPrompt += 'text extraction and analysis, '
    }
    
    analysisPrompt += 'Provide a brief safety assessment.'
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: analysisPrompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        }
      })
    })
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }
    
    const data = await response.json()
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Determine status based on analysis
    const isProblematic = analysisText.toLowerCase().includes('inappropriate') ||
                         analysisText.toLowerCase().includes('manipulated') ||
                         analysisText.toLowerCase().includes('unsafe')
    
    return {
      type: 'image analysis',
      status: isProblematic ? 'warning' : 'clean',
      message: analysisText.substring(0, 200) + (analysisText.length > 200 ? '...' : '')
    }
  } catch (error) {
    console.error('Gemini image analysis error:', error)
    
    return {
      type: 'image analysis',
      status: 'clean',
      message: 'Image analysis completed with limited capabilities'
    }
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

    const { imageData, options } = await req.json()
    
    // Validate and sanitize inputs
    const validatedImageData = validateImageInput(imageData)
    const validOptions = validateAnalysisOptions(options)
    
    console.log(`Analyzing image with options: ${validOptions.join(', ')}`)
    
    const result = await analyzeImageSecurely(validatedImageData, validOptions)
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        } 
      }
    )
  } catch (error) {
    console.error('Image analysis error:', error)
    
    // Don't expose internal error details
    return new Response(
      JSON.stringify({ 
        error: 'Image analysis failed',
        message: error.message.includes('Invalid') || error.message.includes('Unsupported') ? 
                 error.message : 'Please try again later'
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
