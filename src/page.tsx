import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Navbar simples para landing */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-10">
        <span className="text-2xl font-black text-white tracking-tight">DANCEHUB</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-bold text-gray-400 hover:text-white transition-colors text-sm">
            Entrar
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition-all text-sm"
          >
            Registar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-16 pb-32">
        {/* Fundo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-4 py-2 rounded-full mb-8">
            🇵🇹 A plataforma da cena urbana portuguesa
          </div>

          {/* Título principal */}
          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-6">
            A CENA<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              TODA NUM
            </span><br />
            SÓ LUGAR.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Battles, workshops, perfis de artistas, marcos de carreira.
            Tudo o que a cena urbana portuguesa precisava — finalmente junto.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all"
            >
              Entrar na Cena →
            </Link>
            <Link
              href="/events"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all border border-white/10"
            >
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5 px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '🕺', label: 'Artistas', sub: 'com perfis profissionais' },
            { value: '⚔️', label: 'Battles', sub: 'e eventos por todo o país' },
            { value: '🏆', label: 'Marcos', sub: 'registados na plataforma' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl mb-2">{s.value}</div>
              <div className="text-xl font-black text-white">{s.label}</div>
              <div className="text-sm text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-12 text-center">Para quem é?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🕺',
                title: 'Artistas',
                color: 'border-indigo-500/30 bg-indigo-600/5',
                items: [
                  'Perfil profissional com bio e contactos',
                  'Historial de battles, vitórias e workshops',
                  'Sê descoberto por organizadores',
                ],
              },
              {
                emoji: '🎪',
                title: 'Organizadores',
                color: 'border-purple-500/30 bg-purple-600/5',
                items: [
                  'Cria e gere eventos facilmente',
                  'Define preços, datas e localização',
                  'Liga jurados, hosts e DJs ao evento',
                ],
              },
              {
                emoji: '👥',
                title: 'Público',
                color: 'border-gray-500/30 bg-white/5',
                items: [
                  'Descobre eventos na tua cidade',
                  'Segue os teus artistas favoritos',
                  'Fica a par da cena urbana PT',
                ],
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-3xl border p-8 ${card.color}`}>
                <div className="text-5xl mb-4">{card.emoji}</div>
                <h3 className="text-2xl font-black text-white mb-4">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-12">
            <h2 className="text-5xl font-black text-white mb-4">
              Pronto para entrar?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Regista-te gratis e começa a construir o teu nome na cena.
            </p>
            <Link
              href="/register"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-xl transition-all"
            >
              Criar Contaa Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-gray-600 font-black text-lg">DANCEHUB</span>
          <p className="text-gray-600 text-sm">
            Feito com 🕺 para a cena urbana portuguesa
          </p>
          <div className="flex gap-6">
            <Link href="/artists" className="text-gray-600 hover:text-gray-400 text-sm font-bold">Artistas</Link>
            <Link href="/events" className="text-gray-600 hover:text-gray-400 text-sm font-bold">Eventos</Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-400 text-sm font-bold">Entrar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
