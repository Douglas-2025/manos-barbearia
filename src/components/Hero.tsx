
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/img/SALAO.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          <span className="text-blue-500">Mano's</span>{' '}
          <span className="text-white">BARBEARIA</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Estilo, atitude e excelência em cada corte. Uma experiência única para homens que valorizam qualidade.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/agendar"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 hover:shadow-lg"
          >
            💈 AGENDAR AGORA
          </Link>

          <a
            href="#services"
            className="inline-block bg-transparent text-white border-2 border-white font-bold py-3 px-8 rounded-full transition-all hover:bg-white hover:text-gray-900"
          >
            NOSSOS SERVIÇOS
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
