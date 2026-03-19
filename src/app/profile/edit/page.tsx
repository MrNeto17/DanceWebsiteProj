'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';
import { DISTRITOS_PORTUGAL } from '../../../lib/constants';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    artistic_name: '',
    current_location: 'Lisboa',
    bio: '',
    instagram_handle: '',
    website: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          full_name:        data.full_name        || '',
          artistic_name:    data.artistic_name    || '',
          current_location: data.current_location || 'Lisboa',
          bio:              data.bio              || '',
          instagram_handle: data.instagram_handle || '',
          website:          data.website          || '',
          phone:            data.phone            || '',
          avatar_url:       data.avatar_url       || '',
        });
        setPreviewUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let avatar_url = formData.avatar_url;

      // Upload novo avatar se selecionado
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

        avatar_url = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ ...formData, avatar_url, updated_at: new Date() })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('✅ Perfil atualizado!');
      setTimeout(() => router.push('/profile/me'), 1000);

    } catch (error: any) {
      setMessage('❌ Erro: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/feed" className="text-2xl font-black text-indigo-900">DANCEHUB</Link>
          <Link href="/profile/me" className="text-gray-600 hover:text-indigo-600 font-bold">
            ← Voltar ao perfil
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Editar Perfil</h1>
          <p className="text-gray-500 mb-8">Atualiza a tua informação pública</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-2">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden group-hover:border-indigo-400 transition-all">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-indigo-400 text-xs font-bold text-center p-2">Upload Foto</span>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <div>
                <p className="font-bold text-gray-700 text-sm">Foto de perfil</p>
                <p className="text-xs text-gray-400 mt-1">JPG ou PNG. Clica na imagem para alterar.</p>
              </div>
            </div>

            {/* Nome completo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="O teu nome real"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            {/* Nome artístico */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Artístico</label>
              <input
                type="text"
                name="artistic_name"
                value={formData.artistic_name}
                onChange={handleChange}
                placeholder="Ex: Krazy Legs PT"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Localização</label>
              <select
                name="current_location"
                value={formData.current_location}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              >
                {DISTRITOS_PORTUGAL.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="O teu estilo, experiência, goals..."
                rows={4}
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black resize-none"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Instagram</label>
              <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="pl-3 text-gray-400 font-bold">@</span>
                <input
                  type="text"
                  name="instagram_handle"
                  value={formData.instagram_handle.replace('@', '')}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                  placeholder="o_teu_handle"
                  className="w-full p-3 bg-transparent outline-none text-black"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Website (opcional)</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Telefone (opcional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="912345678"
                className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            {message && (
              <p className="text-sm font-bold text-center py-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-60 transition-all"
            >
              {saving ? 'A GUARDAR...' : 'GUARDAR ALTERAÇÕES'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
