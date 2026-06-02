'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <nav style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container flex justify-between items-center" style={{ height: '70px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            background: 'repeating-linear-gradient(45deg, #f44336, #f44336 5px, white 5px, white 10px, #1a1a2e 10px, #1a1a2e 15px)',
            border: '2px solid var(--color-accent)'
          }}></div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-accent)' }}>Usta Berber</h2>
        </Link>
        
        <div className="flex gap-4 items-center">
          {isAdmin ? (
            <>
              <Link href="/admin" style={{ color: pathname === '/admin' ? 'var(--color-accent)' : 'inherit' }}>Dashboard</Link>
              <Link href="/admin/randevular" style={{ color: pathname.includes('/randevular') ? 'var(--color-accent)' : 'inherit' }}>Randevular</Link>
              <Link href="/admin/hizmetler" style={{ color: pathname.includes('/hizmetler') ? 'var(--color-accent)' : 'inherit' }}>Hizmetler</Link>
              <Link href="/admin/calisma" style={{ color: pathname.includes('/calisma') ? 'var(--color-accent)' : 'inherit' }}>Çalışma Saatleri</Link>
              <Link href="/admin/musteriler" style={{ color: pathname.includes('/musteriler') ? 'var(--color-accent)' : 'inherit' }}>Müşteriler</Link>
              <Link href="/" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Siteye Dön</Link>
            </>
          ) : (
            <>
              <Link href="/">Ana Sayfa</Link>
              <Link href="/#hizmetler">Hizmetlerimiz</Link>
              <Link href="/admin" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Yönetim</Link>
              <Link href="/randevu" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Randevu Al</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
