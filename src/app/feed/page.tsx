'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';
import Link from 'next/link';

type Profile = {
  id: string;
  artistic_name: string;
  current_location: string;
  bio: string;
  avatar_url: string;
  is_freelancer: boolean;
  user_type: 'user' | 'artist' | 'organizer';
};

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
};

export default function FeedPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedData();
  }, []);

  async function loadFeedData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(5);

      setEvents(eventsData || []);

      const { data: artistsData } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_freelancer', true)
        .limit(5);

      setArtists(artistsData || []);
      
    } catch (error) {
      console.error('Erro a carregar feed:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-900">DANCEHUB</h1>
          <div className="flex items-center gap-4">
  <Link href="/events" className="text-gray-600 hover:text-indigo-600 font-bold">
    Eventos
  </Link>
  <Link href="/artists" className="text-gray-600 hover:text-indigo-600 font-bold">
    Artistas
  </Link>
  <Link href="/profile/me" className="text-gray-600 hover:text-indigo-600 font-bold">
    Perfil
  </Link>
  
  {!profile ? (
    <Link 
      href="/choose-role" 
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
    >
      Escolher Papel
    </Link>
  ) : profile.user_type === 'artist' ? (
    <Link 
      href="/dashboard/artist" 
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
    >
      Dashboard Artista
    </Link>
  ) : profile.user_type === 'organizer' ? (
    <Link 
      href="/dashboard/organizer" 
      className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700"
    >
      Dashboard Organizador
    </Link>
  ) : (
    <Link 
      href="/choose-role" 
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
    >
      Ser Artista/Organizador
    </Link>
  )}
</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-3xl font-black text-gray-900">
            Bem-vindo{profile?.artistic_name ? `, ${profile.artistic_name}` : ''}!
          </h2>
          <p className="text-gray-600 mt-2">
            {!profile 
              ? 'Ainda não tens perfil. Escolhe o teu papel para começar.'
              : 'O que vamos fazer hoje?'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Próximos Eventos</h3>
              <Link href="/events" className="text-indigo-600 text-sm font-bold hover:underline">
                Ver todos →
              </Link>
            </div>
            
            {events.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Ainda não há eventos</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-bold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.event_date).toLocaleDateString('pt-PT')} • {event.location}
                    </p>
                    {event.event_type && (
                      <span className="inline-block mt-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Artistas</h3>
              <Link href="/artists" className="text-indigo-600 text-sm font-bold hover:underline">
                Ver todos →
              </Link>
            </div>

            {artists.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Ainda não há artistas</p>
            ) : (
              <div className="space-y-4">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600">
                      {artist.artistic_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{artist.artistic_name || 'Sem nome'}</h4>
                      <p className="text-sm text-gray-600">{artist.current_location || 'Local desconhecido'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}