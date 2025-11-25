/**
 * Chat Endpoint com Streaming — Vercel Edge Runtime
 * POST /api/chat
 */

import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Você é o GuiFra, um assistente pessoal de IA de última geração, criado para ser:

🎯 CARACTERÍSTICAS:
- Extremamente inteligente e conhecedor
- Claro, direto e objetivo nas respostas
- Criativo quando necessário
- Profissional mas amigável
- Usa markdown para formatar respostas

💡 HABILIDADES:
- Programação em múltiplas linguagens
- Análise de dados e matemática
- Escrita criativa e técnica
- Resolução de problemas complexos
- Explicações didáticas

📝 FORMATO DAS RESPOSTAS:
- Use **negrito** para ênfase
- Use \`código\` para termos técnicos
- Use listas quando apropriado
- Use emojis com moderação
- Seja conciso mas completo

Responda SEMPRE em português brasileiro, de forma clara e útil.`;

// Rate limiting simples (Edge-compatible: usa Map global)
const requestCounts = new Map();
const MAX_REQUESTS_PER_MINUTE = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < 60_000);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

// ✅ Edge Runtime: exporta uma função que recebe Request e retorna Response
export default async function handler(request) {
  // CORS headers (para todos os métodos)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };

  // Handle OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Valida API key
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'API key not configured',
          message: 'Configure GROQ_API_KEY no painel do Vercel'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtém IP (Edge-safe)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Máximo de ${MAX_REQUESTS_PER_MINUTE} requisições por minuto`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: 'Each message must have role and content' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Prepara mensagens
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Inicializa Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // 🔥 STREAMING com ReadableStream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile', // ✅ Modelo mais poderoso
            messages: fullMessages,
            temperature: 0.7,
            max_tokens: 8000,
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              // Formato compatível com seu frontend: "data: {...}\n\n"
              const payload = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }

          // Sinal de fim — seu frontend espera [DONE] ou done:true
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();

        } catch (error) {
          console.error('Stream error:', error);
          const errorMsg = JSON.stringify({ error: error.message || 'Erro interno' });
          controller.enqueue(encoder.encode(`data: ${errorMsg}\n\n`));
          controller.close();
        }
      }
    });

    // ✅ Resposta com streaming
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // importante para Nginx/proxy
      },
    });

  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// ✅ Configuração para Edge Runtime (obrigatório)
export const config = {
  runtime: 'edge',
};
