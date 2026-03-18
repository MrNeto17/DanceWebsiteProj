'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';
import Link from 'next/link';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  artistic_name: string;
  current_location: string;
  bio: string;
  avatar_url: string;
  instagram_handle: string;
  website: string;
  phone: string;
  user_type: 'user' | 'artist' | 'organizer';
  created_at: string;
};

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyProfile();
  }, []);

  async function loadMyProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Perfil não encontrado</p>
      </div>
    );
  }

  const displayName = profile.artistic_name || profile.full_name || profile.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/feed" className="text-2xl font-black text-indigo-900">
            DANCEHUB
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/feed" className="text-gray-600 hover:text-indigo-600 font-bold">
              Feed
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-indigo-600 font-bold">
              Eventos
            </Link>
            <Link href="/artists" className="text-gray-600 hover:text-indigo-600 font-bold">
              Artistas
            </Link>
            <Link 
              href="/profile/edit" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Perfil */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Capa */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-16 p-8">
            <h1 className="text-3xl font-black text-gray-900">
              {displayName}
            </h1>
            
            <div className="flex gap-2 mt-2">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                {profile.user_type === 'artist' ? 'Artista' : 
                 profile.user_type === 'organizer' ? 'Organizador' : 'Membro'}
              </span>
            </div>

            {profile.current_location && (
              <p className="text-gray-600 mt-4">
                📍 {profile.current_location}
              </p>
            )}

            {profile.bio && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Sobre</h2>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            <div className="mt-6 space-y-2">
              {profile.instagram_handle && (
                <a 
                  href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  className="block text-indigo-600 hover:underline"
                >
                  📷 {profile.instagram_handle}
                </a>
              )}
              {profile.website && (
                <a 
                  href={profile.website}
                  target="_blank"
                  className="block text-indigo-600 hover:underline"
                >
                  🔗 {profile.website}
                </a>
              )}
              {profile.phone && (
                <p className="text-gray-600">📞 {profile.phone}</p>
              )}
            </div>

            {/* BOTÕES PARA SER ARTISTA/ORGANIZADOR */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quero ser...</h3>
              <div className="flex gap-4">
                <Link
                  href="/onboarding/artist"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-center hover:bg-indigo-700 transition-all"
                >
                  🕺 Artista
                </Link>
                <Link
                  href="/onboarding/organizer"
                  className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-bold text-center hover:bg-purple-700 transition-all"
                >
                  🎪 Organizador
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Se já fores artista ou organizador, atualiza o teu perfil
              </p>
            </div>

            {/* Data de membro */}
            <div className="mt-6 text-xs text-gray-400">
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-PT')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}