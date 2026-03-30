'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

type Profile = {
  artistic_name: string;
  avatar_url: string;
  user_type: 'user' | 'artist' | 'organizer';
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    loadUser();
  }, [pathname]); // recarrega ao mudar de página

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAuthChecked(true); return; }

    const { data } = await supabase
      .from('profiles')
      .select('artistic_name, avatar_url, user_type')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setAuthChecked(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`font-bold transition-colors ${
        isActive(href)
          ? 'text-indigo-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  // Não mostra navbar em páginas de auth ou onboarding
  const hiddenRoutes = ['/login', '/register', '/onboarding', '/choose-role'];
  if (pathname === '/' || hiddenRoutes.some(r => pathname.startsWith(r))) return null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/feed" className="text-2xl font-black text-indigo-900 tracking-tight">
            DANCEHUB
          </Link>

          {/* Links centrais — desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/feed', 'Feed')}
            {navLink('/artists', 'Artistas')}
            {navLink('/events', 'Eventos')}
          </div>

          {/* Lado direito */}
          <div className="flex items-center gap-3">
            {!authChecked ? (
              // Placeholder enquanto carrega
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
            ) : profile ? (
              // Utilizador autenticado
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-all"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      profile.artistic_name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <span className="font-bold text-gray-700 text-sm hidden sm:block max-w-24 truncate">
                    {profile.artistic_name || 'Perfil'}
                  </span>
                  <span className="text-gray-400 text-xs">▾</span>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <>
                    {/* Overlay para fechar */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400 font-medium">Conta</p>
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {profile.artistic_name || 'Utilizador'}
                        </p>
                        <span className="text-xs text-indigo-600 font-bold">
                          {profile.user_type === 'artist' ? '🕺 Artista'
                            : profile.user_type === 'organizer' ? '🎪 Organizador'
                            : 'Membro'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile/me"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >
                          👤 O meu perfil
                        </Link>
                        <Link
                          href="/profile/edit"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                        >
                          ✏️ Editar perfil
                        </Link>
                        {profile.user_type === 'organizer' && (
                          <Link
                            href="/events/create"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50"
                          >
                            ➕ Criar evento
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-50 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50"
                        >
                          🚪 Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Não autenticado
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="font-bold text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm"
                >
                  Registar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
