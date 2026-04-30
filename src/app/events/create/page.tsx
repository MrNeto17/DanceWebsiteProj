'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabase';
import StylesSelector from '../../../components/StyleSelector';
import Link from 'next/link';

const BATTLE_FORMATS = ['1v1', '2v2', '3v3', 'crew', 'solo'];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [styles, setStyles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'battle',
    event_date: '',
    event_time: '',
    location: '',
    price: '0',
    max_participants: '',
    battle_format: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/login'); return; }

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'organizer') { router.replace('/feed'); return; }
    setAuthChecked(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const eventDatetime = formData.event_time
        ? `${formData.event_date}T${formData.event_time}:00`
        : `${formData.event_date}T00:00:00`;

      const { data, error } = await supabase
        .from('events')
        .insert({
          creator_id:       user.id,
          title:            formData.title,
          description:      formData.description,
          event_type:       formData.event_type,
          event_date:       eventDatetime,
          location:         formData.location,
          price:            parseFloat(formData.price) || 0,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          styles:           styles,
          battle_format:    formData.battle_format || null,
        })
        .select()
        .single();

      if (error) throw error;
      router.push(`/events/${data.id}`);

    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  }

  const isBattle = formData.event_type === 'battle';

  if (!authChecked) {
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
          <Link href="/feed" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-yellow-400 transition-colors">
            ← Voltar
          </Link>
        </div>

        <div className="border border-white/10 p-8 md:p-10">
          <div className="mb-10">
            <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-2">— Área do Organizador</div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
              Criar<br /><span className="text-yellow-400">Evento.</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-3">Preenche os detalhes do teu evento</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className={labelClass}>Nome do Evento *</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange}
                placeholder="Ex: Lisboa B-Boy Session 2025" className={inputClass} />
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

            {isBattle && (
              <div>
                <label className={labelClass}>Formato da Battle</label>
                <select name="battle_format" value={formData.battle_format} onChange={handleChange} className={inputClass}>
                  <option value="" className="bg-black">Seleciona o formato</option>
                  {BATTLE_FORMATS.map(f => (
                    <option key={f} value={f} className="bg-black">{f.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={labelClass}>Estilos {isBattle ? 'da Battle' : 'do Evento'}</label>
              <StylesSelector selected={styles} onChange={setStyles} />
              {styles.length > 0 && (
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-3">— {styles.length} estilo(s) selecionado(s)</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Data *</label>
                <input type="date" name="event_date" required value={formData.event_date} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hora</label>
                <input type="time" name="event_time" value={formData.event_time} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Localização *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange}
                placeholder="Ex: Lisboa, Pavilhão Carlos Lopes" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Descrição</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                placeholder="Descreve o evento, categorias, regras..."
                className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Preço (€)</label>
                <input type="number" name="price" min="0" step="0.5" value={formData.price} onChange={handleChange} className={inputClass} />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">— 0 = gratuito</p>
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

            <button type="submit" disabled={loading}
              className="w-full bg-yellow-400 text-black py-4 font-black text-base uppercase tracking-widest hover:bg-yellow-300 disabled:opacity-60 transition-all">
              {loading ? 'A CRIAR...' : 'CRIAR EVENTO →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}