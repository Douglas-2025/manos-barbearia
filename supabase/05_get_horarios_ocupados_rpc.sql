-- RPC para retornar apenas horários ocupados de um dia (retorna apenas a coluna 'hora')
-- Cole e execute no Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.get_horarios_ocupados(p_data date)
RETURNS TABLE(hora text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT hora FROM public.agendamentos
  WHERE data = p_data AND status = 'confirmado';
$$;

-- Observação: SECURITY DEFINER faz a função rodar com privilégios do criador da função,
-- então só crie essa função em contas seguras (o próprio projeto no dashboard já é seguro).
-- Depois de criar, qualquer cliente pode chamar a RPC via supabase.rpc('get_horarios_ocupados', { p_data: '2025-11-19' })
-- e receberá apenas os horários ocupados sem expor dados de clientes.
