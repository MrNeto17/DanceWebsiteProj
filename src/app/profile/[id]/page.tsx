'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  user_type: 'user' | 'artist' | 'organizer';
  created_at: string;
};

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  async function loadProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
    } catch (err: any) {
      setError(err.message);
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Perfil não encontrado</p>
          <Link href="/feed" className="text-indigo-600 font-bold">
            Voltar ao feed
          </Link>
        </div>
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
                {profile.current_location}
              </p>
            )}

            {profile.bio && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Sobre</h2>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {profile.instagram_handle && (
              <div className="mt-4">
                <a 
                  href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  className="text-indigo-600 hover:underline"
                >
                  Instagram: {profile.instagram_handle}
                </a>
              </div>
            )}

            {profile.website && (
              <div className="mt-2">
                <a 
                  href={profile.website}
                  target="_blank"
                  className="text-indigo-600 hover:underline"
                >
                  Website: {profile.website}
                </a>
              </div>
            )}

            <div className="mt-6 text-xs text-gray-400">
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-PT')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}