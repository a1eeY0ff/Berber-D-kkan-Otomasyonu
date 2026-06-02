// =========================================================================
// DATA ACCESS LAYER — Hizmet İşlemleri
// =========================================================================
// Tüm işlemler Stored Procedure üzerinden yapılır.
// Doğrudan SQL (SELECT/INSERT/UPDATE/DELETE) KULLANILMAZ.

import pool from './db';
import { Hizmet } from '../types';
import { RowDataPacket } from 'mysql2';

export async function hizmetEkle(
  hizmetAdi: string,
  sureDakika: number,
  ucret: number
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_HizmetEkle(?, ?, ?)',
    [hizmetAdi, sureDakika, ucret]
  );
  return (rows as RowDataPacket[][])[0][0].hizmet_id;
}

export async function hizmetGuncelle(
  hizmetId: number,
  hizmetAdi: string,
  sureDakika: number,
  ucret: number,
  aktifMi: boolean
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_HizmetGuncelle(?, ?, ?, ?, ?)',
    [hizmetId, hizmetAdi, sureDakika, ucret, aktifMi]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function hizmetSil(hizmetId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_HizmetSil(?)',
    [hizmetId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function hizmetListele(hizmetId?: number): Promise<Hizmet[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_HizmetListele(?)',
    [hizmetId || null]
  );
  return (rows as RowDataPacket[][])[0] as Hizmet[];
}

export async function tumHizmetlerListele(): Promise<Hizmet[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_TumHizmetlerListele()'
  );
  return (rows as RowDataPacket[][])[0] as Hizmet[];
}
