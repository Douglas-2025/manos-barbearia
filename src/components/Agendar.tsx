import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar, Clock, User, Phone, Scissors } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  nome: string;
  telefone: string;
  servico: string;
  data: string;
  hora: string;
  observacao: string;
}

interface ServiceItem {
  value: string;
  label: string;
  price: number;
}

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

export const Agendar: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    servico: '',
    data: '',
    hora: '',
    observacao: ''
  });

  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: string }>({ texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [whatsUrl, setWhatsUrl] = useState<string>('');

  const horarios = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

  const servicos: ServiceItem[] = [
    { value: 'corte', label: 'Corte de Cabelo', price: 35.00 },
    { value: 'barba', label: 'Barba', price: 25.00 },
    { value: 'completo', label: 'Corte + Barba', price: 55.00 },
    { value: 'coloracao', label: 'Coloração', price: 120.00 },
    { value: 'outro', label: 'Outro serviço', price: 0.00 }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchHorariosOcupados = React.useCallback(async () => {
    if (!formData.data) return;
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('hora')
        .eq('data', formData.data)
        .eq('status', 'confirmado');

      if (error) {
        console.log('Tabela não existe ou sem dados - iniciando com horários livres');
        setHorariosOcupados([]);
      } else {
        const horas = (data as Array<{hora: string}>).map(item => item.hora) || [];
        setHorariosOcupados(horas);
      }
    } catch (error) {
      console.log('Erro ao buscar horários, continuando...');
      setHorariosOcupados([]);
    }
  }, [formData.data]);

  useEffect(() => {
    if (formData.data) fetchHorariosOcupados();
  }, [formData.data, fetchHorariosOcupados]);

  const verificarDisponibilidade = (hora: string) => {
    return !horariosOcupados.includes(hora);
  };

  const formatarData = (dataString: string) => {
    const [ano, mes, dia] = dataString.split('-').map(Number);
    const dataLocal = new Date(ano, mes - 1, dia);
    return dataLocal.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const enviarWhatsApp = () => {
    const nomeServico = servicos.find(s => s.value === formData.servico)?.label || formData.servico;
    const mensagemTexto = `*NOVO AGENDAMENTO — Mano's Barbearia* 💈🔥

*Cliente:* ${formData.nome}
*Telefone:* ${formData.telefone}
*Serviço:* ${nomeServico}
*Data:* ${formatarData(formData.data)}
*Horário:* ${formData.hora}
*Observações:* ${formData.observacao || 'Nenhuma'}`;

    const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER || '5569992353561';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemTexto)}`;
    return url;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    try {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Limpa a URL do WhatsApp caso o usuário altere qualquer campo
      if (whatsUrl) setWhatsUrl('');
    } catch (err) {
      console.error('Erro no handleChange:', err);
      setMensagem({ texto: 'Erro ao atualizar o campo. Tente novamente.', tipo: 'erro' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.nome || !formData.telefone || !formData.servico || !formData.data || !formData.hora) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      if (!verificarDisponibilidade(formData.hora)) {
        throw new Error('Este horário já foi reservado. Escolha outro.');
      }

      // Verifica se o usuário está logado e pega o user.id
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user || null;
      if (!user) {
        throw new Error('Você precisa estar logado para agendar. Faça login com Google.');
      }

      // Encontra preço do serviço selecionado
      const servicoSelecionado = servicos.find(s => s.value === formData.servico) as ServiceItem | undefined;
      const price = servicoSelecionado?.price ?? 0;
      const service_label = servicoSelecionado?.label ?? formData.servico;

      // Primeiro, tentamos usar a função RPC atômica (create_agendamento_v2)
      let rpcResult: unknown = null;
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_agendamento_v2', {
          p_user_id: user.id,
          p_nome: formData.nome,
          p_telefone: formData.telefone,
          p_servico: formData.servico,
          p_service_label: service_label,
          p_price: price,
          p_data: formData.data,
          p_hora: formData.hora,
          p_observacao: formData.observacao
        });

        if (rpcError) {
          console.log('RPC create_agendamento_v2 falhou ou não existe:', rpcError.message || rpcError);
        } else {
          rpcResult = rpcData;
          const result = Array.isArray(rpcData) ? rpcData[0] : rpcData;
          if (result === 'conflict') {
            throw new Error('Este horário já foi reservado. Escolha outro.');
          }
        }
      } catch (rpcErr) {
        console.log('Erro ao chamar RPC (continuando com fallback):', rpcErr);
      }

      // Fallback: se RPC não criou, tentamos insert direto (com price e user_id)
      if (!rpcResult) {
        const { error: insertError } = await supabase.from('agendamentos').insert([
          {
            user_id: user.id,
            nome: formData.nome,
            telefone: formData.telefone,
            servico: formData.servico,
            service_label: service_label,
            price: price,
            data: formData.data,
            hora: formData.hora,
            observacao: formData.observacao,
            status: 'confirmado',
            created_at: new Date().toISOString()
          }
        ]);

        if (insertError) {
          const msg = insertError.message || '';
          const details = insertError.details || '';
          if (msg.includes('duplicate') || details.includes('unique') || insertError.code === '23505') {
            throw new Error('Este horário já foi reservado. Escolha outro.');
          }
          console.log('Erro ao salvar:', insertError);
        }
      }

      // Mostrar mensagem de sucesso
      setMensagem({ texto: 'Agendamento confirmado! Abrindo WhatsApp...', tipo: 'sucesso' });
      toast({
        title: "Sucesso!",
        description: "Agendamento confirmado! Abrindo WhatsApp...",
      });

      // Atualizar horários ocupados localmente para evitar reuso imediato
      setHorariosOcupados(prev => [...prev, formData.hora]);

      // Preparar URL do WhatsApp (não abrir automaticamente)
      try {
        const url = enviarWhatsApp();
        setWhatsUrl(url);
      } catch (err) {
        console.log('Erro ao preparar WhatsApp URL', err);
      }

      // Limpar formulário mantendo o botão/link do Whats
      setTimeout(() => {
        setFormData({ nome: '', telefone: '', servico: '', data: '', hora: '', observacao: '' });
      }, 800);

    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Erro inesperado.';
      setMensagem({ texto: mensagemErro, tipo: 'erro' });
      toast({
        variant: "destructive",
        title: "Erro",
        description: mensagemErro,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-[#111] text-white rounded-2xl shadow-2xl border border-blue-700/40 overflow-hidden">

        <div className="p-6 sm:p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-center tracking-wide">
            Mano´s <span className="text-blue-500">Barbearia</span>
          </h2>

          <h3 className="text-lg sm:text-xl text-gray-300 text-center mb-8 sm:mb-10">
            Agendamento <span className="text-blue-400">Online</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-5">
              <InputWithIcon icon={<User />} name="nome" value={formData.nome} onChange={handleChange} placeholder="Seu nome completo" required />

              <InputWithIcon icon={<Phone />} name="telefone" value={formData.telefone} onChange={handleChange} placeholder="WhatsApp (com DDD)" required />

              <SelectWithIcon
                icon={<Scissors />}
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                required
                options={[{ value: '', label: 'Selecione um serviço' }, ...servicos]}
              />

              <InputWithIcon
                icon={<Calendar />}
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <div className="space-y-3 mb-8">
                <label className="text-sm text-gray-400 flex items-center space-x-2">
                  <Clock size={18} className="text-blue-500" />
                  <span>Horário disponível</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {horarios.map(hora => (
                    <button
                      key={hora}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hora }))}
                      disabled={!verificarDisponibilidade(hora)}
                      className={`w-full py-2 sm:py-3 px-3 rounded-full font-semibold transition-all border text-xs sm:text-sm ${
                        formData.hora === hora ? 'border-blue-500 bg-blue-900 text-blue-200' : 'border-gray-700'
                      } ${
                        verificarDisponibilidade(hora)
                          ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] cursor-pointer'
                          : 'bg-red-900 opacity-50 cursor-not-allowed text-gray-400'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              {formData.data && formData.hora && formData.servico && (
                <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-2xl">
                  <h4 className="text-sm text-blue-300 font-semibold mb-3">Resumo do Agendamento</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-semibold">{formatarData(formData.data)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horário:</span>
                      <span className="font-semibold">{formData.hora}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Serviço:</span>
                      <span className="font-semibold">{servicos.find(s => s.value === formData.servico)?.label}</span>
                    </div>
                    <div className="border-t border-blue-700 pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Valor:</span>
                      <span className="font-bold text-blue-300">R$ {(servicos.find(s => s.value === formData.servico)?.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <textarea
                name="observacao"
                placeholder="Alguma observação? (opcional)"
                value={formData.observacao}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-700 bg-[#1a1a1a] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 sm:py-4 px-5 rounded-full font-bold text-base sm:text-lg transition-all mt-6 sm:mt-8 ${
                isLoading
                  ? 'bg-blue-800 cursor-not-allowed text-white opacity-70'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50'
              }`}
            >
              {isLoading ? 'Processando...' : '✂️ Agendar Horário'}
            </button>

            {mensagem.texto && (
              <div className={`p-4 rounded-2xl text-center font-semibold ${
                mensagem.tipo === 'sucesso'
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}>
                {mensagem.texto}
              </div>
            )}
            {whatsUrl && (
              <a
                href={whatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-bold"
              >
                Abrir WhatsApp para confirmar agendamento
              </a>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};


type InputWithIconProps = {
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
}

const InputWithIcon = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  min
}: InputWithIconProps) => (
  <div className="flex items-center space-x-3">
    <div className="text-blue-500">{icon}</div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      className="w-full px-4 py-3 rounded-full border border-gray-700 bg-[#1a1a1a] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  </div>
);


type SelectWithIconProps = {
  icon: React.ReactNode;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: Array<{ value: string; label: string; price?: number }>;
}

const SelectWithIcon = ({
  icon,
  name,
  value,
  onChange,
  required,
  options
}: SelectWithIconProps) => {
  const handleValueChange = (newValue: string) => {
    try {
      const safeValue = String(newValue ?? '');
      const syntheticEvent = {
        target: { name, value: safeValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    } catch (err) {
      console.error('Erro no SelectWithIcon.handleValueChange:', err);
    }
  };

  const placeholder = options.find((o: { value: string; }) => o.value === '')?.label || 'Selecione um serviço';
  const items = options.filter((o: { value: string; }) => o.value !== '');

  return (
    <div className="flex items-center space-x-3">
      <div className="text-blue-500">{icon}</div>
      <Select
        name={name}
        value={value}
        onValueChange={handleValueChange}
        required={required}
      >
        <SelectTrigger 
          className="w-full px-4 py-3 rounded-full border border-gray-700 bg-[#1a1a1a] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-auto text-left"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] text-white border-gray-700 shadow-lg rounded-2xl">
          {items.map((option: { value: string; label: string; price?: number }) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer text-base p-3 data-[highlighted]:bg-blue-900/50 rounded-md"
            >
              <span className="flex justify-between items-center gap-4">
                {option.label}
                <span className="text-blue-400 text-xs font-semibold ml-2">R$ {option.price?.toFixed(2) || '0.00'}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};


export default Agendar;

