'use client';

import { useState, useEffect } from 'react';
import { CalismaGunu, GUN_ISIMLERI } from '@/lib/types';

export default function AdminCalismaGunleri() {
  const [gunler, setGunler] = useState<CalismaGunu[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGunler = async () => {
    const berberId = localStorage.getItem('berberId');
    if (!berberId) return;
    
    try {
      const res = await fetch(`/api/calisma-gunleri?berber_id=${berberId}`);
      const data = await res.json();
      if (data.success) {
        setGunler(data.data);
      }
    } catch (error) {
      console.error('Hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGunler();
  }, []);

  const handleToggleAktif = async (gun: CalismaGunu) => {
    try {
      const res = await fetch('/api/calisma-gunleri', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          calisma_id: gun.calisma_id, 
          baslangic_saati: gun.baslangic_saati, 
          bitis_saati: gun.bitis_saati, 
          aktif_mi: !gun.aktif_mi 
        })
      });
      const data = await res.json();
      if (data.success) fetchGunler();
    } catch (error) {
      alert('Hata oluştu.');
    }
  };

  if (loading) return <div className="container mt-4">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Çalışma Saatleri <span className="text-accent">Yönetimi</span></h2>
      
      <div className="card">
        <p className="text-muted mb-4">Haftalık çalışma günlerinizi ve saatlerinizi buradan ayarlayabilirsiniz.</p>
        
        <div className="grid gap-4">
          {gunler.map(gun => (
            <div key={gun.calisma_id} className="flex justify-between items-center" style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-4">
                <div style={{ width: '100px', fontWeight: 'bold' }}>{GUN_ISIMLERI[gun.gun_no]}</div>
                {gun.aktif_mi ? (
                  <span className="badge badge-onaylandi">AÇIK</span>
                ) : (
                  <span className="badge badge-iptal">KAPALI</span>
                )}
              </div>
              
              <div className="flex gap-4 items-center">
                {gun.aktif_mi && (
                  <div className="flex gap-2 items-center">
                    <input type="time" defaultValue={gun.baslangic_saati.substring(0, 5)} className="form-input" style={{ width: 'auto', padding: '0.2rem' }} disabled />
                    <span> - </span>
                    <input type="time" defaultValue={gun.bitis_saati.substring(0, 5)} className="form-input" style={{ width: 'auto', padding: '0.2rem' }} disabled />
                  </div>
                )}
                
                <button 
                  onClick={() => handleToggleAktif(gun)} 
                  className={gun.aktif_mi ? "btn-danger" : "btn-secondary"} 
                  style={{ padding: '0.2rem 1rem' }}
                >
                  {gun.aktif_mi ? 'Kapat' : 'Aç'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
