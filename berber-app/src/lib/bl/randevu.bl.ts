// =========================================================================
// BUSINESS LAYER — Randevu İş Mantığı
// =========================================================================

import * as randevuDal from '../dal/randevu.dal';
import { Randevu, MusaitSaat, RandevuHizmet, Istatistikler } from '../types';

export async function randevuEkle(
  musteriId: number,
  berberId: number,
  randevuTarihi: string,
  randevuSaati: string,
  notlar?: string
): Promise<number> {
  if (!musteriId || !berberId || !randevuTarihi || !randevuSaati) {
    throw new Error('Müşteri ID, berber ID, tarih ve saat zorunludur.');
  }

  // Geçmiş tarih kontrolü
  const secilen = new Date(randevuTarihi + 'T' + randevuSaati);
  const simdi = new Date();
  if (secilen < simdi) {
    throw new Error('Geçmiş bir tarih/saat için randevu alınamaz.');
  }

  return randevuDal.randevuEkle(musteriId, berberId, randevuTarihi, randevuSaati, notlar);
}

export async function randevuGuncelle(
  randevuId: number,
  randevuTarihi: string,
  randevuSaati: string,
  durum: string,
  notlar?: string
): Promise<number> {
  if (!randevuId) throw new Error('Randevu ID zorunludur.');
  return randevuDal.randevuGuncelle(randevuId, randevuTarihi, randevuSaati, durum, notlar);
}

export async function randevuSil(randevuId: number): Promise<number> {
  if (!randevuId) throw new Error('Randevu ID zorunludur.');
  return randevuDal.randevuSil(randevuId);
}

export async function randevuListele(randevuId?: number): Promise<Randevu[]> {
  return randevuDal.randevuListele(randevuId);
}

export async function randevuDurumGuncelle(
  randevuId: number,
  durum: string
): Promise<number> {
  if (!randevuId || !durum) throw new Error('Randevu ID ve durum zorunludur.');
  const gecerliDurumlar = ['beklemede', 'onaylandi', 'tamamlandi', 'iptal'];
  if (!gecerliDurumlar.includes(durum)) {
    throw new Error('Geçersiz durum değeri.');
  }
  return randevuDal.randevuDurumGuncelle(randevuId, durum);
}

export async function gunlukRandevular(tarih: string, berberId: number): Promise<Randevu[]> {
  if (!tarih || !berberId) throw new Error('Tarih ve berber ID zorunludur.');
  return randevuDal.gunlukRandevular(tarih, berberId);
}

export async function musaitSaatleriGetir(berberId: number, tarih: string): Promise<MusaitSaat[]> {
  if (!berberId || !tarih) throw new Error('Berber ID ve tarih zorunludur.');
  return randevuDal.musaitSaatleriGetir(berberId, tarih);
}

export async function randevuTarihAraliginda(
  berberId: number,
  baslangic: string,
  bitis: string
): Promise<Randevu[]> {
  return randevuDal.randevuTarihAraliginda(berberId, baslangic, bitis);
}

// Randevu Hizmet İşlemleri
export async function randevuHizmetEkle(randevuId: number, hizmetId: number): Promise<number> {
  if (!randevuId || !hizmetId) throw new Error('Randevu ID ve Hizmet ID zorunludur.');
  return randevuDal.randevuHizmetEkle(randevuId, hizmetId);
}

export async function randevuHizmetSil(rhId: number): Promise<number> {
  if (!rhId) throw new Error('Randevu Hizmet ID zorunludur.');
  return randevuDal.randevuHizmetSil(rhId);
}

export async function randevuHizmetListele(randevuId: number): Promise<RandevuHizmet[]> {
  return randevuDal.randevuHizmetListele(randevuId);
}

// İstatistikler
export async function istatistikleriGetir(berberId: number): Promise<Istatistikler> {
  if (!berberId) throw new Error('Berber ID zorunludur.');
  return randevuDal.istatistikleriGetir(berberId);
}
