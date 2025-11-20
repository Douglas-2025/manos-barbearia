import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { nome, telefone, servico, data, hora, observacao } = await req.json();

    if (!nome || !telefone || !servico || !data || !hora) {
      return new Response(
        JSON.stringify({ error: "Dados incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Formatar mensagem para WhatsApp
    const mensagem = `*NOVO AGENDAMENTO — Mano's Barbearia* 💈🔥

*Cliente:* ${nome}
*Telefone:* ${telefone}
*Serviço:* ${servico}
*Data:* ${data}
*Horário:* ${hora}
*Observações:* ${observacao || "Nenhuma"}

_Confirmação automática do sistema_`;

    console.log("Agendamento recebido:", { nome, telefone, servico, data, hora });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Agendamento processado com sucesso",
        data: { nome, telefone, servico, data, hora, observacao }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar agendamento" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
