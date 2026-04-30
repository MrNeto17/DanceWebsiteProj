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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-yellow-400" />
      </div>
    );
  }

  const inputClass = "w-full p-4 bg-white/5 border border-white/10 outline-none focus:border-yellow-400 text-white placeholder:text-gray-600";
  const labelClass = "block text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2";

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 space-y-6">

        {/* Voltar */}
        <div>
          <Link href="/profile/me" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
            ← Voltar ao perfil
          </Link>
        </div>

        {/* Header */}
        <div className="border border-white/10 p-8 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-2">— Área do Artista</div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Os meus<br /><span className="text-yellow-400">Workshops.</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-3">Gere as tuas ofertas</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-yellow-400 text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all whitespace-nowrap self-start md:self-auto"
            >
              + Adicionar
            </button>
          )}
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="border border-white/10 p-8 md:p-10">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
              {editingId ? 'Editar Workshop' : 'Novo Workshop'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className={labelClass}>Título *</label>
                <input
                  type="text" required value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Workshop de Popping Fundamentals"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Descrição</label>
                <textarea
                  value={formData.description} rows={3}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="O que vais ensinar, nível, duração..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Estilos que ensinas</label>
                <StylesSelector selected={stylesTaught} onChange={setStylesTaught} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preço/hora (€)</label>
                  <input
                    type="number" min="0" step="5" value={formData.price_per_hour}
                    onChange={e => setFormData(p => ({ ...p, price_per_hour: e.target.value }))}
                    placeholder="Ex: 50"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Preço/workshop (€)</label>
                  <input
                    type="number" min="0" step="5" value={formData.price_per_workshop}
                    onChange={e => setFormData(p => ({ ...p, price_per_workshop: e.target.value }))}
                    placeholder="Ex: 150"
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={formData.can_travel}
                  onChange={e => setFormData(p => ({ ...p, can_travel: e.target.checked }))}
                  className="w-4 h-4 accent-yellow-400"
                />
                <span className="text-xs font-black uppercase tracking-widest text-gray-300">
                  Disponível para deslocações
                </span>
              </label>

              {formData.can_travel && (
                <div>
                  <label className={labelClass}>Info de deslocação</label>
                  <input
                    type="text" value={formData.travel_info}
                    onChange={e => setFormData(p => ({ ...p, travel_info: e.target.value }))}
                    placeholder="Ex: Disponível em todo o país"
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit" disabled={saving}
                  className="flex-1 bg-yellow-400 text-black py-4 font-black text-xs uppercase tracking-widest hover:bg-yellow-300 disabled:opacity-60 transition-all"
                >
                  {saving ? 'A guardar...' : editingId ? 'Guardar →' : 'Criar Workshop →'}
                </button>
                <button
                  type="button" onClick={resetForm}
                  className="px-6 border border-white/30 text-white py-4 font-black text-xs uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de offers */}
        {offers.length === 0 && !showForm ? (
          <div className="border border-white/10 py-20 text-center">
            <p className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-3">— Sem workshops</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Adiciona a tua primeira oferta</p>
          </div>
        ) : (
          <div className="border border-white/10 divide-y divide-white/10">
            {offers.map(offer => (
              <div key={offer.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white uppercase tracking-tight">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {offer.description}
                      </p>
                    )}
                    {offer.styles_taught?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {offer.styles_taught.map(s => (
                          <span key={s} className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-yellow-400/40 text-yellow-400">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 mt-3">
                      {offer.price_per_hour && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                          — {offer.price_per_hour}€/hora
                        </p>
                      )}
                      {offer.price_per_workshop && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">
                          — {offer.price_per_workshop}€/workshop
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(offer)}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-yellow-400 transition-colors px-3 py-2 border border-white/20 hover:border-yellow-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-400 transition-colors px-3 py-2 border border-white/20 hover:border-red-400"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}