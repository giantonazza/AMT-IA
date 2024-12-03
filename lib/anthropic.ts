import { Anthropic } from '@anthropic-ai/sdk';

const isDevelopment = process.env.NODE_ENV === 'development';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: isDevelopment,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function chatWithAI(messages: Message[]) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Please check your .env.local file.');
  }

  if (!isDevelopment) {
    throw new Error('Direct API calls from the browser are not allowed in production. Please use a server-side API route.');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      stream: true,
    });

    return response;
  } catch (error) {
    console.error('Error in chatWithAI:', error);
    throw error;
  }
}

