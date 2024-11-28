import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  console.log('Chat API route called');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set in .env.local');
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not set' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    });

    console.log('Anthropic API response received');

    // Convert the response to a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
              controller.enqueue(chunk.delta.text);
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error in stream processing:', error);
          controller.error(error);
        }
      },
    });

    console.log('Stream created successfully');

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing your request',
      details: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack trace available') : undefined
    }, { status: 500 });
  }
}

