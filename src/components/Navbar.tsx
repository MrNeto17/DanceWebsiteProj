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
  }, [pathname]);

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
      className={`text-xs font-black uppercase tracking-widest transition-colors ${
        isActive(href)
          ? 'text-yellow-400'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  const hiddenRoutes = ['/login', '/register', '/onboarding', '/choose-role'];
  if (pathname === '/' || hiddenRoutes.some(r => pathname.startsWith(r))) return null;

  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/feed" className="text-xl font-black text-yellow-400 tracking-widest uppercase">
            UrbanCypher
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('/feed', 'Feed')}
            {navLink('/artists', 'Artistas')}
            {navLink('/events', 'Eventos')}
          </div>

          {/* Lado direito */}
          <div className="flex items-center gap-3">
            {!authChecked ? (
              <div className="w-8 h-8 bg-white/5 animate-pulse" />
            ) : profile ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 border border-white/20 hover:border-yellow-400 px-3 py-2 transition-all"
                >
                  <div className="w-7 h-7 overflow-hidden bg-yellow-400/20 flex items-center justify-center text-sm font-black text-yellow-400">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      profile.artistic_name?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>
                  <span className="font-black text-white text-xs uppercase tracking-widest hidden sm:block max-w-24 truncate">
                    {profile.artistic_name || 'Perfil'}
                  </span>
                  <span className="text-gray-500 text-xs">▾</span>
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-black border border-white/10 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Conta</p>
                        <p className="font-black text-white text-sm truncate mt-1">
                          {profile.artistic_name || 'Utilizador'}
                        </p>
                        <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">
                          {profile.user_type === 'artist' ? 'Artista'
                            : profile.user_type === 'organizer' ? 'Organizador'
                            : 'Membro'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile/me"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          O meu perfil
                        </Link>
                        <Link
                          href="/profile/edit"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          Editar perfil
                        </Link>
                        {profile.user_type === 'organizer' && (
                          <Link
                            href="/events/create"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 text-xs font-black uppercase tracking-widest text-yellow-400 hover:bg-yellow-400/10"
                          >
                            + Criar evento
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-white/10 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-400 text-black px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all"
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
