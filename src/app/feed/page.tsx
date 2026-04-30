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
      if (!user) { router.push('/login'); return; }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);

      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 space-y-6">

        {/* Boas-vindas */}
        <div className="border border-white/10 p-8 md:p-10">
          <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-3">— Feed</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none break-words">
            Bem-vindo{profile?.artistic_name ? <>,<br /><span className="text-yellow-400">{profile.artistic_name}.</span></> : <span className="text-yellow-400">.</span>}
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-4">
            {!profile
              ? 'Ainda não tens perfil. Escolhe o teu papel para começar.'
              : 'O que vamos fazer hoje?'}
          </p>
          {profile?.user_type === 'user' && (
            <Link
              href="/choose-role"
              className="inline-block mt-6 bg-yellow-400 text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
            >
              Tornar-me Artista ou Organizador →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Próximos Eventos */}
          <div className="border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">— Próximos Eventos</h3>
              <Link href="/events" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
                Ver todos →
              </Link>
            </div>

            {events.length === 0 ? (
              <p className="text-gray-500 text-xs uppercase tracking-widest text-center py-12">— Sem eventos</p>
            ) : (
              <div className="divide-y divide-white/10">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="block py-4 first:pt-0 last:pb-0 group"
                  >
                    <h4 className="font-black uppercase tracking-tight text-white group-hover:text-yellow-400 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-2">
                      — {new Date(event.event_date).toLocaleDateString('pt-PT')} / {event.location}
                    </p>
                    {event.event_type && (
                      <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-yellow-400/40 text-yellow-400">
                        {event.event_type}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Artistas */}
          <div className="border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">— Artistas</h3>
              <Link href="/artists" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
                Ver todos →
              </Link>
            </div>

            {artists.length === 0 ? (
              <p className="text-gray-500 text-xs uppercase tracking-widest text-center py-12">— Sem artistas</p>
            ) : (
              <div className="divide-y divide-white/10">
                {artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/profile/${artist.id}`}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
                  >
                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-yellow-400 overflow-hidden shrink-0">
                      {artist.avatar_url
                        ? <img src={artist.avatar_url} alt="" className="w-full h-full object-cover" />
                        : (artist.artistic_name?.charAt(0).toUpperCase() || '?')
                      }
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black uppercase tracking-tight text-white group-hover:text-yellow-400 transition-colors truncate">
                        {artist.artistic_name || 'Sem nome'}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                        — {artist.current_location || 'Local desconhecido'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}