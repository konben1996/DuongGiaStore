const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    process.env[key] = value;
  });
}

loadEnvFile(path.join(__dirname, '.env'));

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'duonggiaphat',
    charset: 'utf8mb4',
  });

  await pool.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
  await pool.query(
    "UPDATE orders SET customer = ?, status = ?, total = ?, created_at = ? WHERE code = ?",
    ['Nguyễn Văn A', 'pending', 45990000, '2026-04-24 08:30:00', 'DH-0001']
  );

  const [rows] = await pool.query('SELECT id, code, customer, total, status, created_at FROM orders ORDER BY id DESC');
  console.log(JSON.stringify(rows, null, 2));
  await pool.end();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
