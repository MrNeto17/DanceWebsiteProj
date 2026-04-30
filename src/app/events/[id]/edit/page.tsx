'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import supabase from '../../../../lib/supabase';
import Link from 'next/link';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'battle',
    event_date: '',
    event_time: '',
    location: '',
    price: '0',
    max_participants: '',
  });

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  async function loadEvent() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      if (event.creator_id !== user.id) {
        router.replace('/events');
        return;
      }

      const date = new Date(event.event_date);
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);

      setFormData({
        title:            event.title || '',
        description:      event.description || '',
        event_type:       event.event_type || 'battle',
        event_date:       dateStr,
        event_time:       timeStr,
        location:         event.location || '',
        price:            String(event.price ?? 0),
        max_participants: event.max_participants ? String(event.max_participants) : '',
      });

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const eventDatetime = formData.event_time
        ? `${formData.event_date}T${formData.event_time}:00`
        : `${formData.event_date}T00:00:00`;

      const { error } = await supabase
        .from('events')
        .update({
          title:            formData.title,
          description:      formData.description,
          event_type:       formData.event_type,
          event_date:       eventDatetime,
          location:         formData.location,
          price:            parseFloat(formData.price) || 0,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          updated_at:       new Date(),
        })
        .eq('id', params.id);

      if (error) throw error;
      router.push(`/events/${params.id}`);

    } catch (err: any) {
      setErrorMsg(err.message);
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', params.id);

      if (error) throw error;
      router.push('/events');

    } catch (err: any) {
      setErrorMsg(err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
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
      <div className="max-w-2xl mx-auto px-6 md:px-12 py-12">

        <div className="mb-8">
          <Link href={`/events/${params.id}`} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
            ← Voltar ao evento
          </Link>
        </div>

        <div className="border border-white/10 p-8 md:p-10">
          <div className="mb-10">
            <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-2">— Gerir evento</div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Editar<br /><span className="text-yellow-400">Evento.</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-3">Atualiza os detalhes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className={labelClass}>Nome do Evento *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Tipo *</label>
              <select name="event_type" value={formData.event_type} onChange={handleChange} className={inputClass}>
                <option value="battle"   className="bg-black">Battle</option>
                <option value="workshop" className="bg-black">Workshop</option>
                <option value="cypher"   className="bg-black">Cypher</option>
                <option value="jam"      className="bg-black">Jam</option>
                <option value="other"    className="bg-black">Outro</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Data *</label>
                <input type="date" name="event_date" required value={formData.event_date} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hora</label>
                <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Localização *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Preço (€)</label>
                <input type="number" name="price" min="0" step="0.5" value={formData.price} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Máx. participantes</label>
                <input type="number" name="max_participants" min="1" value={formData.max_participants} onChange={handleChange}
                  placeholder="Sem limite" className={inputClass} />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-black text-red-400 uppercase tracking-widest text-center">— {errorMsg}</p>
            )}

            <button type="submit" disabled={saving}
              className="w-full bg-yellow-400 text-black py-4 font-black text-base uppercase tracking-widest hover:bg-yellow-300 disabled:opacity-60 transition-all">
              {saving ? 'A GUARDAR...' : 'GUARDAR ALTERAÇÕES →'}
            </button>
          </form>

          {/* Zona de perigo */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-4">— Zona de Perigo</h3>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full border border-red-400/40 text-red-400 py-4 font-black text-xs uppercase tracking-widest hover:bg-red-400/10 transition-all"
              >
                Apagar Evento
              </button>
            ) : (
              <div className="border border-red-400/40 p-6 text-center">
                <p className="text-sm font-black text-red-400 uppercase tracking-widest mb-2">— Tens a certeza?</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Esta ação não pode ser desfeita</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border border-white/30 text-white py-3 font-black text-xs uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-400 text-black py-3 font-black text-xs uppercase tracking-widest hover:bg-red-300 disabled:opacity-60 transition-all"
                  >
                    {deleting ? 'A apagar...' : 'Apagar'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}