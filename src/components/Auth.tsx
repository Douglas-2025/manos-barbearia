import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const Auth: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);

      // Sincronizar usuário no banco quando faz login
      if (session && data?.user) {
        try {
          await supabase.rpc('sync_user_from_auth');
          console.log('Usuário sincronizado com sucesso');
        } catch (error) {
          console.error('Erro ao sincronizar usuário:', error);
        }
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (error) {
      console.error('Erro ao iniciar login com Google', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
    } catch (error) {
      console.error('Erro ao sair', error);
    }
  };

  if (!user) {
    return (
      <button onClick={signInWithGoogle} className="bg-transparent border border-blue-600 text-blue-400 py-1 px-3 rounded hover:bg-blue-600 hover:text-white transition-colors">
        Entrar com Google
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3 text-white">
      <img src={user.user_metadata?.avatar_url || '/img/LOGO2SEMFUNDO.jpg'} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
      <span className="hidden sm:inline">{user.email || user.user_metadata?.name}</span>
      <button onClick={signOut} className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition-colors">Sair</button>
    </div>
  );
};

export default Auth;
