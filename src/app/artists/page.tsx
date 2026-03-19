'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabase';
import { DISTRITOS_PORTUGAL } from '../../lib/constants';

export default function Page() {
  const [artistas, setArtistas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtistas();
  }, [filtro]);

  async function fetchArtistas() {
    setLoading(true);
    let query = supabase.from('profiles').select('*').eq('is_freelancer', true);

    if (filtro !== 'Todos') {
      query = query.ilike('current_location', filtro);
    }

    const { data } = await query;
    setArtistas(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-indigo-900 mb-4 tracking-tight">COMUNIDADE</h1>
          <p className="text-gray-500 text-lg">Encontra os melhores talentos para o teu próximo workshop.</p>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['Todos', ...DISTRITOS_PORTUGAL].map((district) => (
              <button
                key={district}
                onClick={() => setFiltro(district)}
                className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${
                  filtro === district ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-indigo-600 animate-pulse font-bold text-xl">
            A carregar artistas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artistas.map((artista) => (
              <div
                key={artista.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-600 overflow-hidden">
                    {artista.avatar_url ? (
                      <img src={artista.avatar_url} alt={artista.artistic_name} className="w-full h-full object-cover" />
                    ) : (
                      artista.artistic_name?.charAt(0) || '?'
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{artista.artistic_name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">📍 {artista.current_location}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 h-12">
                  {artista.bio || 'Bailarino profissional focado em partilhar a cultura e o movimento.'}
                </p>
                {/* ✅ LIGADO ao perfil público */}
                <Link
                  href={`/profile/${artista.id}`}
                  className="block w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors text-center"
                >
                  VER PERFIL
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && artistas.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Ainda não há artistas nesta localização.
          </div>
        )}
      </div>
    </div>
  );
}
