-- Arquivo: 07_create_is_admin_rpc.sql
-- Função RPC para verificar se o usuário logado é um administrador.
-- Cole e execute no Supabase SQL Editor.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- Conceder permissão de execução para o role 'authenticated'
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
