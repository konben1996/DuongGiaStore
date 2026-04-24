const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'duonggiaphat',
  });

  try {
    try {
      await pool.query('ALTER TABLE orders ADD COLUMN products TEXT DEFAULT NULL AFTER customer');
      console.log('ALTER_OK');
    } catch (error) {
      console.log('ALTER_ERR', error.message);
    }

    const [rows] = await pool.query('SHOW COLUMNS FROM orders');
    console.log(JSON.stringify(rows.map((row) => row.Field), null, 2));
  } catch (error) {
    console.error('ERR', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
