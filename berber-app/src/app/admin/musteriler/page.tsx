'use client';

import { useState, useEffect } from 'react';
import { Musteri } from '@/lib/types';

export default function AdminMusteriler() {
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusteriler = async () => {
      try {
        const res = await fetch('/api/musteriler');
        const data = await res.json();
        if (data.success) {
          setMusteriler(data.data);
        }
      } catch (error) {
        console.error('Hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusteriler();
  }, []);

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Müşteri <span className="text-accent">Listesi</span></h2>
      
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Telefon</th>
                <th>E-posta</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {musteriler.map(m => (
                <tr key={m.musteri_id}>
                  <td style={{ fontWeight: 'bold' }}>{m.ad} {m.soyad}</td>
                  <td>{m.telefon}</td>
                  <td>{m.eposta || '-'}</td>
                  <td>{m.kayit_tarihi ? new Date(m.kayit_tarihi).toLocaleDateString('tr-TR') : '-'}</td>
                </tr>
              ))}
              {musteriler.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted">Henüz kayıtlı müşteri bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
