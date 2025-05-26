import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

export interface ContentProcessingRequest {
  rawContent: string;
  template: {
    name: string;
    description: string;
    prompt: string;
    platform: string;
  };
  additionalInstructions?: string;
}

export interface ProcessedContent {
  linkedin: string;
  twitter: string;
}

export async function processContentWithOpenAI({
  rawContent,
  template,
  additionalInstructions = ""
}: ContentProcessingRequest): Promise<ProcessedContent> {
  try {
    const systemPrompt = `You are a professional social media content creator. Your task is to transform raw content into platform-optimized posts for LinkedIn and Twitter.

TEMPLATE INFORMATION:
- Name: ${template.name}
- Description: ${template.description}
- Platform Focus: ${template.platform}
- Template Instructions: ${template.prompt}

ADDITIONAL INSTRUCTIONS:
${additionalInstructions}

PLATFORM REQUIREMENTS:
LinkedIn:
- Professional tone
- Can be longer (up to 3000 characters)
- Encourage engagement
- Professional formatting with line breaks
- NO hashtags

Twitter:
- Concise and engaging
- Maximum 280 characters
- Clear call-to-action when appropriate
- Thread-friendly if content is complex
- NO hashtags

Please return ONLY a valid JSON object with this exact structure:
{
  "linkedin": "LinkedIn optimized content here",
  "twitter": "Twitter optimized content here"
}`;

    const userPrompt = `Raw content to transform: "${rawContent}"

Please apply the template instructions and create optimized versions for both LinkedIn and Twitter. Ensure the content maintains the original message while being platform-appropriate. Do not include any hashtags in the output.`;

    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedContent: ProcessedContent;
    try {
      parsedContent = JSON.parse(responseContent);
    } catch (parseError) {
      // Fallback: try to extract content if JSON parsing fails
      console.warn('Failed to parse OpenAI response as JSON, attempting fallback extraction');
      throw new Error('Invalid response format from OpenAI');
    }

    // Validate the response structure
    if (!parsedContent.linkedin || !parsedContent.twitter) {
      throw new Error('Incomplete response from OpenAI');
    }

    return parsedContent;
  } catch (error) {
    console.error('OpenAI processing error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error('OpenAI quota exceeded. Please check your billing and usage limits.');
      }
      if (error.message.includes('401') || error.message.includes('authentication')) {
        throw new Error('OpenAI authentication failed. Please check your API key.');
      }
      if (error.message.includes('OPENAI_API_KEY')) {
        throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.');
      }
    }
    
    throw new Error(`Content processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    await getOpenAIClient().models.list();
    return true;
  } catch (error) {
    console.error('OpenAI connection validation failed:', error);
    return false;
  }
} 