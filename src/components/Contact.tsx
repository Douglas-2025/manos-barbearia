
import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Entre em <span className="text-blue-500">Contato</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estamos disponíveis para responder suas dúvidas, receber sugestões
            ou agendar seu horário pelos canais abaixo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg text-blue-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Localização</h4>
                    <p className="text-gray-400"> R. Geraldo Siqueira, 2680 - Caladinho</p>
                    <p className="text-gray-400">Porto Velho - RO</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg text-blue-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Contato</h4>
                    <p className="text-gray-400">+55 (69) 9 9235-3561</p>
                    <p className="text-gray-400">manosbarbearia1@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-800 rounded-lg text-blue-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Horário de Funcionamento</h4>
                    <p className="text-gray-400">Segunda - Sábado: 09h às 12h e 14h às 20h</p>
                    <p className="text-gray-400">|</p>
                    <p className="text-gray-400">Domingo e Feriados: Fechado</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-8">
                  <a href="https://www.instagram.com/manosbarbeariaoficial/" target="_blank" rel="noopener noreferrer" 
                    className="p-3 bg-gray-800 rounded-full text-blue-500 hover:bg-blue-500 hover:text-gray-900 transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.facebook.com/manosbarbeariaoficial/" target="_blank" rel="noopener noreferrer" 
                    className="p-3 bg-gray-800 rounded-full text-blue-500 hover:bg-blue-500 hover:text-gray-900 transition-colors">
                    <Facebook size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-bold mb-6">Agende seu Horário</h3>
              <p className="text-gray-400 mb-6">
                Clique no botão abaixo para agendar seu horário em nosso sistema online
                ou entre em contato diretamente pelo WhatsApp.
              </p>
              
              <div className="space-y-4">
                <Link 
                  to="/agendar" 
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-500 transition-colors w-full block text-center"
                >
                  Agendar Online
                </Link>
                
                <a 
                  href="https://wa.me/5569992353561" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent border border-blue-600 text-blue-500 py-3 px-8 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-colors w-full block text-center"
                >
                  WhatsApp
                </a>
              </div>
              
              <div className="w-full mt-8 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.9189522405254!2d-63.887582099999996!3d-8.793685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92325c6760419823%3A0x9a85238a7c66a55d!2sR.%20Geraldo%20Siqueira%2C%202680%20-%20Caladinho%2C%20Porto%20Velho%20-%20RO%2C%2076808-270!5e0!3m2!1spt-BR!2sbr!4v1763262995717!5m2!1spt-BR!2sbr"
                  className="w-full h-64 md:h-80 lg:h-96 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Manos Barbearia"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
