'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Basit admin koruması (Demo amaçlı localStorage kullanıyoruz)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('adminAuth') === 'true';
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const eposta = (form.elements.namedItem('eposta') as HTMLInputElement).value;
    const sifre = (form.elements.namedItem('sifre') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/berber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ islem: 'giris', eposta, sifre })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('berberId', data.data.berber_id.toString());
        setIsAuthenticated(true);
      } else {
        alert('Giriş başarısız: ' + data.error);
      }
    } catch (error) {
      alert('Bir hata oluştu.');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>;

  if (!isAuthenticated) {
    return (
      <main>
        <Navbar />
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 className="text-center text-accent mb-4">Yönetici Girişi</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input type="email" name="eposta" className="form-input" required defaultValue="ahmet@ustberber.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Şifre</label>
                <input type="password" name="sifre" className="form-input" required defaultValue="admin123" />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Giriş Yap</button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '2rem 0', backgroundColor: 'var(--color-bg)' }}>
        {children}
      </div>
    </main>
  );
}
