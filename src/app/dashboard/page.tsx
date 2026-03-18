// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-black text-indigo-900">
            DANCEHUB
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/artists" 
              className={`font-bold ${pathname === '/artists' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Comunidade
            </Link>
            <Link 
              href="/events" 
              className={`font-bold ${pathname === '/events' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Eventos
            </Link>
            
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}