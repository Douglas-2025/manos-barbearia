import React from 'react';
import { Award, User, Clock, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="relative flex justify-center items-center">
            {/* Efeito azul em glow atrás */}
            <div className="absolute w-[99%] h-[105%] bg-blue-600 opacity-40 blur-[30px] rounded-3xl z-0" />

            {/* Imagem principal */}
            <img
              src="/img/LOGO2SEMFUNDO.jpg"
              alt="Interior da Barbearia Mano's"
              loading="lazy"
              className="relative z-10 rounded-lg shadow-xl w-full max-w-xl h-auto lg:h-[650px] object-contain"
            />

            {/* Bloco de anos de experiência */}
            <div className="absolute -bottom-6 -right-6 bg-blue-600 p-6 rounded-lg shadow-xl z-20 text-center">
              <p className="text-white text-4xl font-bold">2+</p>
              <p className="text-white font-medium">Anos de Experiência</p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Mano's <span className="text-blue-500">Barbearia</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-900 rounded-lg text-blue-500">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Qualidade Premium</h4>
                  <p className="text-gray-400">Usamos produtos profissionais para garantir acabamento impecável.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-900 rounded-lg text-blue-500">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Profissionais Experientes</h4>
                  <p className="text-gray-400">Equipe altamente qualificada com formação e prática constante.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-900 rounded-lg text-blue-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Atendimento Ágil</h4>
                  <p className="text-gray-400">Serviço rápido, eficiente e com precisão nos detalhes.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-900 rounded-lg text-blue-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Ambiente Exclusivo</h4>
                  <p className="text-gray-400">Espaço climatizado, moderno e pensado para o seu conforto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
