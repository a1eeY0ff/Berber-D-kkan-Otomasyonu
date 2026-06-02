// =========================================================================
// BUSINESS LAYER — Berber İş Mantığı
// =========================================================================

import * as berberDal from '../dal/berber.dal';
import { Berber } from '../types';

export async function berberEkle(
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string,
  sifreHash: string
): Promise<number> {
  if (!ad || !soyad || !telefon || !eposta || !sifreHash) {
    throw new Error('Tüm alanlar zorunludur.');
  }
  return berberDal.berberEkle(ad, soyad, telefon, eposta, sifreHash);
}

export async function berberGuncelle(
  berberId: number,
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  if (!berberId || !ad || !soyad || !telefon) {
    throw new Error('Berber ID, ad, soyad ve telefon zorunludur.');
  }
  return berberDal.berberGuncelle(berberId, ad, soyad, telefon, eposta);
}

export async function berberSil(berberId: number): Promise<number> {
  if (!berberId) throw new Error('Berber ID zorunludur.');
  return berberDal.berberSil(berberId);
}

export async function berberListele(berberId?: number): Promise<Berber[]> {
  return berberDal.berberListele(berberId);
}

export async function berberGiris(eposta: string): Promise<Berber | null> {
  if (!eposta) throw new Error('E-posta zorunludur.');
  return berberDal.berberGiris(eposta);
}
