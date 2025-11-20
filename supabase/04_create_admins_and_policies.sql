-- Cria tabela de admins e políticas para permitir que apenas admins vejam/atualizem agendamentos
-- Cole este arquivo no SQL Editor do Supabase e execute.

-- 1) Cria tabela admins vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- 2) Garantir que RLS está habilitado na tabela agendamentos (se ainda não estiver)
ALTER TABLE IF EXISTS public.agendamentos ENABLE ROW LEVEL SECURITY;

-- 3) Policy: apenas admins podem SELECT (ver) agendamentos
DROP POLICY IF EXISTS "admins can select agendamentos" ON public.agendamentos;
CREATE POLICY "admins can select agendamentos" ON public.agendamentos
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()));

-- 4) Policy: apenas admins podem UPDATE (por exemplo para mudar status)
DROP POLICY IF EXISTS "admins can update agendamentos" ON public.agendamentos;
CREATE POLICY "admins can update agendamentos" ON public.agendamentos
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()));

-- 5) Policy: qualquer usuário autenticado pode INSERT (fazer um agendamento)
DROP POLICY IF EXISTS "authenticated can insert" ON public.agendamentos;
CREATE POLICY "authenticated can insert" ON public.agendamentos
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Observação: para adicionar um admin, após criar um usuário via Google, pegue o `id` dele
-- em Authentication → Users no Supabase e execute:
-- INSERT INTO public.admins (user_id) VALUES ('<USER_ID>');

-- === Inserir admin inicial fornecido pelo usuário ===
-- Substitua ou remova esta linha se preferir inserir o admin manualmente no SQL Editor.
INSERT INTO public.admins (user_id)
VALUES ('73211767-c427-4045-b20e-8645c175f12d')
ON CONFLICT (user_id) DO NOTHING;

-- Habilita RLS na tabela de admins para que as políticas abaixo possam ser aplicadas
ALTER TABLE IF EXISTS public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: apenas admins existentes podem gerenciar (SELECT/INSERT/UPDATE/DELETE) outros admins
DROP POLICY IF EXISTS "admins manage admins" ON public.admins;
CREATE POLICY "admins manage admins" ON public.admins
  FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE public.admins.user_id = auth.uid()));

-- Função RPC segura para adicionar um admin — apenas admins atuais podem chamar
CREATE OR REPLACE FUNCTION public.add_admin(p_user_id uuid)
RETURNS void LANGUAGE sql STABLE AS $$
  INSERT INTO public.admins (user_id)
  SELECT p_user_id
  WHERE EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- Função RPC segura para remover um admin — apenas admins atuais podem chamar
CREATE OR REPLACE FUNCTION public.remove_admin(p_user_id uuid)
RETURNS void LANGUAGE sql STABLE AS $$
  DELETE FROM public.admins
  WHERE user_id = p_user_id
  AND EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- Observação: chame as funções via Supabase RPC (ex.: supabase.rpc('add_admin', { p_user_id }))
-- Somente a conta com user_id '73211767-c427-4045-b20e-8645c175f12d' (inserida acima)
-- conseguirá adicionar outros admins enquanto esta política estiver ativa.
