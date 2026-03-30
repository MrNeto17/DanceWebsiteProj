'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
  price: number;
};

const EVENT_TYPES = ['battle', 'workshop', 'cypher', 'jam', 'other'];
const EVENT_TYPE_LABELS: Record<string, string> = {
  battle: 'Battle', workshop: 'Workshop', cypher: 'Cypher', jam: 'Jam', other: 'Outro',
};

function EventCard({ event, past = false }: { event: Event; past?: boolean }) {
  const date = new Date(event.event_date);
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-xl transition-all flex flex-col h-full ${past ? 'opacity-60' : ''}`}>
        <div className={`px-6 py-4 flex items-center justify-between ${past ? 'bg-gray-400' : 'bg-indigo-600'}`}>
          <div className="text-white">
            <p className="text-xs font-bold uppercase opacity-75 capitalize">
              {date.toLocaleDateString('pt-PT', { weekday: 'short' })}
            </p>
            <p className="text-2xl font-black capitalize">
              {date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
            </p>
          </div>
          {event.event_type && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h2 className="text-xl font-black text-gray-900 mb-2">{event.title}</h2>
          {event.description && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>
          )}
          <div className="mt-auto space-y-1.5">
            {event.location && <p className="text-sm text-gray-600">📍 {event.location}</p>}
            <p className="text-sm text-gray-600">
              🕐 {date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm font-bold text-indigo-600">
              💶 {event.price === 0 ? 'Gratuito' : `${event.price}€`}
            </p>
          </div>
          <div className={`mt-5 w-full py-3 rounded-xl font-bold text-sm text-center transition-colors ${
            past ? 'bg-gray-100 text-gray-500' : 'bg-gray-900 text-white group-hover:bg-indigo-600'
          }`}>
            {past ? 'Ver Resultados' : 'Ver Detalhes'}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    setAllEvents(data || []);
    setLoading(false);
  }

  const now = new Date();
  const upcoming = allEvents.filter(e => new Date(e.event_date) >= now);
  const past = [...allEvents.filter(e => new Date(e.event_date) < now)].reverse();
  const activeList = tab === 'upcoming' ? upcoming : past;

  const filtered = activeList
    .filter(e => !tipo || e.event_type === tipo)
    .filter(e => !search.trim() ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-5xl font-black text-indigo-900 mb-1">Eventos</h1>
          <p className="text-gray-500">Battles, workshops e cyphers por todo o país.</p>
        </div>

        {/* Pesquisa + filtro tipo */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar evento ou cidade..."
            className="flex-1 p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black shadow-sm"
          />
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black shadow-sm"
          >
            <option value="">Todos os tipos</option>
            {EVENT_TYPES.map(t => (
              <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              tab === 'upcoming' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Próximos {upcoming.length > 0 && `(${upcoming.length})`}
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              tab === 'past' ? 'bg-gray-700 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Passados {past.length > 0 && `(${past.length})`}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-600 animate-pulse font-bold">A carregar eventos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🎪</p>
            <p className="font-bold">Nenhum evento encontrado</p>
            <p className="text-sm mt-1">Tenta outros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} past={tab === 'past'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}