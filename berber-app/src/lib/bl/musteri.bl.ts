// =========================================================================
// BUSINESS LAYER — Müşteri İş Mantığı
// =========================================================================

import * as musteriDal from '../dal/musteri.dal';
import { Musteri } from '../types';

export async function musteriEkle(
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  if (!ad || !soyad || !telefon) {
    throw new Error('Ad, soyad ve telefon zorunludur.');
  }
  // Telefon format kontrolü
  if (telefon.length < 10) {
    throw new Error('Telefon numarası en az 10 karakter olmalıdır.');
  }
  return musteriDal.musteriEkle(ad, soyad, telefon, eposta);
}

export async function musteriGuncelle(
  musteriId: number,
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  if (!musteriId || !ad || !soyad || !telefon) {
    throw new Error('Müşteri ID, ad, soyad ve telefon zorunludur.');
  }
  return musteriDal.musteriGuncelle(musteriId, ad, soyad, telefon, eposta);
}

export async function musteriSil(musteriId: number): Promise<number> {
  if (!musteriId) throw new Error('Müşteri ID zorunludur.');
  return musteriDal.musteriSil(musteriId);
}

export async function musteriListele(musteriId?: number): Promise<Musteri[]> {
  return musteriDal.musteriListele(musteriId);
}

export async function musteriTelefonIleAra(telefon: string): Promise<Musteri | null> {
  if (!telefon) throw new Error('Telefon numarası zorunludur.');
  return musteriDal.musteriTelefonIleAra(telefon);
}
