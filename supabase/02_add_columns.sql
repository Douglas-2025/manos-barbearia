-- ✅ PASSO 2: Adicione as colunas necessárias na tabela agendamentos
ALTER TABLE IF EXISTS public.agendamentos
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS price numeric(10,2),
  ADD COLUMN IF NOT EXISTS service_label text;
