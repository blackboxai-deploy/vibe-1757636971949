import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes for image generation

interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    const { prompt, width = 1024, height = 1024, model = "replicate/black-forest-labs/flux-1.1-pro" } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhanced prompt with technical specifications
    const enhancedPrompt = `${prompt.trim()}, high quality, detailed, professional photography, 8k resolution, masterpiece`;

    console.log('Starting image generation with prompt:', enhancedPrompt);
    console.log('Using model:', model);
    console.log('Dimensions:', `${width}x${height}`);

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_STRkIoYmokvKxA',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('AI API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate image', 
          details: `API returned ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('AI API Response received');

    // Extract image URL from response
    let imageUrl = '';
    
    if (result.choices && result.choices[0] && result.choices[0].message) {
      const content = result.choices[0].message.content;
      
      // Check if content is a direct URL
      if (typeof content === 'string' && (content.startsWith('http') || content.startsWith('https'))) {
        imageUrl = content.trim();
      } else {
        // Try to extract URL from text response
        const urlMatch = content.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          imageUrl = urlMatch[1];
        }
      }
    }

    if (!imageUrl) {
      console.error('No image URL found in response:', result);
      return NextResponse.json(
        { 
          error: 'No image generated', 
          details: 'AI service did not return a valid image URL',
          response: result,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    console.log('Image generated successfully:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      settings: {
        width,
        height,
        model
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}