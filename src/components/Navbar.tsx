'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    setUser(null);
  }

  return (
    <nav className="flex justify-between items-center p-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="text-2xl font-bold text-indigo-600 tracking-tighter">
        <Link href="/">DANCEHUB</Link>
      </div>
      
      <ul className="flex gap-8 text-gray-600 font-medium list-none">
        <li className="hover:text-indigo-600 transition-colors">
          <Link href="/events">Eventos</Link>
        </li>
        <li className="hover:text-indigo-600 transition-colors">
          <Link href="/artists">Artistas</Link>
        </li>
        
        {user && (
          <>
            <li className="hover:text-indigo-600 transition-colors">
              <Link href="/profile/me">Editar Perfil</Link>
            </li>
            <li className="hover:text-indigo-600 transition-colors">
              <Link href={`/profile/${user.id}`}>Ver Perfil</Link>
            </li>
          </>
        )}
      </ul>

      {!loading && (
        <div>
          {user ? (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-600 transition-all"
            >
              Sair
            </button>
          ) : (
            <Link 
              href="/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}