// =========================================================================
// DATA ACCESS LAYER — Müşteri İşlemleri
// =========================================================================
// Tüm işlemler Stored Procedure üzerinden yapılır.
// Doğrudan SQL (SELECT/INSERT/UPDATE/DELETE) KULLANILMAZ.

import pool from './db';
import { Musteri } from '../types';
import { RowDataPacket } from 'mysql2';

export async function musteriEkle(
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusteriEkle(?, ?, ?, ?)',
    [ad, soyad, telefon, eposta]
  );
  return (rows as RowDataPacket[][])[0][0].musteri_id;
}

export async function musteriGuncelle(
  musteriId: number,
  ad: string,
  soyad: string,
  telefon: string,
  eposta: string
): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusteriGuncelle(?, ?, ?, ?, ?)',
    [musteriId, ad, soyad, telefon, eposta]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function musteriSil(musteriId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusteriSil(?)',
    [musteriId]
  );
  return (rows as RowDataPacket[][])[0][0].etkilenen_satir;
}

export async function musteriListele(musteriId?: number): Promise<Musteri[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusteriListele(?)',
    [musteriId || null]
  );
  return (rows as RowDataPacket[][])[0] as Musteri[];
}

export async function musteriTelefonIleAra(telefon: string): Promise<Musteri | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'CALL sp_MusteriTelefonIleAra(?)',
    [telefon]
  );
  const result = (rows as RowDataPacket[][])[0];
  return result.length > 0 ? (result[0] as Musteri) : null;
}
