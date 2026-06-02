// =========================================================================
// TÜM VERİTABANI VE UYGULAMA TİPLERİ
// =========================================================================

export interface Berber {
  berber_id: number;
  ad: string;
  soyad: string;
  telefon: string;
  eposta: string;
  sifre_hash?: string;
  olusturma_tarihi?: string;
}

export interface Musteri {
  musteri_id: number;
  ad: string;
  soyad: string;
  telefon: string;
  eposta: string;
  kayit_tarihi?: string;
}

export interface Hizmet {
  hizmet_id: number;
  hizmet_adi: string;
  sure_dakika: number;
  ucret: number;
  aktif_mi: boolean;
}

export interface CalismaGunu {
  calisma_id: number;
  berber_id: number;
  gun_no: number; // 0=Pazar, 1=Pazartesi ... 6=Cumartesi
  baslangic_saati: string;
  bitis_saati: string;
  aktif_mi: boolean;
}

export interface Randevu {
  randevu_id: number;
  musteri_id: number;
  berber_id: number;
  randevu_tarihi: string;
  randevu_saati: string;
  toplam_sure: number;
  toplam_ucret: number;
  durum: 'beklemede' | 'onaylandi' | 'tamamlandi' | 'iptal';
  notlar?: string;
  olusturma_tarihi?: string;
  // JOIN alanları
  musteri_ad?: string;
  musteri_soyad?: string;
  musteri_telefon?: string;
}

export interface RandevuHizmet {
  rh_id: number;
  randevu_id: number;
  hizmet_id: number;
  uygulanan_ucret: number;
  hizmet_adi?: string;
  sure_dakika?: number;
}

export interface IslemGecmisi {
  log_id: number;
  tablo_adi: string;
  islem_tipi: 'INSERT' | 'UPDATE' | 'DELETE';
  kayit_id: number;
  eski_deger?: string;
  yeni_deger?: string;
  islem_tarihi: string;
}

export interface Istatistikler {
  toplam_musteri: number;
  bugunun_randevulari: number;
  aylik_kazanc: number;
  bekleyen_randevular: number;
}

export interface MusaitSaat {
  baslangic_saati: string;
  bitis_saati: string;
  gun_aktif: boolean;
  dolu_saat: string | null;
  dolu_sure: number | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Gün isimleri (Türkçe)
export const GUN_ISIMLERI: Record<number, string> = {
  0: 'Pazar',
  1: 'Pazartesi',
  2: 'Salı',
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
  6: 'Cumartesi',
};
