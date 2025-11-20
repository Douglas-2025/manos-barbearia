-- Cria tabela de perfis vinculada ao auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Adiciona colunas em agendamentos para vincular usuário e guardar preço/label do serviço
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS price numeric(10,2),
  ADD COLUMN IF NOT EXISTS service_label text;

-- Garante constraint única em data/hora (se não existir)
ALTER TABLE IF EXISTS public.agendamentos
  ADD CONSTRAINT IF NOT EXISTS unique_data_hora UNIQUE (data, hora);

-- Função atômica para criar agendamento com user_id e price
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
END;
$$;

-- Observação: rode este arquivo via Supabase SQL Editor para aplicar alterações ao banco.
