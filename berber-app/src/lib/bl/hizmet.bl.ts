// =========================================================================
// BUSINESS LAYER — Hizmet İş Mantığı
// =========================================================================

import * as hizmetDal from '../dal/hizmet.dal';
import { Hizmet } from '../types';

export async function hizmetEkle(
  hizmetAdi: string,
  sureDakika: number,
  ucret: number
): Promise<number> {
  if (!hizmetAdi || !sureDakika || ucret === undefined) {
    throw new Error('Hizmet adı, süre ve ücret zorunludur.');
  }
  if (sureDakika <= 0) {
    throw new Error('Süre 0\'dan büyük olmalıdır.');
  }
  if (ucret < 0) {
    throw new Error('Ücret negatif olamaz.');
  }
  return hizmetDal.hizmetEkle(hizmetAdi, sureDakika, ucret);
}

export async function hizmetGuncelle(
  hizmetId: number,
  hizmetAdi: string,
  sureDakika: number,
  ucret: number,
  aktifMi: boolean
): Promise<number> {
  if (!hizmetId || !hizmetAdi || !sureDakika) {
    throw new Error('Hizmet ID, adı ve süresi zorunludur.');
  }
  return hizmetDal.hizmetGuncelle(hizmetId, hizmetAdi, sureDakika, ucret, aktifMi);
}

export async function hizmetSil(hizmetId: number): Promise<number> {
  if (!hizmetId) throw new Error('Hizmet ID zorunludur.');
  return hizmetDal.hizmetSil(hizmetId);
}

export async function hizmetListele(hizmetId?: number): Promise<Hizmet[]> {
  return hizmetDal.hizmetListele(hizmetId);
}

export async function tumHizmetlerListele(): Promise<Hizmet[]> {
  return hizmetDal.tumHizmetlerListele();
}
