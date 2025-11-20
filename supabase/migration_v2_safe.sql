-- ============================================
-- MIGRAÇÃO SEGURA: Profiles + Agendamentos v2
-- ============================================
-- Execute cada bloco separadamente no SQL Editor

-- BLOCO 1: Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- BLOCO 2: Verificar estrutura de agendamentos
-- (execute para ver as colunas existentes)
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name='agendamentos' AND table_schema='public';

-- BLOCO 3: Adicionar colunas de data/hora se não existirem (tipo DATE e TEXT)
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS data date,
  ADD COLUMN IF NOT EXISTS hora text;

-- BLOCO 4: Adicionar colunas de usuário e preço
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS price numeric(10,2),
  ADD COLUMN IF NOT EXISTS service_label text;

-- BLOCO 5: Adicionar coluna de status se não existir
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmado';

-- BLOCO 6: Adicionar coluna de criação se não existir
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- BLOCO 7: Remover constraint antiga (se existir)
ALTER TABLE IF EXISTS public.agendamentos
  DROP CONSTRAINT IF EXISTS unique_data_hora;

-- BLOCO 8: Adicionar nova constraint de unicidade
ALTER TABLE IF EXISTS public.agendamentos
  ADD CONSTRAINT unique_data_hora UNIQUE (data, hora);

-- BLOCO 9: Criar ou atualizar função RPC para agendamentos
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

-- BLOCO 10: Função para agendamentos SEM user_id (compatibilidade)
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
