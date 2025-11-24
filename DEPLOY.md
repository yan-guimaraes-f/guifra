# 📸 Guia Visual: Deploy no Vercel

## 🎯 Resumo Rápido

1. ✅ Criar conta no Groq → Copiar API Key
2. ✅ Criar repositório no GitHub
3. ✅ Conectar Vercel ao GitHub
4. ✅ Adicionar variável de ambiente
5. ✅ Deploy automático! 🚀

---

## 📋 PASSO 1: Obter API Key do Groq

### 1.1 - Criar conta no Groq

🔗 Acesse: **https://console.groq.com**

```
┌─────────────────────────────────────┐
│                                     │
│   [Sign Up] ou [Sign in]          │
│                                     │
│   Use Google/GitHub para login     │
│                                     │
└─────────────────────────────────────┘
```

### 1.2 - Gerar API Key

Após login, no menu lateral:

```
┌─────────────────────────────────────┐
│  Console                            │
│  ├─ Overview                        │
│  ├─ Playground                      │
│  └─ API Keys  ← CLIQUE AQUI        │
└─────────────────────────────────────┘
```

Clique em **"Create API Key"**:

```
┌─────────────────────────────────────┐
│  Create API Key                     │
│                                     │
│  Name: GuiFra Production           │
│                                     │
│  [Create]                          │
└─────────────────────────────────────┘
```

### 1.3 - Copiar a chave

```
┌─────────────────────────────────────┐
│  API Key created!                   │
│                                     │
│  gsk_xxxxxxxxxxxxxxxxxxxxxxx        │
│                                     │
│  [Copy]  ← COPIE AGORA!            │
│                                     │
│  ⚠️ Você só verá isso UMA VEZ!     │
└─────────────────────────────────────┘
```

**IMPORTANTE:** Salve essa chave em um lugar seguro!

---

## 📁 PASSO 2: Criar Projeto Localmente

### 2.1 - Estrutura de pastas

Crie esta estrutura:

```
guifra/
├── api/
│   ├── chat.js
│   └── health.js
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
├── vercel.json
├── package.json
├── .gitignore
└── README.md
```

### 2.2 - Criar .gitignore

```
node_modules/
.vercel/
.env
.env.local
```

### 2.3 - Copiar os códigos

Use os códigos dos artefatos anteriores para criar cada arquivo.

---

## 🐙 PASSO 3: Criar Repositório no GitHub

### 3.1 - Criar novo repositório

Acesse: **https://github.com/new**

```
┌─────────────────────────────────────┐
│  Create a new repository            │
│                                     │
│  Repository name: guifra           │
│                                     │
│  ○ Public                          │
│  ● Private                         │
│                                     │
│  [ ] Add README                    │
│  [ ] Add .gitignore                │
│                                     │
│  [Create repository]               │
└─────────────────────────────────────┘
```

### 3.2 - Fazer push do código

No terminal:

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit"

# Conectar ao GitHub
git remote add origin https://github.com/SEU-USUARIO/guifra.git
git branch -M main
git push -u origin main
```

**Resultado esperado:**

```
✓ Comprimindo objetos: 100%
✓ Escrevendo objetos: 100%
✓ Branch 'main' definida para rastrear 'origin/main'
```

---

## 🚀 PASSO 4: Deploy no Vercel

### 4.1 - Criar conta no Vercel

🔗 Acesse: **https://vercel.com/signup**

```
┌─────────────────────────────────────┐
│  Sign up to Vercel                  │
│                                     │
│  [Continue with GitHub]  ← USE     │
│                                     │
└─────────────────────────────────────┘
```

Autorize o acesso aos seus repositórios.

### 4.2 - Importar projeto

No dashboard do Vercel:

```
┌─────────────────────────────────────┐
│  Import Git Repository              │
│                                     │
│  🔍 Search: guifra                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 guifra                   │   │
│  │ seu-usuario/guifra          │   │
│  │                [Import]     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 4.3 - Configurar projeto

```
┌─────────────────────────────────────┐
│  Configure Project                  │
│                                     │
│  Project Name: guifra              │
│                                     │
│  Framework Preset:                 │
│  [Other]  ← DEIXE ASSIM            │
│                                     │
│  Root Directory: ./                │
│                                     │
│  Build Command: [vazio]            │
│  Output Directory: [vazio]         │
│                                     │
│  [Deploy]                          │
└─────────────────────────────────────┘
```

Clique em **Deploy** e aguarde...

```
⏳ Building...
⏳ Deploying...
✅ Deployed!

Your project is live at:
https://guifra.vercel.app
```

**ATENÇÃO:** Ainda não vai funcionar! Falta adicionar a API Key.

---

## 🔑 PASSO 5: Adicionar API Key

### 5.1 - Acessar configurações

No dashboard do projeto:

```
┌─────────────────────────────────────┐
│  guifra                             │
│                                     │
│  [Deployments]  [Analytics]         │
│  [Settings]  ← CLIQUE AQUI         │
└─────────────────────────────────────┘
```

### 5.2 - Environment Variables

No menu lateral de Settings:

```
┌─────────────────────────────────────┐
│  Settings                           │
│  ├─ General                         │
│  ├─ Domains                         │
│  ├─ Environment Variables ← AQUI   │
│  ├─ Git                             │
│  └─ Advanced                        │
└─────────────────────────────────────┘
```

### 5.3 - Adicionar variável

```
┌─────────────────────────────────────┐
│  Environment Variables              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Name:  GROQ_API_KEY        │   │
│  │                             │   │
│  │ Value: gsk_xxxxxxxxxx      │   │
│  │                             │   │
│  │ Environment:                │   │
│  │ ☑ Production                │   │
│  │ ☐ Preview                   │   │
│  │ ☐ Development               │   │
│  │                             │   │
│  │ [Save]                      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**IMPORTANTE:** Cole sua API Key do Groq (copiada no Passo 1)!

### 5.4 - Redeploy

Após salvar a variável:

```
┌─────────────────────────────────────┐
│  ⚠️ Redeploy required               │
│                                     │
│  Changes to environment variables   │
│  require a new deployment.          │
│                                     │
│  [Redeploy]  ← CLIQUE              │
└─────────────────────────────────────┘
```

Ou vá em **Deployments** → **︙** → **Redeploy**

Aguarde o deploy:

```
⏳ Building...
⏳ Deploying...
✅ Ready!
```

---

## ✅ PASSO 6: Testar

### 6.1 - Abrir o site

```
https://guifra.vercel.app
```

### 6.2 - Testar health check

Abra no navegador:

```
https://guifra.vercel.app/api/health
```

Deve retornar:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "service": "GuiFra API",
  "version": "2.0",
  "groq_configured": true
}
```

**✅ Se `groq_configured: true` → Tudo OK!**

**❌ Se `groq_configured: false` → API Key incorreta**

### 6.3 - Testar o chat

1. Abra `https://guifra.vercel.app`
2. Digite uma mensagem: **"Olá!"**
3. Pressione Enter
4. Deve receber resposta do GuiFra! 🎉

---

## 🎉 Pronto!

Seu assistente IA está no ar!

```
┌─────────────────────────────────────┐
│                                     │
│     🚀 DEPLOY BEM-SUCEDIDO! 🚀     │
│                                     │
│  Seu site:                         │
│  https://guifra.vercel.app         │
│                                     │
│  ✅ Frontend funcionando           │
│  ✅ API funcionando                │
│  ✅ Groq conectado                 │
│  ✅ PWA instalável                 │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Atualizações Futuras

Para atualizar seu site, basta:

```bash
# Faça suas alterações nos arquivos
git add .
git commit -m "Melhoria X"
git push

# Vercel faz deploy automático!
# ✅ Sem precisar fazer nada
```

---

## 🐛 Problemas Comuns

### ❌ Erro: "GROQ_API_KEY not configured"

**Solução:**
1. Vá em Settings → Environment Variables
2. Verifique se a variável existe
3. Certifique-se de que `Production` está marcado
4. Faça Redeploy

### ❌ Erro: "Rate limit exceeded"

**Solução:**
- Aguarde 1 minuto
- Limite: 20 req/min por IP

### ❌ Streaming não funciona

**Solução:**
- Use navegador moderno (Chrome, Firefox, Safari)
- Verifique se não há bloqueador de anúncios interferindo

### ❌ Site não abre

**Solução:**
1. Vá em Deployments
2. Clique no último deploy
3. Veja os logs de erro
4. Se houver erro de build, corrija o código

---

## 📊 Verificar Status

### Vercel Dashboard

```
https://vercel.com/seu-usuario/guifra
```

Você pode ver:
- ✅ Status do deploy
- 📊 Analytics (visitas, banda)
- 📝 Logs em tempo real
- ⚙️ Configurações

### Logs em tempo real

Via CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ver logs
vercel logs --follow
```

---

## 🎯 Próximos Passos

1. **Domínio customizado**
   - Settings → Domains
   - Adicione: `meu-site.com`

2. **Analytics**
   - Settings → Analytics
   - Habilite Vercel Analytics

3. **Melhorias**
   - Adicione histórico persistente
   - Implemente autenticação
   - Adicione mais modelos

---

**🎉 Parabéns! Seu GuiFra está no ar! 🎉**