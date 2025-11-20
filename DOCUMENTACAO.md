# Documentação de Configuração

Este documento explica como configurar a conexão com o Supabase e como integrar notificações via WhatsApp no seu projeto.

## 1. Conexão com o Supabase

Para que seu aplicativo se comunique com o Supabase, você precisa das credenciais do seu projeto.

### Passos:

1.  **Crie um projeto no Supabase:**
    *   Acesse [supabase.com](https://supabase.com) e crie uma nova conta ou faça login.
    *   Crie um novo projeto.

2.  **Obtenha suas credenciais:**
    *   No painel do seu projeto, vá para **Project Settings** (ícone de engrenagem) > **API**.
    *   Você encontrará duas informações essenciais:
        *   **Project URL**: A URL do seu projeto.
        *   **Project API Keys** > `anon` `public`: A chave pública anônima.

3.  **Configure as variáveis de ambiente:**
    *   Na raiz do seu projeto, crie um arquivo chamado `.env` (se ele ainda não existir).
    *   Adicione as seguintes linhas a ele, substituindo pelos valores que você copiou:

    ```env
    VITE_SUPABASE_URL=SUA_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
    ```

4.  **Utilize as credenciais no código:**
    *   O arquivo `src/lib/supabaseClient.ts` já está configurado para usar essas variáveis de ambiente. Ele deve se parecer com isto:

    ```typescript
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    ```

Com isso, seu projeto já estará conectado ao Supabase.

## 2. Notificações via WhatsApp

O Supabase não envia notificações para o WhatsApp diretamente. Para isso, você precisará de um serviço de terceiros, como o **Twilio**.

A ideia geral é criar uma função no Supabase (Edge Function) que é acionada sempre que um novo agendamento é criado no banco de dados. Essa função, por sua vez, usará a API do Twilio para enviar a mensagem.

### Passos:

1.  **Crie uma conta no Twilio:**
    *   Acesse [twilio.com](https://twilio.com) e crie uma conta.
    *   Durante a configuração, obtenha um número de telefone do Twilio que possa enviar mensagens de WhatsApp.
    *   Anote seu **Account SID** and **Auth Token**.

2.  **Configure o Sandbox do Twilio para WhatsApp:**
    *   Para testar, o Twilio oferece um ambiente de "sandbox". Você precisará enviar uma mensagem do seu WhatsApp para o número do Twilio para ativar a comunicação. Siga as instruções no painel do Twilio.

3.  **Crie uma Supabase Edge Function:**
    *   Instale a CLI do Supabase: `npm install supabase --save-dev`
    *   Inicie o Supabase localmente: `npx supabase init`
    *   Crie uma nova função: `npx supabase functions new send-whatsapp-notification`

4.  **Escreva o código da função:**
    *   Abra o arquivo `supabase/functions/send-whatsapp-notification/index.ts`.
    *   Este é um exemplo de como o código da função ficaria:

    ```typescript
    import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

    // Importe a biblioteca do Twilio ou use fetch diretamente
    // Lembre-se de adicionar suas credenciais do Twilio como segredos no Supabase
    // npx supabase secrets set TWILIO_ACCOUNT_SID="SEU_SID"
    // npx supabase secrets set TWILIO_AUTH_TOKEN="SEU_TOKEN"
    // npx supabase secrets set TWILIO_PHONE_NUMBER="NUMERO_TWILIO"

    serve(async (req) => {
      try {
        const { record } = await req.json();

        // Informações do agendamento
        const clientName = record.name;
        const appointmentDate = new Date(record.date).toLocaleDateString();
        const clientPhoneNumber = record.phone; // Certifique-se de que o número está no formato E.164 (+5511999999999)

        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

        const message = `Olá, ${clientName}! Seu agendamento para ${appointmentDate} foi confirmado.`;

        // Monta a requisição para a API do Twilio
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: `whatsapp:${clientPhoneNumber}`,
            From: `whatsapp:${twilioPhoneNumber}`,
            Body: message,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao enviar mensagem: ${await response.text()}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    });
    ```

5.  **Crie um gatilho (Trigger) no Banco de Dados:**
    *   No seu painel do Supabase, vá para **Database** > **Triggers**.
    *   Crie um novo gatilho na sua tabela de agendamentos (`appointments` ou similar).
    *   Configure o gatilho para ser acionado `AFTER INSERT` (depois que um novo registro for inserido).
    *   A função do gatilho chamará a Edge Function que você criou.

    ```sql
    -- Exemplo de como criar a função que chama o webhook (Edge Function)
    create or replace function notify_on_new_appointment()
    returns trigger as $$
    begin
      perform net.http_post(
        url:='URL_DA_SUA_EDGE_FUNCTION',
        body:=json_build_object('record', new)::jsonb
      );
      return new;
    end;
    $$ language plpgsql;

    -- Cria o gatilho na tabela de agendamentos
    create trigger on_new_appointment_trigger
    after insert on public.appointments -- Substitua "appointments" pelo nome da sua tabela
    for each row
    execute function notify_on_new_appointment();
    ```

Este é um guia completo. A parte do Twilio e das Edge Functions é mais avançada, mas este é o caminho correto para implementar essa funcionalidade.
