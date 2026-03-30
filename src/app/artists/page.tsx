'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../../lib/supabase';
import { DISTRITOS_PORTUGAL, ESTILOS_DANCA } from '../../lib/constants';

export default function ArtistsPage() {
  const [artistas, setArtistas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [distrito, setDistrito] = useState('');
  const [estilo, setEstilo] = useState('');

  useEffect(() => {
    fetchArtistas();
  }, [distrito, estilo]);

  async function fetchArtistas() {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_freelancer', true)
      .eq('user_type', 'artist');

    if (distrito) query = query.eq('current_location', distrito);
    if (estilo) query = query.contains('styles', [estilo]);

    const { data } = await query;
    setArtistas(data || []);
    setLoading(false);
  }

  const filtered = search.trim()
    ? artistas.filter(a =>
        a.artistic_name?.toLowerCase().includes(search.toLowerCase()) ||
        a.bio?.toLowerCase().includes(search.toLowerCase())
      )
    : artistas;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-5xl font-black text-indigo-900 mb-1">Artistas</h1>
          <p className="text-gray-500">Encontra talentos da cena urbana portuguesa.</p>
        </div>

        {/* Pesquisa + filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar artista..."
            className="flex-1 p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black shadow-sm"
          />
          <select
            value={distrito}
            onChange={e => setDistrito(e.target.value)}
            className="p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black shadow-sm"
          >
            <option value="">Todos os distritos</option>
            {DISTRITOS_PORTUGAL.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={estilo}
            onChange={e => setEstilo(e.target.value)}
            className="p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black shadow-sm"
          >
            <option value="">Todos os estilos</option>
            {ESTILOS_DANCA.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-600 animate-pulse font-bold">A carregar artistas...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🕺</p>
            <p className="font-bold">Nenhum artista encontrado</p>
            <p className="text-sm mt-1">Tenta outros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((artista) => (
              <div key={artista.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600 overflow-hidden flex-shrink-0">
                    {artista.avatar_url
                      ? <img src={artista.avatar_url} alt={artista.artistic_name} className="w-full h-full object-cover" />
                      : artista.artistic_name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{artista.artistic_name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">📍 {artista.current_location}</p>
                  </div>
                </div>
                {artista.styles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {artista.styles.slice(0, 3).map((s: string) => (
                      <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{s}</span>
                    ))}
                    {artista.styles.length > 3 && <span className="text-xs text-gray-400">+{artista.styles.length - 3}</span>}
                  </div>
                )}
                <p className="text-gray-600 text-sm line-clamp-2 mb-5">
                  {artista.bio || 'Bailarino profissional da cena urbana portuguesa.'}
                </p>
                <Link
                  href={`/profile/${artista.id}`}
                  className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors text-center text-sm"
                >
                  Ver Perfil
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}