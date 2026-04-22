import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/10">
        <span className="text-2xl font-black tracking-widest text-yellow-400 uppercase">UrbanCypher</span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-yellow-400 text-black px-6 py-2.5 font-black text-sm uppercase tracking-widest hover:bg-yellow-300 transition-all"
          >
            Registar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-24 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em] mb-8">
            — Plataforma da cena urbana portuguesa
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter uppercase mb-0">
            A CENA
          </h1>
          <h1 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter uppercase text-yellow-400 mb-0">
            TODA
          </h1>
          <h1 className="text-7xl md:text-[10rem] font-black leading-none tracking-tighter uppercase mb-10">
            NUM SÓ LUGAR.
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-gray-400 text-lg max-w-md leading-relaxed border-l-2 border-yellow-400 pl-4">
              Battles, workshops, perfis de artistas, marcos de carreira.
              Tudo o que a cena urbana portuguesa precisava.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="bg-yellow-400 text-black px-8 py-4 font-black text-base uppercase tracking-widest hover:bg-yellow-300 transition-all"
              >
                Entrar na Cena →
              </Link>
              <Link
                href="/events"
                className="border border-white/30 text-white px-8 py-4 font-black text-base uppercase tracking-widest hover:border-white transition-all"
              >
                Ver Eventos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 py-16 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/10">
          {[
            { value: 'ARTISTAS', sub: 'com perfis profissionais' },
            { value: 'BATTLES', sub: 'e eventos por todo o país' },
            { value: 'MARCOS', sub: 'registados na plataforma' },
          ].map((s) => (
            <div key={s.value} className="px-8 first:pl-0 last:pr-0">
              <div className="text-3xl font-black text-yellow-400 uppercase tracking-wide mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-0.5 bg-yellow-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">Para quem é</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              {
                num: '01',
                title: 'ARTISTAS',
                items: [
                  'Perfil profissional com bio e contactos',
                  'Historial de battles, vitórias e workshops',
                  'Sê descoberto por organizadores',
                ],
              },
              {
                num: '02',
                title: 'ORGANIZADORES',
                items: [
                  'Cria e gere eventos facilmente',
                  'Define preços, datas e localização',
                  'Liga jurados, hosts e DJs ao evento',
                ],
              },
              {
                num: '03',
                title: 'PÚBLICO',
                items: [
                  'Descobre eventos na tua cidade',
                  'Segue os teus artistas favoritos',
                  'Fica a par da cena urbana PT',
                ],
              },
            ].map((card) => (
              <div key={card.title} className="p-8 md:first:pl-0 md:last:pr-0">
                <div className="text-6xl font-black text-white/10 mb-4 leading-none">{card.num}</div>
                <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest mb-6">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-400 text-sm">
                      <span className="text-yellow-400 font-black mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
              PRONTO PARA<br />
              <span className="text-yellow-400">ENTRAR?</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 min-w-fit">
            <p className="text-gray-500 text-sm max-w-xs">
              Regista-te grátis e começa a construir o teu nome na cena.
            </p>
            <Link
              href="/register"
              className="bg-yellow-400 text-black px-10 py-5 font-black text-lg uppercase tracking-widest hover:bg-yellow-300 transition-all text-center"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-yellow-400 font-black text-lg tracking-widest uppercase">UrbanCypher</span>
          <p className="text-gray-600 text-xs uppercase tracking-widest">
            Feito para a cena urbana portuguesa
          </p>
          <div className="flex gap-6">
            <Link href="/artists" className="text-gray-600 hover:text-gray-400 text-xs font-black uppercase tracking-widest">Artistas</Link>
            <Link href="/events" className="text-gray-600 hover:text-gray-400 text-xs font-black uppercase tracking-widest">Eventos</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-400 text-xs font-black uppercase tracking-widest">Entrar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
