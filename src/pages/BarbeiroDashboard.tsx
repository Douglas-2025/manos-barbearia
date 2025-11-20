import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Interface do agendamento
interface Agendamento {
  id?: string | number;
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

// Interface de usuário para CRUD
interface User {
  user_id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

// Painel do barbeiro agora usa autenticação via Supabase
const BarbeiroDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Estados para CRUD de usuários
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'usuarios'>('agendamentos');

  // Ao montar, checa usuário logado e status de admin
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await checkIsAdmin(); // Chamada sem ID
        await fetchHoje();
        await fetchUsers(); // Carregar usuários ao iniciar
      }
    };
    init();
    // Listen auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      supabase.auth.getUser().then(res => {
        const u = res.data?.user || null;
        setUser(u);
        if (u) {
          checkIsAdmin(); // Chamada sem ID
          fetchUsers();
        } else {
          setIsAdmin(false);
        }
      });
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // NOVO: Usa a função RPC is_admin() para verificar o status de admin
  const checkIsAdmin = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error || data === null) {
        // Se houver erro ou o resultado for null, assume que não é admin
        setIsAdmin(false);
      } else {
        // O RPC retorna um booleano
        setIsAdmin(data as boolean);
      }
    } catch (e) {
      console.error('Erro ao verificar status de admin:', e);
      setIsAdmin(false);
    }
  };

  const fetchHoje = async (forceRefresh = false) => {
    if (forceRefresh) setIsSyncing(true);
    setLoading(true);
    setError(null);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      // Antes de buscar, checar cache local (válido por 24h)
      const cacheKey = `barber_agendamentos_${hoje}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached && !forceRefresh) {
        try {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          if (parsed.timestamp && now - parsed.timestamp < 24 * 60 * 60 * 1000 && Array.isArray(parsed.data)) {
            setAgendamentos(parsed.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // seguir para buscar do servidor
        }
      }

      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', hoje)
        .order('hora', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        setError('Não foi possível buscar agendamentos. Verifique a tabela `agendamentos`.');
        setAgendamentos([]);
      } else {
        setAgendamentos(data || []);
        // salvar em cache local com timestamp
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data || [] }));
        } catch (e) {
          console.warn('Falha ao salvar cache local:', e);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erro inesperado ao buscar agendamentos.');
    } finally {
      setLoading(false);
      if (forceRefresh) setIsSyncing(false);
    }
  };

  const saveLocalCacheForDate = (date: string, dataToSave: Agendamento[]) => {
    const cacheKey = `barber_agendamentos_${date}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: dataToSave }));
    } catch (e) {
      console.warn('Falha ao salvar cache local:', e);
    }
  };

  const handleChangeStatusLocal = async (item: Agendamento, newStatus: string) => {
    // Somente admins podem alterar status
    if (!isAdmin) return;
    // Atualiza localmente e no cache
    const updated = agendamentos.map(a => (a.id === item.id ? { ...a, status: newStatus } : a));
    setAgendamentos(updated);
    const hoje = new Date().toISOString().split('T')[0];
    saveLocalCacheForDate(hoje, updated);

    // Atualiza no Supabase (se possível)
    try {
      if (item.id) {
        const { error } = await supabase.from('agendamentos').update({ status: newStatus }).eq('id', item.id);
        if (error) console.warn('Não foi possível atualizar status no Supabase:', error.message || error);
      }
    } catch (e) {
      console.warn('Erro ao atualizar status no Supabase:', e);
    }

    // Forçar refresh do servidor (invalida cache) para sincronizar estado
    try {
      await fetchHoje(true);
    } catch (e) {
      console.warn('Falha ao forçar sincronização após mudança de status:', e);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Erro ao deslogar:', e);
    } finally {
      setUser(null);
      setIsAdmin(false);
      setAgendamentos([]);
      setUsers([]);
    }
  };

  // Função para buscar usuários (CRUD)
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.rpc('list_users');
      if (error) {
        console.error('Erro ao buscar usuários:', error);
        setUsers([]);
      } else {
        setUsers((data as User[]) || []);
      }
    } catch (e) {
      console.error('Erro inesperado ao buscar usuários:', e);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Função para alternar admin de um usuário
  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.rpc('update_user_is_admin', {
        p_user_id: userId,
        p_is_admin: !currentStatus
      });
      if (error) {
        console.error('Erro ao atualizar status admin:', error);
        alert('Erro ao atualizar status do usuário.');
      } else {
        // Recarregar lista
        await fetchUsers();
      }
    } catch (e) {
      console.error('Erro ao alterar status admin:', e);
      alert('Erro ao alterar status do usuário.');
    }
  };

  // Função para deletar um usuário
  const deleteUser = async (userId: string, email: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o usuário ${email}? Esta ação não pode ser desfeita.`)) {
      try {
        const { error } = await supabase.rpc('delete_user', { p_user_id: userId });
        if (error) {
          console.error('Erro ao deletar usuário:', error);
          alert('Erro ao deletar usuário.');
        } else {
          // Recarregar lista
          await fetchUsers();
        }
      } catch (e) {
        console.error('Erro ao deletar usuário:', e);
        alert('Erro ao deletar usuário.');
      }
    }
  };

  // Se usuário não logado, exibe botão de login via Google
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md bg-[#0f1724] text-white rounded-2xl p-6 border border-blue-700/40">
          <h2 className="text-2xl font-bold mb-4">Painel do Barbeiro</h2>
          <p className="text-sm text-gray-300 mb-4">Faça login com sua conta Google para acessar o painel.</p>
          <div className="space-y-4">
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button
              onClick={async () => await supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="w-full bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Entrar com Google
            </button>
            <p className="text-xs text-gray-500 mt-2">Atenção: apenas usuários adicionados em \`public.admins\` terão acesso ao painel.</p>
          </div>
        </div>
      </div>
    );
  }

  // Se usuário autenticado mas não admin
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md bg-[#0f1724] text-white rounded-2xl p-6 border border-blue-700/40">
          <h2 className="text-2xl font-bold mb-4">Acesso negado</h2>
          <p className="text-sm text-gray-300 mb-4">Sua conta não tem permissão para acessar este painel.</p>
          <div className="flex gap-3">
            <button onClick={async () => { await supabase.auth.signOut(); setUser(null); }} className="bg-red-600 px-4 py-2 rounded-full">Sair</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Painel do Barbeiro v2.0</h1>
            <p className="text-sm text-gray-400 mt-1">Bem-vindo, {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchHoje(true)}
              disabled={isSyncing || loading || activeTab !== 'agendamentos'}
              className={`px-3 py-2 rounded ${isSyncing || loading ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSyncing ? 'Sincronizando...' : (loading ? 'Carregando...' : 'Atualizar')}
            </button>
            <button onClick={handleSignOut} className="bg-red-700 px-3 py-2 rounded hover:bg-red-800">Sair</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('agendamentos')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'agendamentos'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📅 Agendamentos de Hoje
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`py-3 px-4 font-semibold border-b-2 transition ${
              activeTab === 'usuarios'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            👥 Gerenciar Usuários
          </button>
        </div>

        {/* TAB 1: AGENDAMENTOS */}
        {activeTab === 'agendamentos' && (
          <div>
            <div className="mb-4 text-sm text-gray-300">Total: <strong>{agendamentos.length}</strong></div>

            {loading && <div className="text-gray-400">Carregando...</div>}
            {error && <div className="text-red-400 mb-4">{error}</div>}

            <div className="space-y-3">
              {agendamentos.length === 0 && !loading ? (
                <div className="p-4 bg-[#071025] border border-gray-800 rounded-2xl">Nenhum agendamento para hoje.</div>
              ) : (
                agendamentos.map((a: Agendamento) => (
                  <div key={`${a.id || a.created_at}-${a.hora}`} className="p-4 bg-[#071025] border border-gray-800 rounded-2xl flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-300">{a.hora} — <span className="font-semibold text-white">{a.nome}</span></div>
                      <div className="text-xs text-gray-400">Serviço: {a.service_label || a.servico} • R$ {Number(a.price || 0).toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Tel: {a.telefone}</div>
                      {a.observacao && <div className="mt-2 text-xs text-gray-300">Obs: {a.observacao}</div>}
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <div>Horario: <span className="font-semibold text-white">{a.hora}</span></div>
                      {/* MELHORIA: Destaque de status */}
                      <div className={`mt-2 font-semibold ${a.status === 'atendido' ? 'text-green-400' : a.status === 'cancelado' ? 'text-red-400' : 'text-blue-400'}`}>Status: {a.status || 'confirmado'}</div>
                      <div className="mt-3 flex flex-col items-end gap-2">
                        {/* MELHORIA: Mostrar botões apenas se o status for diferente */}
                        {a.status !== 'atendido' && (
                          <button onClick={() => handleChangeStatusLocal(a, 'atendido')} className="bg-green-600 text-white px-3 py-1 rounded-full text-xs hover:bg-green-700">Marcar Atendido</button>
                        )}
                        {a.status !== 'cancelado' && (
                          <button onClick={() => handleChangeStatusLocal(a, 'cancelado')} className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-700">Cancelar</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GERENCIAR USUÁRIOS */}
        {activeTab === 'usuarios' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-300">Total de usuários: <strong>{users.length}</strong></div>
              <button
                onClick={() => fetchUsers()}
                disabled={usersLoading}
                className={`px-3 py-2 rounded text-sm ${usersLoading ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {usersLoading ? 'Carregando...' : 'Atualizar'}
              </button>
            </div>

            {usersLoading && <div className="text-gray-400">Carregando usuários...</div>}

            {users.length === 0 && !usersLoading ? (
              <div className="p-4 bg-[#071025] border border-gray-800 rounded-2xl">Nenhum usuário registrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-300">Email</th>
                      <th className="text-left p-3 text-gray-300">Admin</th>
                      <th className="text-left p-3 text-gray-300">Data de cadastro</th>
                      <th className="text-left p-3 text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: User) => (
                      <tr key={u.user_id} className="border-b border-gray-800 hover:bg-[#0f1a25] transition">
                        <td className="p-3 text-gray-200">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.is_admin ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                            {u.is_admin ? '✓ Admin' : 'Usuário'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => toggleAdminStatus(u.user_id, u.is_admin)}
                            className={`px-3 py-1 rounded text-xs font-semibold ${u.is_admin ? 'bg-yellow-700 hover:bg-yellow-800 text-yellow-200' : 'bg-green-700 hover:bg-green-800 text-green-200'}`}
                          >
                            {u.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                          </button>
                          <button
                            onClick={() => deleteUser(u.user_id, u.email)}
                            className="px-3 py-1 rounded text-xs font-semibold bg-red-700 hover:bg-red-800 text-red-200"
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarbeiroDashboard;
