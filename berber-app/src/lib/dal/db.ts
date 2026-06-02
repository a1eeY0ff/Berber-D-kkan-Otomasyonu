// =========================================================================
// DATA ACCESS LAYER — MySQL Bağlantı Havuzu
// =========================================================================
// Tüm veritabanı işlemleri bu bağlantı üzerinden,
// YALNIZCA Stored Procedure çağrılarıyla yapılır.

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'berber_otomasyon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
