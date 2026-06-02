'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Hizmet, MusaitSaat } from '@/lib/types';

export default function RandevuAl() {
  const [adim, setAdim] = useState(1);
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [secilenHizmetler, setSecilenHizmetler] = useState<number[]>([]);
  
  const [tarih, setTarih] = useState('');
  const [saatler, setSaatler] = useState<MusaitSaat[]>([]);
  const [secilenSaat, setSecilenSaat] = useState('');
  
  const [musteri, setMusteri] = useState({ ad: '', soyad: '', telefon: '', eposta: '' });

  // 1. Adım: Hizmetleri getir
  useEffect(() => {
    fetch('/api/hizmetler')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Sanitize the data to remove circular references
          const sanitized = data.data.map((h: any) => ({
            hizmet_id: typeof h?.hizmet_id === 'number' ? h.hizmet_id : 0,
            hizmet_adi: h?.hizmet_adi ? String(h.hizmet_adi) : '',
            sure_dakika: typeof h?.sure_dakika === 'number' ? h.sure_dakika : 0,
            ucret: typeof h?.ucret === 'number' || typeof h?.ucret === 'string' ? Number(h.ucret) : 0,
            aktif_mi: Boolean(h?.aktif_mi),
          }));
          setHizmetler(sanitized);
        }
      })
      .catch(err => console.error('Error fetching services:', err));
    
    // Varsayılan tarih bugünden sonraki ilk gün
    const yarin = new Date();
    yarin.setDate(yarin.getDate() + 1);
    setTarih(yarin.toISOString().split('T')[0]);
  }, []);

  // 2. Adım: Tarih değiştiğinde saatleri getir
  useEffect(() => {
    if (!tarih) return;
    // Admin 1 ID'li berber için (senaryoda tek berber var)
    fetch(`/api/randevular?islem=musait&berber_id=1&tarih=${tarih}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          // Sanitize the data to remove circular references
          const sanitized = data.data.map((item: any) => ({
            baslangic_saati: item?.baslangic_saati ? String(item.baslangic_saati) : '',
            bitis_saati: item?.bitis_saati ? String(item.bitis_saati) : '',
            gun_aktif: Boolean(item?.gun_aktif),
            dolu_saat: item?.dolu_saat ? String(item.dolu_saat) : null,
            dolu_sure: typeof item?.dolu_sure === 'number' ? item.dolu_sure : null,
          }));
          console.log('musait saatler sanitized:', sanitized);
          setSaatler(sanitized);
          setSecilenSaat('');
        }
      })
      .catch(err => {
        console.error('Error fetching available hours:', err);
        setSaatler([]);
      });
  }, [tarih]);

  const toggleHizmet = (id: number) => {
    const sel = new Set(secilenHizmetler);
    if (sel.has(id)) {
      setSecilenHizmetler(secilenHizmetler.filter(hId => hId !== id));
    } else {
      setSecilenHizmetler([...secilenHizmetler, id]);
    }
  };

  const handleRandevuOlustur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Müşteri ekle
      const musteriRes = await fetch('/api/musteriler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(musteri)
      });
      const musteriData = await musteriRes.json();
      
      if (!musteriData.success) {
        alert('Müşteri kaydı oluşturulamadı: ' + musteriData.error);
        return;
      }
      
      const musteriId = musteriData.data.musteri_id;

      // 2. Randevuyu oluştur
      const randevuRes = await fetch('/api/randevular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musteri_id: musteriId,
          berber_id: 1, // Tek berber
          randevu_tarihi: tarih,
          randevu_saati: secilenSaat,
          hizmet_ids: secilenHizmetler
        })
      });
      
      const randevuData = await randevuRes.json();
      if (randevuData.success) {
        setAdim(4); // Başarı ekranı
      } else {
        alert('Randevu oluşturulamadı: ' + randevuData.error);
      }
    } catch (error) {
      alert('Bir hata oluştu.');
    }
  };

  const calculateTotal = () => {
    let total = 0;
    secilenHizmetler.forEach(id => {
      const h = hizmetler.find(x => x.hizmet_id === id);
      if (h) total += Number(h.ucret);
    });
    return total;
  };

  // Saat slotlarını render et
  const renderSaatler = () => {
    if (!saatler || !Array.isArray(saatler) || saatler.length === 0) {
      return <div className="text-center text-muted py-4">Yükleniyor...</div>;
    }
    
    const first = saatler[0];
    if (!first || !first.gun_aktif) {
      return <div className="text-center text-muted py-4">Bu tarihte dükkan kapalıdır.</div>;
    }

    try {
      const { baslangic_saati, bitis_saati } = first;
      if (!baslangic_saati || !bitis_saati) {
        return <div className="text-center text-muted py-4">Çalışma saatleri yok.</div>;
      }

      // Dolu saatleri güvenli bir şekilde çıkar
      const doluSaatSet = new Set<string>();
      if (Array.isArray(saatler)) {
        for (let i = 0; i < Math.min(saatler.length, 1000); i++) {
          const s = saatler[i];
          if (s && s.dolu_saat) {
            const saatStr = String(s.dolu_saat).substring(0, 5);
            if (saatStr.length === 5 && saatStr.includes(':')) {
              doluSaatSet.add(saatStr);
            }
          }
        }
      }

      const parts = String(baslangic_saati).split(':');
      const startH = parseInt(parts[0] || '0', 10);
      const startM = parseInt(parts[1] || '0', 10);
      
      const endParts = String(bitis_saati).split(':');
      const endH = parseInt(endParts[0] || '0', 10);
      const endM = parseInt(endParts[1] || '0', 10);

      let currentM = startH * 60 + startM;
      const endTotalM = endH * 60 + endM;
      const slots: React.ReactNode[] = [];

      const MAX_SLOTS = 48;
      let slotCount = 0;
      
      while (currentM < endTotalM && slotCount < MAX_SLOTS) {
        const h = Math.floor(currentM / 60).toString().padStart(2, '0');
        const m = (currentM % 60).toString().padStart(2, '0');
        const timeStr = `${h}:${m}`;

        const isDolu = doluSaatSet.has(timeStr);
        const buttonStyle: React.CSSProperties = {
          padding: '0.5rem',
          opacity: isDolu ? 0.3 : 1,
          cursor: isDolu ? 'not-allowed' : 'pointer',
        };
        
        const isSelected = secilenSaat === timeStr;
        slots.push(
          <button
            key={timeStr}
            onClick={() => setSecilenSaat(timeStr)}
            disabled={isDolu}
            className={isSelected ? 'btn-primary' : 'btn-secondary'}
            style={buttonStyle}
          >
            {timeStr}
          </button>
        );
        currentM += 30;
        slotCount += 1;
      }

      const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem'
      };

      return <div style={containerStyle}>{slots}</div>;
    } catch (err) {
      console.error('renderSaatler error:', err);
      return <div className="text-center text-muted py-4">Saat yükleme hatası: {err instanceof Error ? err.message : 'bilinmiyor'}</div>;
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container mt-4 mb-4 flex justify-center">
        <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
          
          <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className={adim >= 1 ? "text-accent" : "text-muted"}>1. Hizmet Seçimi</div>
            <div className={adim >= 2 ? "text-accent" : "text-muted"}>2. Tarih/Saat</div>
            <div className={adim >= 3 ? "text-accent" : "text-muted"}>3. Bilgiler</div>
          </div>

          {adim === 1 && (
            <div>
              <h2 className="mb-4">Hizmet <span className="text-accent">Seçimi</span></h2>
              <div className="grid gap-2 mb-4">
                {hizmetler.map(hizmet => (
                  <div 
                    key={hizmet.hizmet_id} 
                    className="card"
                    style={{ 
                      padding: '1rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: secilenHizmetler.includes(hizmet.hizmet_id) ? '1px solid var(--color-accent)' : '1px solid var(--color-border)'
                    }}
                    onClick={() => toggleHizmet(hizmet.hizmet_id)}
                  >
                    <div>
                      <h4 style={{ margin: 0 }}>{hizmet.hizmet_adi}</h4>
                      <small className="text-muted">{hizmet.sure_dakika} Dakika</small>
                    </div>
                    <div className="text-accent" style={{ fontWeight: 'bold' }}>{hizmet.ucret} ₺</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div style={{ fontSize: '1.2rem' }}>Toplam: <span className="text-accent" style={{ fontWeight: 'bold' }}>{calculateTotal()} ₺</span></div>
                <button 
                  className="btn-primary" 
                  disabled={secilenHizmetler.length === 0}
                  onClick={() => setAdim(2)}
                >
                  Devam Et &rarr;
                </button>
              </div>
            </div>
          )}

          {adim === 2 && (
            <div>
              <h2 className="mb-4">Tarih ve Saat <span className="text-accent">Seçimi</span></h2>
              
              <div className="form-group">
                <label className="form-label">Tarih Seçiniz</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={tarih}
                  onChange={(e) => setTarih(e.target.value)}
                />
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Saat Seçiniz</label>
                {renderSaatler()}
              </div>

              <div className="flex justify-between mt-4">
                <button className="btn-secondary" onClick={() => setAdim(1)}>&larr; Geri</button>
                <button 
                  className="btn-primary" 
                  disabled={!secilenSaat}
                  onClick={() => setAdim(3)}
                >
                  Devam Et &rarr;
                </button>
              </div>
            </div>
          )}

          {adim === 3 && (
            <div>
              <h2 className="mb-4">İletişim <span className="text-accent">Bilgileri</span></h2>
              <form onSubmit={handleRandevuOlustur}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Adınız</label>
                    <input type="text" className="form-input" required value={musteri.ad} onChange={e => setMusteri({...musteri, ad: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Soyadınız</label>
                    <input type="text" className="form-input" required value={musteri.soyad} onChange={e => setMusteri({...musteri, soyad: e.target.value})} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Telefon Numaranız</label>
                  <input type="tel" className="form-input" required value={musteri.telefon} onChange={e => setMusteri({...musteri, telefon: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">E-posta Adresiniz (Opsiyonel)</label>
                  <input type="email" className="form-input" value={musteri.eposta} onChange={e => setMusteri({...musteri, eposta: e.target.value})} />
                </div>

                <div className="card mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <h4 className="mb-2">Randevu Özeti</h4>
                  <p>Tarih: <strong className="text-accent">{tarih}</strong> Saat: <strong className="text-accent">{secilenSaat}</strong></p>
                  <p>Toplam Tutar: <strong className="text-accent">{calculateTotal()} ₺</strong></p>
                </div>

                <div className="flex justify-between">
                  <button type="button" className="btn-secondary" onClick={() => setAdim(2)}>&larr; Geri</button>
                  <button type="submit" className="btn-primary">Randevuyu Onayla</button>
                </div>
              </form>
            </div>
          )}

          {adim === 4 && (
            <div className="text-center py-4">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 className="text-success mb-2">Randevunuz Oluşturuldu!</h2>
              <p className="text-muted mb-4">
                Sayın {musteri.ad} {musteri.soyad}, randevunuz başarıyla alınmıştır.
                <br />Tarih: {tarih} | Saat: {secilenSaat}
              </p>
              <button className="btn-primary" onClick={() => window.location.href = '/'}>Ana Sayfaya Dön</button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
