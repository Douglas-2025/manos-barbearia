-- ============================================
-- SETUP ZERO: Criar TUDO do zero
-- ============================================
-- Cole TUDO isso de uma vez no Supabase SQL Editor

-- 1️⃣ Criar tabela PROFILES (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- 2️⃣ Criar tabela AGENDAMENTOS (do ZERO com todas as colunas)
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id),
  nome text NOT NULL,
  telefone text NOT NULL,
  servico text NOT NULL,
  service_label text,
  price numeric(10,2),
  data date NOT NULL,
  hora text NOT NULL,
  observacao text,
  status text DEFAULT 'confirmado',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_data_hora UNIQUE (data, hora)
);

-- 3️⃣ Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON public.agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);

-- 4️⃣ Habilitar RLS (Row Level Security) - opcional, mas recomendado
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5️⃣ Políticas RLS - qualquer um pode inserir/ler agendamentos (público)
CREATE POLICY "Agendamentos são públicos" ON public.agendamentos
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode agendar" ON public.agendamentos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver seus perfis" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR true);

-- 6️⃣ Função RPC para criar agendamento COM user_id
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

-- 7️⃣ Função RPC para criar agendamento SEM user_id (público)
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
  INSERT INTO public.agendamentos (
    nome, telefone, servico, data, hora, observacao, status, created_at
  ) VALUES (
    p_nome, p_telefone, p_servico, p_data, p_hora, p_observacao, 'confirmado', now()
  );
  RETURN 'ok';
EXCEPTION WHEN unique_violation THEN
  RETURN 'conflict';
WHEN OTHERS THEN
  RETURN 'error: ' || SQLERRM;
END;
$$;

-- ✅ FIM! Se não tiver erros vermelhos, está tudo pronto!
-- Agora você pode:
-- 1. Acessar http://localhost:8080/test para testar inserções
-- 2. Ver os dados em Supabase → Table Editor → agendamentos
