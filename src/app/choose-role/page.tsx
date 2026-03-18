'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';
import Link from 'next/link';

export default function ChooseRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUser(user);
  }

  async function chooseRole(role: 'artist' | 'organizer') {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Atualizar o tipo de user
      const { error } = await supabase
        .from('profiles')
        .update({ 
          user_type: role,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Redirecionar para o onboarding específico
      if (role === 'artist') {
        router.push('/onboarding/artist');
      } else {
        router.push('/onboarding/organizer');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao escolher tipo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-black text-center text-indigo-900 mb-4">Escolhe o teu papel</h1>
        <p className="text-center text-gray-600 mb-12">Como queres participar na comunidade?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ARTISTA */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
            <div className="text-6xl mb-4">🕺</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Artista</h2>
            <p className="text-gray-600 mb-6">
              Queres dar workshops, participar em battles, mostrar a tua arte e conectar com outros dancers.
            </p>
            <ul className="text-sm text-gray-600 mb-8 space-y-2">
              <li className="flex items-center gap-2">✅ Criar perfil de artista</li>
              <li className="flex items-center gap-2">✅ Definir preços e estilos</li>
              <li className="flex items-center gap-2">✅ Participar em battles</li>
              <li className="flex items-center gap-2">✅ Ser descoberto pela comunidade</li>
            </ul>
            <button
              onClick={() => chooseRole('artist')}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all"
            >
              {loading ? 'A processar...' : 'Sou Artista'}
            </button>
          </div>

          {/* ORGANIZADOR */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Organizador</h2>
            <p className="text-gray-600 mb-6">
              Queres criar eventos, battles, workshops e gerir a cena na tua cidade.
            </p>
            <ul className="text-sm text-gray-600 mb-8 space-y-2">
              <li className="flex items-center gap-2">✅ Criar eventos e battles</li>
              <li className="flex items-center gap-2">✅ Gerir inscrições</li>
              <li className="flex items-center gap-2">✅ Promover workshops</li>
              <li className="flex items-center gap-2">✅ Conectar com artistas</li>
            </ul>
            <button
              onClick={() => chooseRole('organizer')}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all"
            >
              {loading ? 'A processar...' : 'Sou Organizador'}
            </button>
          </div>
        </div>

        {/* Opção para ficar só user */}
        <div className="text-center mt-8">
          <Link 
            href="/feed" 
            className="text-gray-500 hover:text-gray-700 font-bold"
          >
            Por agora quero só ver eventos (ser user normal)
          </Link>
        </div>
      </div>
    </div>
  );
}