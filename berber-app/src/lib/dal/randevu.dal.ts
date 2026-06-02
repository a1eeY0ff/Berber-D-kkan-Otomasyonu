// =========================================================================
// DATA ACCESS LAYER — Randevu İşlemleri
// =========================================================================
// Tüm işlemler Stored Procedure üzerinden yapılır.
// Doğrudan SQL (SELECT/INSERT/UPDATE/DELETE) KULLANILMAZ.

import pool from './db';
import { Randevu, MusaitSaat, RandevuHizmet, Istatistikler } from '../types';
import { RowDataPacket } from 'mysql2';

export async function randevuEkle(
  musteriId: number,
  berberId: number,
  randevuTarihi: string,
  randevuSaati: string,
  notlar?: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuEkle(?, ?, ?, ?, ?)',
    [musteriId, berberId, randevuTarihi, randevuSaati, notlar || null]
  );
  return (rows as RowDataPacket[][])[0][0].randevu_id;
}

export async function randevuGuncelle(
  randevuId: number,
  randevuTarihi: string,
  randevuSaati: string,
  durum: string,
  notlar?: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuGuncelle(?, ?, ?, ?, ?)',
    [randevuId, randevuTarihi, randevuSaati, durum, notlar || null]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function randevuSil(randevuId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuSil(?)',
    [randevuId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function randevuListele(randevuId?: number): Promise<Randevu[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuListele(?)',
    [randevuId || null]
  );
  return (rows as RowDataPacket[][])[0] as Randevu[];
}

export async function randevuDurumGuncelle(
  randevuId: number,
  durum: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuDurumGuncelle(?, ?)',
    [randevuId, durum]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function gunlukRandevular(
  tarih: string,
  berberId: number
): Promise<Randevu[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_GunlukRandevular(?, ?)',
    [tarih, berberId]
  );
  return (rows as RowDataPacket[][])[0] as Randevu[];
}

export async function musaitSaatleriGetir(
  berberId: number,
  tarih: string
): Promise<MusaitSaat[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusaitSaatleriGetir(?, ?)',
    [berberId, tarih]
  );
  return (rows as RowDataPacket[][])[0] as MusaitSaat[];
}

export async function randevuTarihAraliginda(
  berberId: number,
  baslangic: string,
  bitis: string
): Promise<Randevu[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuTarihAraliginda(?, ?, ?)',
    [berberId, baslangic, bitis]
  );
  return (rows as RowDataPacket[][])[0] as Randevu[];
}

// Randevu Hizmet İşlemleri
export async function randevuHizmetEkle(
  randevuId: number,
  hizmetId: number
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuHizmetEkle(?, ?)',
    [randevuId, hizmetId]
  );
  return (rows as RowDataPacket[][])[0][0].rh_id;
}

export async function randevuHizmetSil(rhId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuHizmetSil(?)',
    [rhId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function randevuHizmetListele(randevuId: number): Promise<RandevuHizmet[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_RandevuHizmetListele(?)',
    [randevuId]
  );
  return (rows as RowDataPacket[][])[0] as RandevuHizmet[];
}

// İstatistikler
export async function istatistikleriGetir(berberId: number): Promise<Istatistikler> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_Istatistikler(?)',
    [berberId]
  );
  const resultSets = rows as RowDataPacket[][];
  return {
    toplam_musteri: resultSets[0]?.[0]?.toplam_musteri || 0,
    bugunun_randevulari: resultSets[1]?.[0]?.bugunun_randevulari || 0,
    aylik_kazanc: resultSets[2]?.[0]?.aylik_kazanc || 0,
    bekleyen_randevular: resultSets[3]?.[0]?.bekleyen_randevular || 0,
  };
}
