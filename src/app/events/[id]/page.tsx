'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import supabase from '../../../lib/supabase';
import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
  price: number;
  max_participants: number | null;
  creator_id: string;
};

type EventRole = {
  id: string;
  role: string;
  notes: string | null;
  profile: {
    id: string;
    artistic_name: string;
    avatar_url: string;
    current_location: string;
  };
};

const TYPE_LABEL: Record<string, string> = {
  battle: 'Battle', workshop: 'Workshop', cypher: 'Cypher', jam: 'Jam', other: 'Outro',
};

const ROLE_LABEL: Record<string, string> = {
  winner: 'Vencedor', top3: 'Top 3', host: 'Host', judge: 'Jurado',
  dj: 'DJ', mc: 'MC', participant: 'Participante',
};

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [roles, setRoles] = useState<EventRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  async function loadEvent() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      const { data: rolesData } = await supabase
        .from('event_roles')
        .select(`
          id, role, notes,
          profile:profiles (id, artistic_name, avatar_url, current_location)
        `)
        .eq('event_id', params.id);

      setRoles((rolesData as any) || []);

    } catch (err: any) {
      setError(err.message);
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">— Evento não encontrado</p>
          <Link href="/events" className="text-xs font-black text-yellow-400 uppercase tracking-widest hover:text-yellow-300">
            ← Voltar aos eventos
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const isPast = eventDate < new Date();
  const isCreator = currentUserId === event.creator_id;
  const typeLabel = TYPE_LABEL[event.event_type] ?? event.event_type;

  const grouped = roles.reduce((acc, r) => {
    if (!acc[r.role]) acc[r.role] = [];
    acc[r.role].push(r);
    return acc;
  }, {} as Record<string, EventRole[]>);

  const roleOrder = ['winner', 'top3', 'judge', 'host', 'dj', 'mc', 'participant'];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 space-y-6">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/events" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
            ← Todos os eventos
          </Link>
          {isCreator && (
            <Link
              href={`/events/${event.id}/edit`}
              className="border border-white/30 text-white px-5 py-2 font-black text-xs uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all"
            >
              Editar →
            </Link>
          )}
        </div>

        {/* Card principal */}
        <div className="border border-white/10">
          <div className="p-8 md:p-10 border-b border-white/10">
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-yellow-400/40 text-yellow-400">
                {typeLabel}
              </span>
              {isPast && (
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-white/20 text-gray-400">
                  Terminado
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">{event.title}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-6">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">— Data</p>
              <p className="font-black uppercase tracking-tight">
                {eventDate.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                {eventDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">— Local</p>
              <p className="font-black uppercase tracking-tight break-words">{event.location}</p>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">— Entrada</p>
              <p className="font-black uppercase tracking-tight text-2xl text-yellow-400">
                {event.price === 0 ? 'Gratuito' : `${event.price}€`}
              </p>
              {event.max_participants && (
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">
                  Máx. {event.max_participants} participantes
                </p>
              )}
            </div>
          </div>

          {event.description && (
            <div className="p-8 md:p-10 border-t border-white/10">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-3">— Sobre o Evento</p>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Pessoas ligadas ao evento */}
        {roles.length > 0 && (
          <div className="border border-white/10 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-0.5 bg-yellow-400" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
                {isPast ? 'Quem esteve presente' : 'Quem vai estar presente'}
              </h2>
            </div>
            <div className="space-y-8">
              {roleOrder
                .filter(role => grouped[role]?.length > 0)
                .map(role => (
                  <div key={role}>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-3">
                      — {ROLE_LABEL[role] ?? role}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-white/10">
                      {grouped[role].map(er => (
                        <Link
                          key={er.id}
                          href={`/profile/${er.profile.id}`}
                          className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-base font-black text-yellow-400 overflow-hidden shrink-0">
                            {er.profile.avatar_url ? (
                              <img src={er.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              er.profile.artistic_name?.charAt(0).toUpperCase() || '?'
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black uppercase tracking-tight text-white truncate group-hover:text-yellow-400 transition-colors">
                              {er.profile.artistic_name}
                            </p>
                            {er.notes && (
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate mt-0.5">
                                — {er.notes}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Sem pessoas ainda */}
        {roles.length === 0 && !isPast && (
          <div className="border border-white/10 py-16 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              — Ainda não há jurados, hosts ou participantes registados
            </p>
          </div>
        )}

      </div>
    </div>
  );
}