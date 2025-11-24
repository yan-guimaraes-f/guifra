/**
 * Health Check Endpoint
 * GET /api/health
 * 
 * Verifica se a API está funcionando e se o Groq está configurado
 */

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return health status
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GuiFra API',
    version: '2.0',
    groq_configured: !!process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  });
}