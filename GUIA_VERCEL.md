# 🚀 Guia de Deploy para Vercel

## Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Projeto no GitHub (ou conectar ao Vercel via Git)
- Projeto Supabase configurado

## Passo 1: Conectar repositório ao Vercel

1. Acesse https://vercel.com/new
2. Selecione "Import Git Repository"
3. Conecte sua conta GitHub
4. Selecione o repositório `Lading-page-barbearia-main`
5. Clique em "Import"

## Passo 2: Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **Settings** → **Environment Variables**

Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://osefaescjkyrsnhyhrzg.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZWZhZXNjamt5cnNuaHlocnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDM1MTksImV4cCI6MjA3MjQxOTUxOX0.MVWehCQpZs5B0-dX6xNh3ANVRU10JyFDkCAkvoqthGQ
VITE_GOOGLE_CLIENT_ID = SEU_GOOGLE_CLIENT_ID_AQUI
VITE_APP_URL = https://seu-projeto.vercel.app
VITE_REDIRECT_URL = https://seu-projeto.vercel.app/agendar
```

⚠️ **Importante**: Marque essas variáveis para aparecer em:
- ✅ Production
- ✅ Preview
- ❌ Development (o .env.local é usado localmente)

## Passo 3: Configurar Google OAuth para Produção

1. Acesse Google Cloud Console (https://console.cloud.google.com)
2. Vá em **Credentials** → Clique no seu OAuth Client
3. Em **Authorized redirect URIs**, adicione:
   ```
   https://seu-projeto.vercel.app/agendar
   https://seu-projeto.vercel.app/
   ```
4. Copie o **Client ID** atualizado
5. Cole em `VITE_GOOGLE_CLIENT_ID` no Vercel

## Passo 4: Configurar Supabase para Produção

1. Acesse Supabase Dashboard → seu projeto
2. Vá em **Authentication** → **URL Configuration**
3. Atualize **Site URL** para: `https://seu-projeto.vercel.app`
4. Adicione em **Redirect URLs**: `https://seu-projeto.vercel.app/`

## Passo 5: Deploy

1. Volte ao Vercel
2. Clique em **Deploy**
3. Aguarde o build completar ✅

## Verificar Deploy

- Acesse: `https://seu-projeto.vercel.app`
- Teste o login com Google
- Teste o agendamento
- Verifique se os dados estão salvando no Supabase

## Troubleshooting

### Erro: "redirect_uri_mismatch"
- Confirme que a URL no Vercel bate com a URL no Google Cloud
- Limpe o cache do browser (Ctrl+Shift+Delete)

### Erro: "Unsupported provider: provider is not enabled"
- Google OAuth não está habilitado no Supabase
- Vá em Supabase → Authentication → Providers → Google (ativar toggle)

### Env vars não funcionando
- Confirme que estão configuradas em Environment Variables
- Redeploy o projeto: Vercel → Deployments → (seu deploy) → Redeploy

## Próximos Passos

- [ ] Configurar domínio customizado
- [ ] Habilitar HTTPS (automático no Vercel)
- [ ] Configurar analytics
- [ ] Backup automático do Supabase

---

**Dúvidas?** Consulte a documentação oficial:
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
