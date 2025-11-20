
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Auth from './Auth';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToId = (id?: string) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center" onClick={() => scrollToId(undefined)}>
          <img src="/img/LOGO2SEMFUNDO.jpg" alt="logo" width={50}/>
            <span className="text-white">Mano's</span>
            <span className="text-blue-500">Barbearia</span>
            
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="block md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); scrollToId(undefined); }}
              className="text-white hover:text-blue-500 transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => { e.preventDefault(); scrollToId('about'); }}
              className="text-white hover:text-blue-500 transition-colors"
            >
              Sobre
            </a>
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); scrollToId('services'); }}
              className="text-white hover:text-blue-500 transition-colors"
            >
              Serviços
            </a>
            <a
              href="#gallery"
              onClick={(e) => { e.preventDefault(); scrollToId('gallery'); }}
              className="text-white hover:text-blue-500 transition-colors"
            >
              Galeria
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}
              className="text-white hover:text-blue-500 transition-colors"
            >
              Contato
            </a>
            <Link to="/agendar" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
              Agendar
            </Link>
            {/* Painel do barbeiro removido do header - acesso somente via link direto */}
          </nav>
          <div className="hidden md:flex items-center ml-4">
            <Auth />
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-gray-900 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId(undefined); setIsMenuOpen(false); }}
              >
                Home
              </a>
              <a
                href="#about"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId('about'); setIsMenuOpen(false); }}
              >
                Sobre
              </a>
              <a
                href="#services"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId('services'); setIsMenuOpen(false); }}
              >
                Serviços
              </a>
              <a
                href="#gallery"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId('gallery'); setIsMenuOpen(false); }}
              >
                Galeria
              </a>
              <a
                href="#testimonials"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId('testimonials'); setIsMenuOpen(false); }}
              >
                Depoimentos
              </a>
              <a
                href="#contact"
                className="hover:text-blue-500 transition-colors py-2"
                onClick={(e) => { e.preventDefault(); scrollToId('contact'); setIsMenuOpen(false); }}
              >
                Contato
              </a>
              <Link 
                to="/agendar" 
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors inline-block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Agendar
              </Link>
              {/* Link para painel do barbeiro removido do menu móvel - acesso somente via link direto */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
