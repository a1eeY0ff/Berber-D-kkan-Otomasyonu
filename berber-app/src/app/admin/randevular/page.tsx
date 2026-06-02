'use client';

import { useState, useEffect } from 'react';
import { Randevu } from '@/lib/types';

export default function AdminRandevular() {
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRandevular = async () => {
    try {
      const res = await fetch('/api/randevular');
      const data = await res.json();
      if (data.success) {
        setRandevular(data.data);
      }
    } catch (error) {
      console.error('Randevu getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandevular();
  }, []);

  const handleDurumDegistir = async (id: number, yeniDurum: string) => {
    if (!confirm('Durumu değiştirmek istediğinize emin misiniz?')) return;
    
    try {
      const res = await fetch('/api/randevular', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ islem: 'durum', randevu_id: id, durum: yeniDurum })
      });
      const data = await res.json();
      if (data.success) {
        fetchRandevular(); // Listeyi yenile
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Randevu <span className="text-accent">Yönetimi</span></h2>
      
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Tarih / Saat</th>
                <th>Müşteri</th>
                <th>Telefon</th>
                <th>Tutar</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {randevular.map(r => (
                <tr key={r.randevu_id}>
                  <td>
                    <div>{new Date(r.randevu_tarihi).toLocaleDateString('tr-TR')}</div>
                    <div className="text-accent" style={{ fontWeight: 'bold' }}>{r.randevu_saati.substring(0, 5)}</div>
                  </td>
                  <td>{r.musteri_ad} {r.musteri_soyad}</td>
                  <td>{r.musteri_telefon}</td>
                  <td>{r.toplam_ucret} ₺</td>
                  <td><span className={`badge badge-${r.durum}`}>{r.durum}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {r.durum === 'beklemede' && (
                        <button onClick={() => handleDurumDegistir(r.randevu_id, 'onaylandi')} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>Onayla</button>
                      )}
                      {r.durum === 'onaylandi' && (
                        <button onClick={() => handleDurumDegistir(r.randevu_id, 'tamamlandi')} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>Tamamla</button>
                      )}
                      {(r.durum === 'beklemede' || r.durum === 'onaylandi') && (
                        <button onClick={() => handleDurumDegistir(r.randevu_id, 'iptal')} className="btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>İptal</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
