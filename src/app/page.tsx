// Tenta importar sem as chavetas agora, já que adicionámos o 'export default'
import supabase from '../lib/supabase';

export default async function ArtistasPage() {
  // Vamos testar a ligação com uma query simples
  const { data: artistas, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    return <div className="p-8 text-red-500">Erro na base de dados: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Artistas</h1>
      <pre className="bg-gray-100 p-4 rounded text-black">
        {JSON.stringify(artistas, null, 2)}
      </pre>
    </div>
  );
}