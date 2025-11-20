
import React from 'react';
import Header from '../components/Header';
import Agendar from '../components/Agendar';
import Footer from '../components/Footer';

const AgendarPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Agendar />
      <Footer />
    </div>
  );
};

export default AgendarPage;
