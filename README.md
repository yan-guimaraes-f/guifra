# 🚀 GuiFra - Assistente IA no Vercel

Assistente pessoal com IA de última geração usando **Vercel Serverless Functions** + **Groq API**.

## ✨ Features

- 💬 Chat com IA (Llama 3.3 70B)
- ⚡ Streaming de respostas em tempo real
- 🎨 Interface moderna e responsiva
- 📱 PWA instalável
- 🔒 100% gratuito e sem cadastro
- 🚀 Deploy automático

## 📋 Pré-requisitos

1. Conta no [GitHub](https://github.com)
2. Conta no [Vercel](https://vercel.com)
3. Conta no [Groq](https://console.groq.com)

## 🎯 Deploy em 5 Minutos

### **Passo 1: Obter API Key do Groq**

1. Acesse: https://console.groq.com
2. Crie uma conta (gratuito)
3. Vá em **API Keys**
4. Clique em **Create API Key**
5. Copie a chave (começa com `gsk_...`)

### **Passo 2: Clonar e Configurar o Projeto**

```bash
# Clone ou crie o projeto
mkdir guifra
cd guifra

# Crie a estrutura de pastas
mkdir api public

# Crie os arquivos (use os códigos fornecidos)
# - api/chat.js
# - api/health.js
# - public/index.html
# - public/manifest.json
# - public/sw.js
# - vercel.json
# - package.json
```

### **Passo 3: Instalar Dependências**

```bash
# Instale as dependências
npm install

# Teste localmente (opcional)
npm run dev
```

### **Passo 4: Fazer Deploy no Vercel**

#### **Opção A: Via GitHub (Recomendado)**

1. **Crie repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/guifra.git
   git push -u origin main
   ```

2. **Deploy no Vercel:**
   - Acesse: https://vercel.com
   - Clique em **New Project**
   - Importe seu repositório do GitHub
   - Configure:
     - **Framework Preset:** Other
     - **Root Directory:** ./
   - Clique em **Deploy**

3. **Adicione a variável de ambiente:**
   - No Dashboard do Vercel, vá em **Settings** → **Environment Variables**
   - Adicione:
     - **Name:** `GROQ_API_KEY`
     - **Value:** `gsk_sua_chave_aqui`
   - Clique em **Save**
   - Vá em **Deployments** e faça **Redeploy**

#### **Opção B: Via CLI do Vercel**

```bash
# Instale Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Adicione a API Key
vercel env add GROQ_API_KEY

# Digite sua chave quando solicitado
# Escolha: Production

# Redeploy para aplicar
vercel --prod
```

### **Passo 5: Testar**

Seu site estará disponível em:
```
https://seu-projeto.vercel.app
```

Teste enviando uma mensagem!

## 📁 Estrutura do Projeto

```
guifra/
├── api/
│   ├── chat.js          # Endpoint de chat com streaming
│   └── health.js        # Health check
├── public/
│   ├── index.html       # Frontend
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── vercel.json          # Configuração do Vercel
├── package.json         # Dependências
└── README.md
```

## 🔧 Endpoints da API

### **1. Health Check**
```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "service": "GuiFra API",
  "version": "2.0",
  "groq_configured": true
}
```

### **2. Chat**
```bash
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Olá!" }
  ]
}
```

Response: Server-Sent Events (streaming)

## ⚙️ Configuração Avançada

### **Limites do Vercel Free Tier**

- ✅ 100 GB de bandwidth/mês
- ✅ 100 GB-horas de execução/mês
- ✅ Funções serverless ilimitadas
- ✅ SSL automático

### **Limites do Groq Free Tier**

- ✅ 14,400 requisições/dia
- ✅ 30 requisições/minuto
- ✅ Modelos gratuitos (Llama 3.3 70B)

### **Rate Limiting**

O código já inclui rate limiting básico:
- 20 requisições/minuto por IP

Para produção, considere usar [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) ou [Upstash Redis](https://upstash.com).

### **Adicionar Domínio Customizado**

1. No Vercel Dashboard:
   - **Settings** → **Domains**
   - Adicione seu domínio
   - Configure DNS conforme instruções

## 🐛 Troubleshooting

### **Erro: "GROQ_API_KEY not configured"**

**Solução:**
1. Verifique se adicionou a variável de ambiente no Vercel
2. Faça redeploy após adicionar a variável
3. Certifique-se de que a chave começa com `gsk_`

### **Erro: "Rate limit exceeded"**

**Solução:**
1. Aguarde 1 minuto
2. Se persistir, verifique se há muitos usuários simultâneos
3. Considere implementar Redis para rate limiting

### **Erro: "Failed to fetch"**

**Solução:**
1. Verifique se o deploy foi bem-sucedido
2. Teste o endpoint: `https://seu-projeto.vercel.app/api/health`
3. Verifique CORS no console do navegador

### **Streaming não funciona**

**Solução:**
1. Certifique-se de que está usando `fetch()` com `response.body.getReader()`
2. Verifique se o servidor está enviando headers corretos de SSE
3. Teste em navegador moderno (Chrome, Firefox, Safari)

## 📊 Monitoramento

### **Ver logs em tempo real:**

```bash
vercel logs
```

### **Ver logs de uma função específica:**

```bash
vercel logs --follow api/chat.js
```

### **Analytics do Vercel:**

Acesse: https://vercel.com/seu-usuario/seu-projeto/analytics

## 🔄 Atualizações

Para atualizar o projeto:

```bash
# Faça suas alterações
git add .
git commit -m "Atualização"
git push

# O Vercel fará deploy automático!
```

## 🚀 Melhorias Futuras

- [ ] Histórico de conversas persistente (Vercel KV)
- [ ] Autenticação de usuários (NextAuth)
- [ ] Upload de imagens
- [ ] Compartilhamento de conversas
- [ ] Temas personalizados
- [ ] Múltiplos modelos de IA

## 📝 Licença

MIT License - use livremente!

## 🤝 Contribuindo

Pull requests são bem-vindos!

## 💬 Suporte

Problemas? Abra uma [issue](https://github.com/seu-usuario/guifra/issues).

---

**Feito com ❤️ usando Vercel + Groq**