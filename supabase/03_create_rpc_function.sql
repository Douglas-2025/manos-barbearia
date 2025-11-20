-- ✅ PASSO 3: Crie a função RPC para agendamentos com user_id
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
