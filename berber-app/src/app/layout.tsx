import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Usta Berber | Randevu Sistemi',
  description: 'Usta Berber dükkanı online randevu ve yönetim sistemi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
