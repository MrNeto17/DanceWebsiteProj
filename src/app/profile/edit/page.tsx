'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';
import Link from 'next/link';

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form states (copia do teu antigo /me)
  const [formData, setFormData] = useState({
    full_name: '',
    artistic_name: '',
    current_location: 'Lisboa',
    bio: '',
    instagram_handle: '',
    website: '',
    phone: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          artistic_name: data.artistic_name || '',
          current_location: data.current_location || 'Lisboa',
          bio: data.bio || '',
          instagram_handle: data.instagram_handle || '',
          website: data.website || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage('Perfil atualizado!');
      setTimeout(() => router.push('/profile/me'), 1000);
      
    } catch (error: any) {
      setMessage('Erro: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Editar Perfil</h1>
          <p className="text-gray-500 mb-8">Altera a tua informação</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Teu formulário aqui */}
            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
              Guardar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}