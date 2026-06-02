// =========================================================================
// DATA ACCESS LAYER — Çalışma Günleri İşlemleri
// =========================================================================
// Tüm işlemler Stored Procedure üzerinden yapılır.
// Doğrudan SQL (SELECT/INSERT/UPDATE/DELETE) KULLANILMAZ.

import pool from './db';
import { CalismaGunu } from '../types';
import { RowDataPacket } from 'mysql2';

export async function calismaGunuEkle(
  berberId: number,
  gunNo: number,
  baslangicSaati: string,
  bitisSaati: string,
  aktifMi: boolean
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_CalismaGunuEkle(?, ?, ?, ?, ?)',
    [berberId, gunNo, baslangicSaati, bitisSaati, aktifMi]
  );
  return (rows as RowDataPacket[][])[0][0].calisma_id;
}

export async function calismaGunuGuncelle(
  calismaId: number,
  baslangicSaati: string,
  bitisSaati: string,
  aktifMi: boolean
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_CalismaGunuGuncelle(?, ?, ?, ?)',
    [calismaId, baslangicSaati, bitisSaati, aktifMi]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function calismaGunuSil(calismaId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_CalismaGunuSil(?)',
    [calismaId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function calismaGunuListele(berberId: number): Promise<CalismaGunu[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_CalismaGunuListele(?)',
    [berberId]
  );
  return (rows as RowDataPacket[][])[0] as CalismaGunu[];
}
