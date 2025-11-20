-- =====================================================================
-- Sistema v2.0: Tabela de Usuários com CRUD de Admin
-- Cria public.users com sincronização automática de auth.users
-- =====================================================================

-- 1) Criar tabela public.users (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Habilitar RLS na tabela users
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- 3) Policy: Qualquer usuário autenticado pode ver seu próprio registro
DROP POLICY IF EXISTS "users can view own profile" ON public.users;
CREATE POLICY "users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4) Policy: Apenas admins podem listar todos os usuários
DROP POLICY IF EXISTS "admins can list all users" ON public.users;
CREATE POLICY "admins can list all users" ON public.users
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()));

-- 5) Policy: Apenas admins podem atualizar is_admin
DROP POLICY IF EXISTS "admins can update user is_admin" ON public.users;
CREATE POLICY "admins can update user is_admin" ON public.users
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()));

-- 6) Função RPC: sincronizar usuário do auth.users para public.users
-- Chamada automaticamente após login ou manualmente via supabase.rpc()
CREATE OR REPLACE FUNCTION public.sync_user_from_auth()
RETURNS json LANGUAGE sql STABLE AS $$
  INSERT INTO public.users (user_id, email, is_admin)
  VALUES (auth.uid(), auth.jwt()->>'email', false)
  ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email, updated_at = now()
  RETURNING json_build_object('user_id', user_id, 'email', email, 'is_admin', is_admin);
$$;

-- 7) Função RPC: listar todos os usuários (só para admins)
CREATE OR REPLACE FUNCTION public.list_users()
RETURNS TABLE(user_id uuid, email text, is_admin boolean, created_at timestamptz) 
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT user_id, email, is_admin, created_at
  FROM public.users
  WHERE EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid())
  ORDER BY created_at DESC;
$$;

-- 8) Função RPC: atualizar is_admin de um usuário (só para admins)
CREATE OR REPLACE FUNCTION public.update_user_is_admin(p_user_id uuid, p_is_admin boolean)
RETURNS json LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.users
  SET is_admin = p_is_admin, updated_at = now()
  WHERE user_id = p_user_id
  AND EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid())
  RETURNING json_build_object('user_id', user_id, 'email', email, 'is_admin', is_admin, 'updated_at', updated_at);
$$;

-- 9) Função RPC: deletar usuário (só para admins, cascade delete auth)
CREATE OR REPLACE FUNCTION public.delete_user(p_user_id uuid)
RETURNS json LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.users
  WHERE user_id = p_user_id
  AND EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid())
  RETURNING json_build_object('deleted_user_id', user_id, 'email', email);
$$;

-- =====================================================================
-- INSTRUÇÕES DE USO:
-- =====================================================================
-- 1. Execute este arquivo no SQL Editor do Supabase.
-- 2. Após fazer login com Google no app, a RPC sync_user_from_auth será chamada
--    automaticamente ou você pode chamar manualmente: supabase.rpc('sync_user_from_auth')
-- 3. No painel admin (/barbeiro), o usuário admin poderá:
--    - Listar todos os usuários: supabase.rpc('list_users')
--    - Ativar/desativar admin: supabase.rpc('update_user_is_admin', { p_user_id, p_is_admin })
--    - Deletar usuário: supabase.rpc('delete_user', { p_user_id })
-- 4. O primeiro admin foi inserido em 04_create_admins_and_policies.sql com user_id
--    73211767-c427-4045-b20e-8645c175f12d
-- 5. Após rodar este arquivo, todos os usuários que fizerem login terão registros em
--    public.users com is_admin = false por padrão. O admin pode mudar isso no painel.
