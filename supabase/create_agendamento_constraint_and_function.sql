-- Cria constraint única para evitar agendamentos duplicados no mesmo dia/hora
ALTER TABLE IF EXISTS public.agendamentos
  ADD CONSTRAINT IF NOT EXISTS unique_data_hora UNIQUE (data, hora);

-- Função atômica para criar agendamento: retorna 'ok' se inseriu, 'conflict' se já existe
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
END;
$$;

-- Observação: execute esse arquivo via Supabase SQL Editor ou psql conectado ao seu banco.
