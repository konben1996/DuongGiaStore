const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'duonggiaphat',
  });

  try {
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM orders');
    console.log('COUNT', countRows[0].total);

    const [rows] = await pool.query(
      'SELECT id, code, customer, products, total, status, created_at, updated_at FROM orders ORDER BY id DESC LIMIT 10'
    );
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('ERR', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
