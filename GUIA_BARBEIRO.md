# Guia rápido: Painel local do Barbeiro

Este painel é uma implementação simples para uso local/teste. Ele fornece um login local (usuário/senha definidos no código) e uma tela que lista os agendamentos do dia provenientes da tabela `agendamentos` no Supabase.

ATENÇÃO: este método NÃO é seguro para produção. Para produção, implemente autenticação server-side (por exemplo, via Supabase, NextAuth ou outro provedor seguro) e camadas de autorização.

Credenciais padrão (apenas local):
- usuário: `barbeiro`
- senha: `barbearia123`

Como usar:
1. Rode o projeto: `npm run dev`
2. No header, clique em `Painel Barbeiro` ou acesse `http://localhost:5173/barbeiro`.
3. Faça login com as credenciais acima.
4. Você verá os agendamentos do dia (busca pela coluna `data` igual a `YYYY-MM-DD` de hoje).

Se não aparecer nenhum agendamento, verifique:
- Se a tabela `agendamentos` existe no seu banco Supabase.
- Se os registros têm a coluna `data` preenchida no formato `YYYY-MM-DD`.
- Se o `supabaseAnonKey` em `src/lib/supabaseClient.ts` está correto e tem permissão para leitura nessa tabela.

Cache local (24h):
- O painel salva uma cópia dos agendamentos do dia no `localStorage` por até 24 horas. Se houver cache válido, ele será exibido sem consultar o Supabase.
- Ao marcar um agendamento como "Atendido" ou "Cancelado" no painel, a alteração é aplicada localmente e salva no cache. O painel também tenta atualizar o registro no Supabase, mas a falha nessa atualização não impede a ação local.
 - Agora, após qualquer ação (marcar atendido/cancelar) o painel força uma sincronização com o Supabase e invalida o cache local, garantindo que o estado do servidor seja obtido imediatamente.

Para melhorar/produzir este painel em produção:
- Mova as credenciais para um sistema seguro.
- Proteja a rota via middleware server-side.
- Adicione ações (confirmar, cancelar, marcar como atendido) usando RPCs e validações no banco.
