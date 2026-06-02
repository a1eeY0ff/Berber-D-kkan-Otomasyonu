'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Istatistikler, Randevu } from '@/lib/types';

export default function AdminDashboard() {
  const [istatistik, setIstatistik] = useState<Istatistikler | null>(null);
  const [bugununRandevulari, setBugununRandevulari] = useState<Randevu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const berberId = localStorage.getItem('berberId');
    if (!berberId) return;

    const fetchData = async () => {
      try {
        const bugun = new Date().toISOString().split('T')[0];
        
        // İstatistikleri getir
        const resIst = await fetch(`/api/randevular?islem=istatistik&berber_id=${berberId}`);
        const dataIst = await resIst.json();
        if (dataIst.success) setIstatistik(dataIst.data);

        // Bugünün randevularını getir
        const resRandevu = await fetch(`/api/randevular?islem=gunluk&berber_id=${berberId}&tarih=${bugun}`);
        const dataRandevu = await resRandevu.json();
        if (dataRandevu.success) setBugununRandevulari(dataRandevu.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2>Yönetim <span className="text-accent">Paneli</span></h2>
        <button 
          onClick={() => { localStorage.removeItem('adminAuth'); window.location.href = '/'; }}
          className="btn-danger"
        >
          Çıkış Yap
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card text-center">
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Bugünün Randevuları</h3>
          <div className="text-accent" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {istatistik?.bugunun_randevulari || 0}
          </div>
        </div>
        <div className="card text-center">
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Bekleyen Randevular</h3>
          <div className="text-warning" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {istatistik?.bekleyen_randevular || 0}
          </div>
        </div>
        <div className="card text-center">
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Bu Ayki Kazanç</h3>
          <div className="text-success" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {istatistik?.aylik_kazanc || 0} ₺
          </div>
        </div>
        <div className="card text-center">
          <h3 className="text-muted" style={{ fontSize: '1rem' }}>Toplam Müşteri</h3>
          <div className="text-primary" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {istatistik?.toplam_musteri || 0}
          </div>
        </div>
      </div>

      {/* Bugünün Randevuları */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Bugünün Randevuları</h3>
          <Link href="/admin/randevular" className="text-accent">Tümünü Gör &rarr;</Link>
        </div>
        
        {bugununRandevulari.length === 0 ? (
          <p className="text-muted">Bugün için randevu bulunmamaktadır.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Saat</th>
                  <th>Müşteri</th>
                  <th>Telefon</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {bugununRandevulari.map(r => (
                  <tr key={r.randevu_id}>
                    <td style={{ fontWeight: 'bold' }}>{r.randevu_saati.substring(0, 5)}</td>
                    <td>{r.musteri_ad} {r.musteri_soyad}</td>
                    <td>{r.musteri_telefon}</td>
                    <td><span className={`badge badge-${r.durum}`}>{r.durum}</span></td>
                    <td>
                      <Link href={`/admin/randevular?id=${r.randevu_id}`} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
