'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import { ESTILOS_DANCA } from '../../lib/constants';
import Link from 'next/link';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  event_type: string;
  price: number;
  styles: string[];
  battle_format: string | null;
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  battle: 'Battle', workshop: 'Workshop', cypher: 'Cypher', jam: 'Jam', other: 'Outro',
};

const BATTLE_FORMATS = ['1v1', '2v2', '3v3', 'crew', 'solo'];

function EventCard({ event, past = false }: { event: Event; past?: boolean }) {
  const date = new Date(event.event_date);
  return (
    <Link href={`/events/${event.id}`} className={`block group ${past ? 'opacity-50' : ''}`}>
      <div className="border border-white/10 hover:border-yellow-400 transition-colors h-full flex flex-col">

        {/* Date strip */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {date.toLocaleDateString('pt-PT', { weekday: 'short' })}
            </p>
            <p className="text-2xl font-black uppercase text-yellow-400 leading-tight">
              {date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-yellow-400/40 text-yellow-400">
              {EVENT_TYPE_LABELS[event.event_type] ?? event.event_type}
            </span>
            {event.battle_format && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-white/20 text-gray-400">
                {event.battle_format.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3 group-hover:text-yellow-400 transition-colors">
            {event.title}
          </h2>

          {event.styles?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {event.styles.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-white/20 text-gray-400">
                  {s}
                </span>
              ))}
              {event.styles.length > 3 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 self-center">
                  +{event.styles.length - 3}
                </span>
              )}
            </div>
          )}

          {event.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-5" style={{ fontFamily: 'Arial, sans-serif' }}>
              {event.description}
            </p>
          )}

          <div className="mt-auto space-y-2 pt-4 border-t border-white/10">
            {event.location && (
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                — {event.location}
              </p>
            )}
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              — {date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
              — {event.price === 0 ? 'Gratuito' : `${event.price}€`}
            </p>
          </div>

          <div className="mt-5 text-[10px] font-black text-yellow-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            {past ? 'Ver resultados →' : 'Ver detalhes →'}
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
  const [estilo, setEstilo] = useState('');
  const [formato, setFormato] = useState('');
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
    .filter(e => !estilo || e.styles?.includes(estilo))
    .filter(e => !formato || e.battle_format === formato)
    .filter(e => !search.trim() ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase())
    );

  const inputClass = "w-full p-4 bg-white/5 border border-white/10 outline-none focus:border-yellow-400 text-white placeholder:text-gray-600";

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-3">— Agenda</div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">
            Eventos<span className="text-yellow-400">.</span>
          </h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-4">
            Battles, workshops e cyphers por todo o país
          </p>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar evento ou cidade..."
            className={`lg:col-span-${tipo === 'battle' || tipo === '' ? '1' : '2'} ${inputClass}`}
          />
          <select value={tipo} onChange={e => { setTipo(e.target.value); setFormato(''); }} className={inputClass}>
            <option value="" className="bg-black">Todos os tipos</option>
            {Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v} className="bg-black">{l}</option>
            ))}
          </select>
          <select value={estilo} onChange={e => setEstilo(e.target.value)} className={inputClass}>
            <option value="" className="bg-black">Todos os estilos</option>
            {ESTILOS_DANCA.map(e => (
              <option key={e} value={e} className="bg-black">{e}</option>
            ))}
          </select>
          {(tipo === 'battle' || tipo === '') && (
            <select value={formato} onChange={e => setFormato(e.target.value)} className={inputClass}>
              <option value="" className="bg-black">Todos os formatos</option>
              {BATTLE_FORMATS.map(f => (
                <option key={f} value={f} className="bg-black">{f.toUpperCase()}</option>
              ))}
            </select>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border border-white/10">
          <button
            onClick={() => setTab('upcoming')}
            className={`flex-1 px-6 py-4 font-black text-xs uppercase tracking-widest transition-all ${
              tab === 'upcoming' ? 'bg-yellow-400 text-black' : 'bg-transparent text-gray-400 hover:text-yellow-400'
            }`}
          >
            Próximos {upcoming.length > 0 && `(${upcoming.length})`}
          </button>
          <button
            onClick={() => setTab('past')}
            className={`flex-1 px-6 py-4 font-black text-xs uppercase tracking-widest transition-all border-l border-white/10 ${
              tab === 'past' ? 'bg-yellow-400 text-black' : 'bg-transparent text-gray-400 hover:text-yellow-400'
            }`}
          >
            Passados {past.length > 0 && `(${past.length})`}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-yellow-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-white/10 py-20 text-center">
            <p className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-3">— Sem resultados</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Tenta outros filtros</p>
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