'use client';

import { useState, useEffect } from 'react';
import { Hizmet } from '@/lib/types';

export default function AdminHizmetler() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Yeni hizmet ekleme formu state'i
  const [form, setForm] = useState({
    hizmet_adi: '',
    sure_dakika: 30,
    ucret: ''
  });

  const fetchHizmetler = async () => {
    try {
      // Tüm hizmetleri getir (pasif olanlar dahil)
      const res = await fetch('/api/hizmetler?tumu=true');
      const data = await res.json();
      if (data.success) {
        setHizmetler(data.data);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHizmetler();
  }, []);

  const handleEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/hizmetler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setForm({ hizmet_adi: '', sure_dakika: 30, ucret: '' });
        fetchHizmetler();
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      alert('İşlem sırasında hata oluştu.');
    }
  };

  const handleDurumGuncelle = async (hizmet: Hizmet) => {
    try {
      const res = await fetch('/api/hizmetler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hizmet, aktif_mi: !hizmet.aktif_mi })
      });
      const data = await res.json();
      if (data.success) {
        fetchHizmetler();
      }
    } catch (error) {
      alert('Hata oluştu.');
    }
  };

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Hizmet <span className="text-accent">Yönetimi</span></h2>
      
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        
        {/* Yeni Hizmet Ekleme Formu */}
        <div className="card h-fit">
          <h3 className="mb-4">Yeni Hizmet Ekle</h3>
          <form onSubmit={handleEkle}>
            <div className="form-group">
              <label className="form-label">Hizmet Adı</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={form.hizmet_adi}
                onChange={e => setForm({...form, hizmet_adi: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Süre (Dakika)</label>
              <input 
                type="number" 
                className="form-input" 
                required 
                min="5" step="5"
                value={form.sure_dakika}
                onChange={e => setForm({...form, sure_dakika: Number(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ücret (₺)</label>
              <input 
                type="number" 
                className="form-input" 
                required 
                min="0" step="10"
                value={form.ucret}
                onChange={e => setForm({...form, ucret: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Ekle</button>
          </form>
        </div>

        {/* Hizmet Listesi */}
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Hizmet Adı</th>
                  <th>Süre (Dk)</th>
                  <th>Ücret (₺)</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {hizmetler.map(h => (
                  <tr key={h.hizmet_id} style={{ opacity: h.aktif_mi ? 1 : 0.6 }}>
                    <td style={{ fontWeight: 'bold' }}>{h.hizmet_adi}</td>
                    <td>{h.sure_dakika}</td>
                    <td className="text-accent" style={{ fontWeight: 'bold' }}>{h.ucret} ₺</td>
                    <td>
                      {h.aktif_mi ? <span className="badge badge-onaylandi">Aktif</span> : <span className="badge badge-iptal">Pasif</span>}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDurumGuncelle(h)} 
                        className={h.aktif_mi ? "btn-danger" : "btn-secondary"} 
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {h.aktif_mi ? 'Pasife Al' : 'Aktifleştir'}
                      </button>
                    </td>
                  </tr>
                ))}
                {hizmetler.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">Henüz hizmet eklenmemiş.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
