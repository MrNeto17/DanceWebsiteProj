'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/feed');
      else setChecking(false);
    });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) { setError('As passwords não coincidem.'); return; }
    if (password.length < 6) { setError('Password com mínimo 6 caracteres.'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.push('/choose-role');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-md w-full border border-white/10 p-10">
        <div className="text-center mb-10">
          <Link href="/" className="text-xl font-black text-yellow-400 uppercase tracking-widest">UrbanCypher</Link>
          <div className="w-8 h-0.5 bg-yellow-400 mx-auto my-6" />
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Criar conta</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Junta-te à cena</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">Email</label>
            <input
              type="email" required placeholder="o_teu@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 outline-none focus:border-yellow-400 text-white placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">Password</label>
            <input
              type="password" required placeholder="Mínimo 6 caracteres" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 outline-none focus:border-yellow-400 text-white placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-yellow-400 uppercase tracking-[0.25em] mb-2">Confirmar Password</label>
            <input
              type="password" required placeholder="Repete a password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 outline-none focus:border-yellow-400 text-white placeholder:text-gray-600"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-black uppercase tracking-widest">— {error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-yellow-400 text-black py-4 font-black text-base uppercase tracking-widest hover:bg-yellow-300 transition-all disabled:opacity-60"
          >
            {loading ? 'A criar conta...' : 'Criar Conta →'}
          </button>

          <p className="text-center text-gray-500 text-xs uppercase tracking-widest pt-4 border-t border-white/10">
            Já tens conta?{' '}
            <Link href="/login" className="text-yellow-400 font-black hover:text-yellow-300">
              Entra aqui
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
