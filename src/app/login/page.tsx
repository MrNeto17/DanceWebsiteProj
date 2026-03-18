'use client';

import { useState } from 'react';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      router.push('/feed');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-black text-indigo-900 text-center mb-2">ENTRAR</h2>
        <p className="text-gray-500 text-center mb-8">Acede à tua conta</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            required
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            type="password" 
            required
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          {error && (
            <p className="text-red-500 text-sm font-bold">{error}</p>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-gray-300"
          >
            {loading ? 'A ENTRAR...' : 'ENTRAR'}
          </button>
          
          <p className="text-center text-gray-600">
            Não tens conta?{' '}
            <Link href="/register" className="text-indigo-600 font-bold hover:underline">
              Regista-te
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}