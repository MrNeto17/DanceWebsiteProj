'use client';

import { useState } from 'react';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Criar user no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar user');

      // 2. Criar perfil automaticamente
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,      // MESMO ID do auth
          email: email,
          full_name: name,
          user_type: 'user',
          created_at: new Date(),
          updated_at: new Date()
        });

      if (profileError) throw profileError;

      // 3. Redirecionar para feed
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
        <h2 className="text-3xl font-black text-indigo-900 text-center mb-2">CRIAR CONTA</h2>
        <p className="text-gray-500 text-center mb-8">Regista-te para começares</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="O teu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="teu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="******"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm font-bold">{error}</p>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:bg-gray-300"
          >
            {loading ? 'A CRIAR...' : 'REGISTAR'}
          </button>
          
          <p className="text-center text-gray-600">
            Já tens conta?{' '}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}