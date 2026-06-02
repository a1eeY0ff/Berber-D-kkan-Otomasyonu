// =========================================================================
// DATA ACCESS LAYER — Berber İşlemleri
// =========================================================================
// Tüm işlemler Stored Procedure üzerinden yapılır.
// Doğrudan SQL (SELECT/INSERT/UPDATE/DELETE) KULLANILMAZ.

import pool from './db';
import { Berber } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function berberEkle(
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string,
  sifreHash: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_BerberEkle(?, ?, ?, ?, ?)',
    [ad, soyad, telefon, eposta, sifreHash]
  );
  return (rows as RowDataPacket[][])[0][0].berber_id;
}

export async function berberGuncelle(
  berberId: number,
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_BerberGuncelle(?, ?, ?, ?, ?)',
    [berberId, ad, soyad, telefon, eposta]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function berberSil(berberId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_BerberSil(?)',
    [berberId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function berberListele(berberId?: number): Promise<Berber[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_BerberListele(?)',
    [berberId || null]
  );
  return (rows as RowDataPacket[][])[0] as Berber[];
}

export async function berberGiris(eposta: string): Promise<Berber | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_BerberGiris(?)',
    [eposta]
  );
  const result = (rows as RowDataPacket[][])[0];
  return result.length > 0 ? (result[0] as Berber) : null;
}
