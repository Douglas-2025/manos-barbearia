# Guia: Configurar Autenticação Google no Supabase

## Passo 1: Criar um Projeto no Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Criar Projeto"** (ou selecione um existente)
3. Dê um nome: ex. "Mano's Barbearia"
4. Clique em **"Criar"** e aguarde (leva alguns segundos)

## Passo 2: Habilitar a API do Google OAuth

1. No console, vá para **"APIs e Serviços"** (menu esquerdo)
2. Clique em **"Ativar APIs e Serviços"** (botão azul no topo)
3. Procure por **"Google+ API"** ou **"OAuth 2.0"** (ou simplesmente "google+")
4. Clique na opção **"Google+ API"** e clique em **"Ativar"**

## Passo 3: Criar Credenciais OAuth 2.0

1. Vá para **"Credenciais"** (menu esquerdo)
2. Clique em **"Criar Credenciais"** → **"ID do cliente OAuth"**
3. Se pedindo, clique em **"Configurar consentimento"** (Tela de consentimento OAuth)
   - Escolha **"Externo"** (para uso externo)
   - Clique em **"Criar"**
   - Preencha:
     - **Nome do app**: "Mano's Barbearia"
     - **Email de suporte**: seu_email@gmail.com
   - Clique em **"Salvar e continuar"**
   - Deixe escopos vazios e clique em **"Salvar e continuar"** novamente
   - Adicione seu email como testador e clique em **"Salvar e continuar"**

4. Volte para **"Credenciais"** (você será redirecionado automaticamente)
5. Clique novamente em **"Criar Credenciais"** → **"ID do cliente OAuth"**
6. Escolha **"Aplicativo da Web"**
7. Preencha:
   - **Nome**: "Mano's Barbearia Web"
   - **URIs JavaScript autorizados**: 
     - `http://localhost:5173` (desenvolvimento local)
     - `http://localhost:3000` (se usar porta 3000)
   - **URIs de redirecionamento autorizados**:
     - `http://localhost:5173/auth/callback` (ou similar)
     - `https://seu-dominio.com/auth/callback` (depois que deployar)

8. Clique em **"Criar"**
9. Copie o **Client ID** e **Client Secret** (salve em local seguro)

## Passo 4: Configurar no Supabase

1. Acesse seu projeto no **Supabase Dashboard**: https://app.supabase.com/
2. Vá para **"Authentication"** → **"Providers"** (ou "Provedores")
3. Procure por **"Google"** e clique para expandir
4. Habilite (toggle **ON**)
5. Cole:
   - **Client ID**: (do Google Cloud)
   - **Client Secret**: (do Google Cloud)
6. Clique em **"Save"** (Salvar)

## Passo 5: Configurar Site URL no Supabase

1. Em **"Authentication"** → **"URL Configuration"** (ou "Configuração de URL")
2. Configure:
   - **Site URL**: `http://localhost:5173` (ou seu domínio em produção)
   - **Redirect URLs** (adicione):
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/**`

3. Salve as alterações

## Passo 6: Testar no Frontend

Agora o componente `Auth.tsx` já deve funcionar:

1. Rode o projeto:
```bash
npm run dev
```

2. No header, clique em **"Entrar com Google"**
3. Você será redirecionado para a página de login do Google
4. Após confirmar, será redirecionado de volta ao site (logado)
5. Seu email/avatar aparecerá no header

## Passo 7: Verificar se o Usuário foi Criado no Supabase

1. No Supabase Dashboard → **"Authentication"** → **"Users"**
2. Você deve ver um novo usuário com email do Google e provider "google"

## Troubleshooting

**Erro: "redirect_uri mismatch"**
- Verifique se o **Site URL** e **Redirect URLs** no Supabase coincidem
- Verifique se as URLs no Google Cloud Console estão corretas

**Erro: "The given user email has not been verified"**
- Confirme que sua conta Google está verificada
- Tente com outra conta Google

**Não aparece o botão "Entrar com Google"**
- Verifique o console do navegador (F12) para erros
- Certifique-se de que `Auth.tsx` foi importado em `Header.tsx`

## URLs úteis

- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Dashboard**: https://app.supabase.com/
- **Docs Supabase OAuth**: https://supabase.com/docs/guides/auth/social-auth/auth-google

---

**Após configurar**, o fluxo será:
1. Usuário clica "Entrar com Google" (no header)
2. Faz login no Google
3. É redirecionado ao site (logado)
4. Agora pode agendar (o `Agendar.tsx` verifica se está logado)
5. Agendamento é salvo com `user_id` do usuário
