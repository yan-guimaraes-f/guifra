/**
 * Chat Endpoint com Streaming
 * POST /api/chat
 */

import Groq from 'groq-sdk';

// System prompt
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

// Rate limiting simples (em memória)
const requestCounts = new Map();
const MAX_REQUESTS_PER_MINUTE = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];
  
  // Remove requisições antigas (>1 minuto)
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  return true;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verifica API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: 'API key not configured',
        message: 'Configure GROQ_API_KEY no Vercel'
      });
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Máximo de ${MAX_REQUESTS_PER_MINUTE} requisições por minuto`
      });
    }

    // Valida body
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'messages array is required'
      });
    }

    // Valida estrutura das mensagens
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({
          error: 'Invalid message format',
          message: 'Each message must have role and content'
        });
      }
    }

    // Prepara mensagens com system prompt
    const fullMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Inicializa Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Configura streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Cria stream
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 8000,
      stream: true
    });

    // Envia chunks
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Sinal de conclusão
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Erro no chat:', error);
    
    // Se ainda não enviou headers, envia JSON de erro
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
    
    // Se já está em streaming, envia erro via SSE
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}

// Configuração do Vercel para desabilitar body parsing (streaming)
export const config = {
  api: {
    bodyParser: true
  }
};