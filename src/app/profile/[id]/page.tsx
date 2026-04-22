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
  styles: string[];
};

type WorkshopOffer = {
  id: string;
  title: string;
  description: string;
  price_per_hour: number | null;
  price_per_workshop: number | null;
  styles_taught: string[];
  can_travel: boolean;
  travel_info: string | null;
};

type EventRole = {
  id: string;
  role: 'winner' | 'top3' | 'host' | 'judge' | 'dj' | 'mc' | 'participant';
  notes: string | null;
  event: {
    id: string;
    title: string;
    event_date: string;
    location: string;
    event_type: string;
  };
};

const ROLE_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  winner:      { emoji: '🏆', label: 'Vencedor',    color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  top3:        { emoji: '🥉', label: 'Top 3',       color: 'bg-orange-50 border-orange-200 text-orange-800' },
  host:        { emoji: '🎤', label: 'Host',         color: 'bg-blue-50 border-blue-200 text-blue-800' },
  judge:       { emoji: '⚖️', label: 'Jurado',      color: 'bg-purple-50 border-purple-200 text-purple-800' },
  dj:          { emoji: '🎧', label: 'DJ',           color: 'bg-pink-50 border-pink-200 text-pink-800' },
  mc:          { emoji: '🎙️', label: 'MC',          color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  participant: { emoji: '🕺', label: 'Participante', color: 'bg-gray-50 border-gray-200 text-gray-700' },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] ?? { emoji: '📌', label: role, color: 'bg-gray-50 border-gray-200 text-gray-700' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${config.color}`}>
      {config.emoji} {config.label}
    </span>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [eventRoles, setEventRoles] = useState<EventRole[]>([]);
  const [workshopOffers, setWorkshopOffers] = useState<WorkshopOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [params.id]);

  async function loadProfile() {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Carregar marcos
      const { data: rolesData } = await supabase
        .from('event_roles')
        .select(`
          id, role, notes,
          event:events (id, title, event_date, location, event_type)
        `)
        .eq('profile_id', params.id)
        .order('created_at', { ascending: false });

      setEventRoles((rolesData as any) || []);

      // Carregar workshop offers
      const { data: offersData } = await supabase
        .from('workshop_offers')
        .select('*')
        .eq('artist_id', params.id);

      setWorkshopOffers(offersData || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Perfil não encontrado</p>
          <Link href="/feed" className="text-indigo-600 font-bold">Voltar ao feed</Link>
        </div>
      </div>
    );
  }

  const displayName = profile.artistic_name || profile.full_name || profile.email?.split('@')[0] || 'User';

  // Agrupar marcos por role para os contadores
  const wins    = eventRoles.filter(r => r.role === 'winner').length;
  const top3    = eventRoles.filter(r => r.role === 'top3').length;
  const judging = eventRoles.filter(r => r.role === 'judge').length;
  const hosting = eventRoles.filter(r => r.role === 'host').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/feed" className="text-2xl font-black text-indigo-900">UrbanCypher</Link>
          <div className="flex items-center gap-4">
            <Link href="/feed" className="text-gray-600 hover:text-indigo-600 font-bold">Feed</Link>
            <Link href="/events" className="text-gray-600 hover:text-indigo-600 font-bold">Eventos</Link>
            <Link href="/artists" className="text-gray-600 hover:text-indigo-600 font-bold">Artistas</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Card principal */}
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

          <div className="pt-16 p-8">
            <h1 className="text-3xl font-black text-gray-900">{displayName}</h1>

            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                {profile.user_type === 'artist' ? '🕺 Artista' :
                 profile.user_type === 'organizer' ? '🎪 Organizador' : 'Membro'}
              </span>
              {profile.current_location && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold">
                  📍 {profile.current_location}
                </span>
              )}
            </div>

            {profile.bio && (
              <div className="mt-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Sobre</h2>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {/* Estilos de dança */}
            {profile.styles?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Estilos</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.styles.map(style => (
                    <span key={style} className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-4 space-y-1">
              {profile.instagram_handle && (
                <a href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`} target="_blank"
                  className="block text-indigo-600 hover:underline text-sm">
                  📷 {profile.instagram_handle}
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank"
                  className="block text-indigo-600 hover:underline text-sm">
                  🔗 {profile.website}
                </a>
              )}
            </div>

            <div className="mt-6 text-xs text-gray-400">
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-PT')}
            </div>
          </div>
        </div>

        {/* Stats rápidas — só mostra se tiver alguma coisa */}
        {(wins > 0 || top3 > 0 || judging > 0 || hosting > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {wins > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-yellow-700">{wins}</p>
                <p className="text-xs font-bold text-yellow-600 mt-1">🏆 Vitórias</p>
              </div>
            )}
            {top3 > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-orange-700">{top3}</p>
                <p className="text-xs font-bold text-orange-600 mt-1">🥉 Top 3</p>
              </div>
            )}
            {judging > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-purple-700">{judging}</p>
                <p className="text-xs font-bold text-purple-600 mt-1">⚖️ Jurado</p>
              </div>
            )}
            {hosting > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-blue-700">{hosting}</p>
                <p className="text-xs font-bold text-blue-600 mt-1">🎤 Host</p>
              </div>
            )}
          </div>
        )}

        {/* Marcos / Historial */}
        {eventRoles.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Historial na Cena</h2>
            <div className="space-y-4">
              {eventRoles.map((er) => (
                <div key={er.id} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="text-2xl mt-0.5">
                    {ROLE_CONFIG[er.role]?.emoji ?? '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <RoleBadge role={er.role} />
                      {er.notes && (
                        <span className="text-xs text-gray-500 italic">{er.notes}</span>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 truncate">{er.event?.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {er.event?.event_date
                        ? new Date(er.event.event_date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
                        : ''}
                      {er.event?.location ? ` · ${er.event.location}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workshop Offers */}
        {workshopOffers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">📚 Workshops Disponíveis</h2>
            <div className="space-y-4">
              {workshopOffers.map((offer) => (
                <div key={offer.id} className="border border-gray-100 rounded-2xl p-5 hover:border-indigo-200 transition-all">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-lg">{offer.title}</h3>
                      {offer.description && (
                        <p className="text-gray-600 text-sm mt-1">{offer.description}</p>
                      )}
                      {offer.styles_taught?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {offer.styles_taught.map(s => (
                            <span key={s} className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {offer.can_travel && (
                        <p className="text-xs text-gray-500 mt-2">
                          ✈️ {offer.travel_info || 'Disponível para deslocações'}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {offer.price_per_hour && (
                        <p className="font-black text-indigo-600 text-lg">{offer.price_per_hour}€<span className="text-xs font-normal text-gray-400">/hora</span></p>
                      )}
                      {offer.price_per_workshop && (
                        <p className="font-black text-indigo-600 text-lg">{offer.price_per_workshop}€<span className="text-xs font-normal text-gray-400">/workshop</span></p>
                      )}
                      {!offer.price_per_hour && !offer.price_per_workshop && (
                        <p className="text-sm font-bold text-gray-400">Preço a combinar</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
