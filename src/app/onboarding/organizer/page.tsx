'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';

export default function OrganizerOnboarding() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('Lisboa');
  const [organizacao, setOrganizacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [website, setWebsite] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem user");

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

      // Criar perfil base
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          artistic_name: nome,
          current_location: cidade,
          avatar_url: avatarUrl,
          is_freelancer: false,
          user_type: 'organizer',
          updated_at: new Date()
        });

      if (profileError) throw profileError;

      // Criar perfil de organizador
      const { error: organizerError } = await supabase
        .from('organizers')
        .insert({ 
          profile_id: user.id,
          organization_name: organizacao,
          phone: telefone,
          website: website,
          verified: false
        });

      if (organizerError) throw organizerError;

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
          <span className="text-6xl mb-4 block">🎪</span>
          <h2 className="text-3xl font-black text-purple-900">PERFIL DE ORGANIZADOR</h2>
          <p className="text-gray-500 mt-2">Cria e gere eventos na comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <label className="cursor-pointer group">
              <div className="w-24 h-24 bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 flex items-center justify-center overflow-hidden group-hover:border-purple-400 transition-all">
                {file ? (
                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-purple-400 text-xs font-bold text-center p-2">Upload Logo</span>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Nome / Crew</label>
            <input 
              type="text" required value={nome}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Localização</label>
            <select 
              value={cidade}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setCidade(e.target.value)}
            >
              <option value="Lisboa">Lisboa</option>
              <option value="Porto">Porto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Nome da Organização (opcional)</label>
            <input 
              type="text" value={organizacao}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setOrganizacao(e.target.value)}
              placeholder="Ex: Breaking Lx"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Telefone (opcional)</label>
            <input 
              type="tel" value={telefone}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="912345678"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Website (opcional)</label>
            <input 
              type="url" value={website}
              className="w-full p-3 bg-gray-50 border-none rounded-xl mt-1 text-black focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-700 disabled:bg-gray-300 transition-all"
          >
            {loading ? 'A GUARDAR...' : 'TORNAR-ME ORGANIZADOR'}
          </button>

          {errorMsg && (
            <p className="text-red-500 text-sm font-bold text-center">
              ❌ {errorMsg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}