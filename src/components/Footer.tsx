
import React from 'react';
import { Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          {/* Logo and info */}
          <div className="mb-8 md:mb-0 max-w-sm">
            <p className="text-gray-400 mb-4">
              <img src="/img/LOGO2SEMFUNDO.jpg" alt="logo" width={220}/>  
            </p>
          </div>
          
          {/* Quick links */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-white font-bold mb-4 text-lg">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Galeria
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <Link to="/agendar" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Agendamento
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-white font-bold mb-4 text-lg">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Corte Social</li>
              <li className="text-gray-400">Barba Desenhada + Navalhada</li>
              <li className="text-gray-400">Combo: Corte + Barba</li>
              <li className="text-gray-400">Corte Infantil</li>
              <li className="text-gray-400">Barba Lenhador + Estilizada</li>
              <li className="text-gray-400">Selagem Capilar</li>
            </ul>
          </div>
          {/* Services */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-white font-bold mb-4 text-lg">{<Scissors />}</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Platinado + Descoloração</li>
              <li className="text-gray-400">Hidratação Capilar</li>
              <li className="text-gray-400">Design de Corte + Corte na Tesoura</li>
              <li className="text-gray-400">Corte Degradê + Fade</li>
              <li className="text-gray-400">Low fade</li>
              <li className="text-gray-400">Corte artístico</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <strong className="text-white">Endereço:</strong> R. Geraldo Siqueira, 2680 - Caladinho, Porto Velho - RO
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Telefone:</strong> (69) 9 9235-3561
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Email:</strong> manosbarbearia1@gmail.com
              </li>
              <li className="text-gray-400">
                <strong className="text-white">Horário:</strong> Seg-Sáb: 09h às 12h e 14h às 20h
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Mano's Barbearia. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm">
            Desenvolvido por <a href="https://wa.me/5569992476425" className="text-blue-500">Douglas Júlio</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
