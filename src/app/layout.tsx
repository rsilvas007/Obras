import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Obras ERP - Gestão de Obras',
  description: 'Sistema completo de gestão de obras e construção civil',
  keywords: ['ERP', 'obras', 'construção civil', 'gestão'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
