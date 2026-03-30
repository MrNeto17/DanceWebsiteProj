'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';
import StylesSelector from '../../components/StyleSelector';
import Link from 'next/link';

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

export default function WorkshopOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<WorkshopOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_hour: '',
    price_per_workshop: '',
    can_travel: true,
    travel_info: '',
  });
  const [stylesTaught, setStylesTaught] = useState<string[]>([]);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/login'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'artist') {
      router.replace('/feed');
      return;
    }

    const { data } = await supabase
      .from('workshop_offers')
      .select('*')
      .eq('artist_id', user.id);

    setOffers(data || []);
    setLoading(false);
  }

  function resetForm() {
    setFormData({ title: '', description: '', price_per_hour: '', price_per_workshop: '', can_travel: true, travel_info: '' });
    setStylesTaught([]);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(offer: WorkshopOffer) {
    setFormData({
      title: offer.title,
      description: offer.description || '',
      price_per_hour: offer.price_per_hour ? String(offer.price_per_hour) : '',
      price_per_workshop: offer.price_per_workshop ? String(offer.price_per_workshop) : '',
      can_travel: offer.can_travel,
      travel_info: offer.travel_info || '',
    });
    setStylesTaught(offer.styles_taught || []);
    setEditingId(offer.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const payload = {
        artist_id: user.id,
        title: formData.title,
        description: formData.description,
        price_per_hour: formData.price_per_hour ? parseFloat(formData.price_per_hour) : null,
        price_per_workshop: formData.price_per_workshop ? parseFloat(formData.price_per_workshop) : null,
        styles_taught: stylesTaught,
        can_travel: formData.can_travel,
        travel_info: formData.travel_info || null,
      };

      if (editingId) {
        await supabase.from('workshop_offers').update(payload).eq('id', editingId);
      } else {
        await supabase.from('workshop_offers').insert(payload);
      }

      await checkAuthAndLoad();
      resetForm();

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Apagar este workshop?')) return;
    await supabase.from('workshop_offers').delete().eq('id', id);
    setOffers(prev => prev.filter(o => o.id !== id));
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
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Os meus Workshops</h1>
            <p className="text-gray-500 mt-1">Gere as tuas ofertas de workshop</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              + Adicionar
            </button>
          )}
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              {editingId ? 'Editar Workshop' : 'Novo Workshop'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título *</label>
                <input
                  type="text" required value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Workshop de Popping Fundamentals"
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description} rows={3}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="O que vais ensinar, nível, duração..."
                  className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Estilos que ensinas</label>
                <StylesSelector selected={stylesTaught} onChange={setStylesTaught} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preço/hora (€)</label>
                  <input
                    type="number" min="0" step="5" value={formData.price_per_hour}
                    onChange={e => setFormData(p => ({ ...p, price_per_hour: e.target.value }))}
                    placeholder="Ex: 50"
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preço/workshop (€)</label>
                  <input
                    type="number" min="0" step="5" value={formData.price_per_workshop}
                    onChange={e => setFormData(p => ({ ...p, price_per_workshop: e.target.value }))}
                    placeholder="Ex: 150"
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="can_travel" checked={formData.can_travel}
                  onChange={e => setFormData(p => ({ ...p, can_travel: e.target.checked }))}
                  className="w-4 h-4 accent-indigo-600"
                />
                <label htmlFor="can_travel" className="text-sm font-bold text-gray-700">
                  Disponível para deslocações
                </label>
              </div>

              {formData.can_travel && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Info de deslocação</label>
                  <input
                    type="text" value={formData.travel_info}
                    onChange={e => setFormData(p => ({ ...p, travel_info: e.target.value }))}
                    placeholder="Ex: Disponível em todo o país"
                    className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 disabled:opacity-60 transition-all"
                >
                  {saving ? 'A guardar...' : editingId ? 'Guardar' : 'Criar Workshop'}
                </button>
                <button
                  type="button" onClick={resetForm}
                  className="px-5 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de offers */}
        {offers.length === 0 && !showForm ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-4xl mb-4">📚</p>
            <p className="font-bold text-gray-700">Ainda não tens workshops</p>
            <p className="text-gray-400 text-sm mt-1">Adiciona a tua primeira oferta</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900">{offer.title}</h3>
                    {offer.description && <p className="text-gray-500 text-sm mt-1">{offer.description}</p>}
                    {offer.styles_taught?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {offer.styles_taught.map(s => (
                          <span key={s} className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-2">
                      {offer.price_per_hour && <p className="text-sm font-bold text-indigo-600">{offer.price_per_hour}€/hora</p>}
                      {offer.price_per_workshop && <p className="text-sm font-bold text-indigo-600">{offer.price_per_workshop}€/workshop</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(offer)}
                      className="text-sm font-bold text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all">
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleDelete(offer.id)}
                      className="text-sm font-bold text-gray-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/profile/me" className="block text-center text-sm text-gray-400 hover:text-gray-600 font-bold">
          ← Voltar ao perfil
        </Link>
      </div>
    </div>
  );
}
