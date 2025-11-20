import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Agendamento {
  id?: string;
  user_id?: string;
  nome: string;
  telefone: string;
  servico: string;
  service_label?: string;
  price?: number;
  data: string;
  hora: string;
  observacao?: string;
  status?: string;
  created_at?: string;
}

export const TestAgendamento: React.FC = () => {
  // Proteção: permitir esta página apenas quando a variável de ambiente estiver ativada
  const ENABLE_TEST = import.meta.env.VITE_ENABLE_TEST_PAGES === 'true';
  if (!ENABLE_TEST) return null;
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Carregar agendamentos do banco
  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        setMensagem(`❌ Erro ao carregar: ${error.message}`);
        console.error('Erro:', error);
      } else {
        setAgendamentos(data || []);
        setMensagem(`✅ Carregou ${data?.length || 0} agendamentos`);
      }
    } catch (err) {
      setMensagem(`❌ Erro: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Inserir agendamento de teste
  const inserirTeste = async () => {
    setLoading(true);
    try {
      const dataTeste = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([
          {
            nome: 'Teste ' + new Date().getTime(),
            telefone: '5569999999999',
            servico: 'corte',
            service_label: 'Corte de Cabelo',
            price: 35.00,
            data: dataTeste,
            hora: '14:00',
            observacao: 'Teste automático',
            status: 'confirmado',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        setMensagem(`❌ Erro ao inserir: ${error.message}`);
        console.error('Erro:', error);
      } else {
        setMensagem(`✅ Agendamento inserido com sucesso!`);
        carregarAgendamentos(); // Recarrega a lista
      }
    } catch (err) {
      setMensagem(`❌ Erro: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Limpar todos os agendamentos (apenas para teste!)
  const limparTudo = async () => {
    if (!window.confirm('⚠️ Tem certeza? Isso vai deletar TODOS os agendamentos de teste!')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .like('nome', 'Teste%'); // Deleta apenas que começam com "Teste"

      if (error) {
        setMensagem(`❌ Erro ao deletar: ${error.message}`);
      } else {
        setMensagem(`✅ Agendamentos de teste deletados!`);
        carregarAgendamentos();
      }
    } catch (err) {
      setMensagem(`❌ Erro: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-500">🧪 Teste de Agendamentos</h1>

        {/* Status */}
        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg mb-6">
          <p className="text-lg font-semibold">{mensagem}</p>
        </div>

        {/* Botões */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={carregarAgendamentos}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            🔄 Recarregar
          </button>
          <button
            onClick={inserirTeste}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            ➕ Inserir Teste
          </button>
          <button
            onClick={limparTudo}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            🗑️ Limpar Testes
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-[#111] rounded-lg border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-blue-900/50 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Telefone</th>
                <th className="px-4 py-3 text-left">Serviço</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Hora</th>
                <th className="px-4 py-3 text-left">Preço</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                    Nenhum agendamento ainda
                  </td>
                </tr>
              ) : (
                agendamentos.map((agendamento, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-900/50">
                    <td className="px-4 py-3">{agendamento.nome}</td>
                    <td className="px-4 py-3">{agendamento.telefone}</td>
                    <td className="px-4 py-3">{agendamento.service_label || agendamento.servico}</td>
                    <td className="px-4 py-3">{agendamento.data}</td>
                    <td className="px-4 py-3">{agendamento.hora}</td>
                    <td className="px-4 py-3">R$ {agendamento.price?.toFixed(2) || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        agendamento.status === 'confirmado' ? 'bg-green-900/50 text-green-300' : 
                        agendamento.status === 'cancelado' ? 'bg-red-900/50 text-red-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {agendamento.status || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {agendamento.created_at ? new Date(agendamento.created_at).toLocaleString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="mt-8 bg-gray-900/50 border border-gray-700 p-6 rounded-lg text-sm text-gray-300">
          <p className="mb-2"><strong>📝 Como usar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clique em <strong>"➕ Inserir Teste"</strong> para criar um agendamento de teste</li>
            <li>Os dados serão salvos no Supabase automaticamente</li>
            <li>Clique em <strong>"🔄 Recarregar"</strong> para ver os dados atualizados</li>
            <li>Você pode deletar os testes com <strong>"🗑️ Limpar Testes"</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestAgendamento;
