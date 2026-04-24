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
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(100) NOT NULL UNIQUE,
      customer VARCHAR(255) NOT NULL,
      total BIGINT NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query('DELETE FROM orders');

  await pool.query(
    'INSERT INTO orders (code, customer, total, status, created_at) VALUES (?, ?, ?, ?, ?)',
    ['DH-0001', 'Nguyễn Văn A', 45990000, 'pending', '2026-04-24 08:30:00']
  );

  const [rows] = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
  console.log(`Seeded orders: ${rows[0].total_orders}`);
  await pool.end();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
