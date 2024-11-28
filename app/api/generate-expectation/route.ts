import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Simulate expectation generation
    const topic = `Pensando sobre: ${message.slice(0, 30)}...`;

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Error generating expectation:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the expectation' },
      { status: 500 }
    );
  }
}

