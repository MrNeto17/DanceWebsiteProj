'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';
import { DISTRITOS_PORTUGAL } from '../../../lib/constants';

export default function ArtistOnboarding() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('Lisboa');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) router.push('/login');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sem user');

      let avatarUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        avatarUrl = publicUrl;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          artistic_name: nome,
          current_location: cidade,
          bio,
          avatar_url: avatarUrl,
          is_freelancer: true,
          user_type: 'artist',
          updated_at: new Date(),
        });

      if (profileError) throw profileError;
      router.push('/feed');

    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🕺</span>
          <h2 className="text-3xl font-black text-indigo-900">PERFIL DE ARTISTA</h2>
          <p className="text-gray-500 mt-2">Mostra quem és à comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <label className="cursor-pointer group">
              <div className="w-24 h-24 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden group-hover:border-indigo-400 transition-all">
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-400 text-xs font-bold text-center p-2">Upload Foto</span>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Nome Artístico</label>
            <input
              type="text" required value={nome}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Distrito</label>
            <select
              value={cidade}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setCidade(e.target.value)}
            >
              {DISTRITOS_PORTUGAL.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Bio</label>
            <textarea
              value={bio} required
              placeholder="O teu estilo, experiência, goals..."
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black h-28 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-all"
          >
            {loading ? 'A GUARDAR...' : 'TORNAR-ME ARTISTA'}
          </button>

          {errorMsg && (
            <p className="text-red-500 text-sm font-bold text-center">❌ {errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
