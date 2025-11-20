
import React from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, imageUrl, price }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      <div 
        className="h-80 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-80"></div>
      
      {/* Overlay with logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img src="/img/LOGO2SEMFUNDO.jpg" 
        alt="Logo da barbearia" 
        className="w-23 h-23 object-contain"/>
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-blue-500 mb-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">{price}</span>
          <Link 
            to="/agendar" 
            className="bg-blue-600 text-white py-1 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Agendar
          </Link>
        </div>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  const services = [
    {
      title: "Corte Social",
      description: "O corte  ",
      imageUrl: "https://i.pinimg.com/736x/28/c8/3c/28c83c91b8aa1ae5795d6ab73e4ad718.jpg",
      price: "R$ 20,00"
    },
    {
      title: "Barba Desenhada / Navalhada ",
      description: "Barba .",
      imageUrl: "https://i.pinimg.com/564x/07/bc/34/07bc34ab7fc673be78e0861c4c209ab8.jpg",
      price: "R$ 20,00"
    },
    {
      title: "Combo: Corte / Barba",
      description: "Serviço completo com corte, barba e penteado, ideal para ocasiões especiais.",
      imageUrl: "https://i.pinimg.com/736x/c9/86/1b/c9861bb65f0716af42dde7ace040be13.jpg",
      price: "R$ 40,00"
    },
    {
      title: "Corte Infantil",
      description: "Remoção de impurezas e revitalização facial com técnicas específicas para homens.",
      imageUrl: "https://i.pinimg.com/564x/16/c5/48/16c5488f20cd535f97dfb78717592b95.jpg",
      price: "R$ 30,00"
    },
    {
      title: "Sobrancelha na Navalha",
      description: "Eliminação dos pelos indesejados do nariz de forma rápida, segura e higiênica.",
      imageUrl: "https://i.pinimg.com/236x/08/73/07/08730724a0cea96623eb101c4f4b0d01.jpg" ,
      price: "R$ 10,00"
    },
    {
      title: "Selagem Capilar",
      description: "Tratamento capilar que reduz o frizz e proporciona brilho intenso aos fios.",
      imageUrl: "https://i.pinimg.com/originals/cc/dd/74/ccdd7499ab278dab3149c2f093d63c93.jpg",
      price: "R$ 150,00"
    },
    {
      title: "Platinado / Descoloração",
      description: "Pacote premium com corte, barba e tratamento de selagem para um visual impecável.",
      imageUrl: "https://tse3.mm.bing.net/th/id/OIP.-a55Eh8w7n9Evhq4PhRJQQHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      price: "R$ 100,00"
    },
    {
      title: "Hidratação Capilar",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "https://seuelias.com/v2018/wp-content/uploads/2022/02/hidratacao-capilar-masculina.jpg",
      price: "R$ 20,00"
    },
    {
      title: " Design de Corte / Corte na Tesoura",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "data:image/jpeg;base64,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",
      price: "R$ 30,00"
    },
    {
      title: "Corte Degradê / Fade ",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp4MbT2M7aO-egHI4_9KqOyJ-EFOfmQEyVoxGJvTIVA-niJ_ogLXXE-k9w8Cq6UyBKeZE&usqp=CAU",
      price: "R$ 25,00"
    },
    {
      title: "Low fade",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "https://i.pinimg.com/736x/b6/7a/81/b67a810c3144396bb31c59e832941701.jpg",
      price: "R$ 35,00"
    },
    {
      title: "Corte artístico",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "https://i.pinimg.com/236x/0d/94/c8/0d94c8e19f88763281d0301a739c7286.jpg",
      price: "R$ 40,00"
    },
    {
      title: "Barba Lenhador / Estilizada",
      description: "Design de sobrancelhas alinhado ao formato do rosto para um visual harmonioso.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKhT76sLYlBcLmfExXxUpGefEwhKYgv7T60w&s",
      price: "R$ 25,00"
    },
    {
      title: " Acabamento / Pézinho",
      description: "Serviços adicionais como hidratação e depilação nazal",
      imageUrl: "https://static.wixstatic.com/media/d55bb9_1d44f800740e4c6c96d999453c6045df~mv2.jpg/v1/fill/w_250,h_250,al_c,q_80,usm_0.66_1.00_0.01/d55bb9_1d44f800740e4c6c96d999453c6045df~mv2.jpg",
      price: "R$ 10,00"
    },
    {
      title: " Extras",
      description: "Serviços adicionais como hidratação e depilação nazal",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzp8VpATvdkuVn6TNBMTvt7JCfN-Wv9Fx48pMWlMqsQtHUtiaY8vJSu2JCHqnprogYi3Q&usqp=CAU",
      price: "R$ 10,00"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Nossos <span className="text-blue-500">Serviços</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Oferecemos serviços premium de barbearia com profissionais experientes,
            utilizando técnicas modernas e produtos de alta qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              price={service.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
