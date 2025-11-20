
import React from 'react';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const images = [
    'https://i.pinimg.com/originals/da/7b/d8/da7bd80132a5a7391ddce58e7112f651.jpg',
    'https://moda20.com.br/wp-content/uploads/2023/07/image-125.png',
    'https://blog.newoldman.com.br/wp-content/uploads/2018/11/Cortes-de-Cabelo-Masculino-Crespo-para-2019-26-e1543623763860.jpg',
    'https://i.pinimg.com/236x/86/1b/de/861bde483804856e536d64cfea7ac37b.jpg',
    'https://i.pinimg.com/originals/9a/66/1f/9a661fea21195bf1e50db2fcb6b52b25.jpg',
    'https://i.pinimg.com/222x/ac/c6/d0/acc6d0c31f7af04761b6a4a10e08a665.jpg',
    'https://blog.newoldman.com.br/wp-content/uploads/2020/08/Corte-de-cabelo-masculino-social-Comb-Over-1.jpg',
    'https://tudocommoda.com/wp-content/uploads/2017/12/corte-de-cabelo-masculino-social-degrade3.jpg',
    'https://i1.wp.com/www.canalmasculino.com.br/wp-content/uploads/2018/10/cortes-cabelo-masculinos-afro-desenhado.jpg',
    'https://i.pinimg.com/236x/48/44/a8/4844a879662f31f28e4b498faafaf7d4.jpg',
    'https://i.pinimg.com/222x/2b/20/12/2b20121874d0611177d696b599f0422c.jpg',
    'https://i.pinimg.com/736x/65/fb/29/65fb298e49b025be3ad7a131b5369f9d.jpg'
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Nossa <span className="text-blue-500">Galeria</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Confira alguns dos nossos melhores trabalhos realizados por nossa equipe de profissionais.
            Transformamos estilos e elevamos a autoestima dos nossos clientes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg h-80">
              <img
                src={image}
                alt={`Trabalho realizado ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-blue-500 text-xl font-bold">Ver Mais</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/agendar" 
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-700 transition-colors inline-block"
          >
            Agende Seu Horário
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
