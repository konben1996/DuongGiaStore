const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

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

  const [rows] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
  console.log(rows[0].total_products);
  await pool.end();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
