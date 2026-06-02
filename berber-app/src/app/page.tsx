import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center', 
        borderBottom: '1px solid var(--color-border)',
        backgroundImage: 'linear-gradient(rgba(26, 26, 46, 0.9), rgba(26, 26, 46, 0.9)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
            Klasik Berber Deneyimi
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--color-text-secondary)' }}>
            Usta ellerde şekillenen saçlar ve özenli sakal bakımı için doğru adrestesiniz. 
            Hemen online randevunuzu alın, beklemeden tıraş olun.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/randevu" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Hemen Randevu Al
            </Link>
          </div>
        </div>
      </section>

      {/* Hizmetler Özeti */}
      <section id="hizmetler" style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
            Öne Çıkan <span className="text-accent">Hizmetlerimiz</span>
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✂️</div>
              <h3>Saç Kesimi</h3>
              <p className="text-muted mb-4">Modern ve klasik saç kesim modelleri ile tarzınızı yansıtın.</p>
              <div className="text-accent" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>250 ₺</div>
            </div>
            
            <div className="card text-center" style={{ borderColor: 'var(--color-accent)', transform: 'translateY(-10px)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪒</div>
              <h3>Sakal Tıraşı</h3>
              <p className="text-muted mb-4">Klasik ustura tıraşı ve modern sakal şekillendirme.</p>
              <div className="text-accent" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>150 ₺</div>
            </div>
            
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧴</div>
              <h3>Cilt Bakımı</h3>
              <p className="text-muted mb-4">Siyah nokta temizliği, maske ve yüz masajı ile cildinizi yenileyin.</p>
              <div className="text-accent" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>350 ₺</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-surface)', padding: '3rem 0', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <div className="container">
          <h3 className="text-accent">Usta Berber</h3>
          <p className="text-muted mt-2">İstanbul'un en iyi erkek kuaförü.</p>
          <p className="text-muted mt-4" style={{ fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} Usta Berber. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}
