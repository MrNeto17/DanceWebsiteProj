import './globals.css'
import Navbar from '@/components/Navbar' // O '@' aponta para a pasta 'src'

export const metadata = {
  title: 'DanceHub - Comunidade de Dança',
  description: 'Eventos e Freelance para bailarinos em Portugal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  )
}