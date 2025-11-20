-- ============================================
-- SETUP COMPLETO: Profiles + Agendamentos v2
-- ============================================
-- Cole TUDO isso de uma vez no Supabase SQL Editor

-- 1️⃣ Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- 2️⃣ Adicionar colunas em agendamentos
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS price numeric(10,2),
  ADD COLUMN IF NOT EXISTS service_label text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmado',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 3️⃣ Constraint de unicidade (data + hora)
ALTER TABLE IF EXISTS public.agendamentos
  DROP CONSTRAINT IF EXISTS unique_data_hora;

ALTER TABLE IF EXISTS public.agendamentos
  ADD CONSTRAINT unique_data_hora UNIQUE (data, hora);

-- 4️⃣ Função RPC para criar agendamento com user_id
CREATE OR REPLACE FUNCTION public.create_agendamento_v2(
  p_user_id uuid,
  p_nome text,
  p_telefone text,
  p_servico text,
  p_service_label text,
  p_price numeric,
  p_data date,
  p_hora text,
  p_observacao text
)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.agendamentos (
    user_id, nome, telefone, servico, service_label, price, data, hora, observacao, status, created_at
  ) VALUES (
    p_user_id, p_nome, p_telefone, p_servico, p_service_label, p_price, p_data, p_hora, p_observacao, 'confirmado', now()
  );
  RETURN 'ok';
EXCEPTION WHEN unique_violation THEN
  RETURN 'conflict';
WHEN OTHERS THEN
  RETURN 'error: ' || SQLERRM;
END;
$$;

-- 5️⃣ Função RPC para criar agendamento SEM user_id (compatibilidade)
CREATE OR REPLACE FUNCTION public.create_agendamento(
  p_nome text,
  p_telefone text,
  p_servico text,
  p_data date,
  p_hora text,
  p_observacao text
)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.agendamentos (nome, telefone, servico, data, hora, observacao, status, created_at)
  VALUES (p_nome, p_telefone, p_servico, p_data, p_hora, p_observacao, 'confirmado', now());
  RETURN 'ok';
EXCEPTION WHEN unique_violation THEN
  RETURN 'conflict';
WHEN OTHERS THEN
  RETURN 'error: ' || SQLERRM;
END;
$$;

-- ✅ FIM! Se não tiver erros vermelhos, está pronto!
