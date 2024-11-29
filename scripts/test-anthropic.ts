import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testAnthropicAPI() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-2.1',
      messages: [{ role: 'user', content: 'Hola, ¿cómo estás?' }],
      max_tokens: 100,
    });
    console.log('Respuesta de Anthropic:', response.content);
  } catch (error) {
    console.error('Error al conectar con Anthropic:', error);
  }
}

testAnthropicAPI();

