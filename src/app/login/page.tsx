'use client';

import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Se já está autenticado, vai para o feed
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/feed');
      else setChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-indigo-900">DANCEHUB</Link>
          <h2 className="text-3xl font-black text-gray-900 mt-4 mb-1">Bem-vindo de volta</h2>
          <p className="text-gray-500">Acede à tua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email" required placeholder="o_teu@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password" required placeholder="A tua password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">❌ {error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all disabled:opacity-60"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Não tens conta?{' '}
            <Link href="/register" className="text-indigo-600 font-bold hover:underline">
              Regista-te grátis
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}