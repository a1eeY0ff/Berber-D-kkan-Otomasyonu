// =========================================================================
// BUSINESS LAYER — Çalışma Günleri İş Mantığı
// =========================================================================

import * as calismaDal from '../dal/calisma.dal';
import { CalismaGunu } from '../types';

export async function calismaGunuEkle(
  berberId: number,
  gunNo: number,
  baslangicSaati: string,
  bitisSaati: string,
  aktifMi: boolean
): Promise<number> {
  if (!berberId || gunNo === undefined) {
    throw new Error('Berber ID ve gün numarası zorunludur.');
  }
  if (gunNo < 0 || gunNo > 6) {
    throw new Error('Gün numarası 0-6 arasında olmalıdır.');
  }
  if (aktifMi && (!baslangicSaati || !bitisSaati)) {
    throw new Error('Aktif gün için başlangıç ve bitiş saati zorunludur.');
  }
  return calismaDal.calismaGunuEkle(berberId, gunNo, baslangicSaati, bitisSaati, aktifMi);
}

export async function calismaGunuGuncelle(
  calismaId: number,
  baslangicSaati: string,
  bitisSaati: string,
  aktifMi: boolean
): Promise<number> {
  if (!calismaId) throw new Error('Çalışma ID zorunludur.');
  return calismaDal.calismaGunuGuncelle(calismaId, baslangicSaati, bitisSaati, aktifMi);
}

export async function calismaGunuSil(calismaId: number): Promise<number> {
  if (!calismaId) throw new Error('Çalışma ID zorunludur.');
  return calismaDal.calismaGunuSil(calismaId);
}

export async function calismaGunuListele(berberId: number): Promise<CalismaGunu[]> {
  if (!berberId) throw new Error('Berber ID zorunludur.');
  return calismaDal.calismaGunuListele(berberId);
}
