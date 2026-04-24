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

const products = [
  ['HP Omen 15-dh0172TX Gaming Laptop', 'gaming-laptop', 42800000, 0, 'assets/images/gaming-laptop/hp-omen-15/hp-omen-15.jpg', 1],
  ['Acer Predator Helios 300 PH315-52-78HH', 'gaming-laptop', 34500000, 0, 'assets/images/gaming-laptop/acer-predator-helios/acer-predator-helios.jpg', 1],
  ['ASUS ROG Zephyrus M GU502GU-AZ090T', 'gaming-laptop', 31600000, 0, 'assets/images/gaming-laptop/rog-zephyrus-m/rog-zephyrus-m.jpg', 1],
  ['ASUS TUF Gaming FX705DT-H7138T', 'gaming-laptop', 42000000, 0, 'assets/images/gaming-laptop/asus-tuf-fx705/asus-tuf-fx705.jpg', 1],
  ['Acer Swift 7 SF714-52T-7134 Laptop Black', 'office-laptop', 48000000, 0, 'assets/images/office-laptop/acer-swift-7/acer-swift-7.jpg', 1],
  ['LG Gram 17Z90N-V.AH75A5 Laptop Silver', 'office-laptop', 38000000, 0, 'assets/images/office-laptop/lg-gram-17/lg-gram-17.jpg', 1],
  ['ASUS VivoBook 15 A512FA-EJ1281T Laptop', 'office-laptop', 13600000, 0, 'assets/images/office-laptop/asus-vivobook-15/asus-vivobook-15.jpg', 1],
  ['MSI Modern 15 A10M-068VN Laptop', 'office-laptop', 16800000, 0, 'assets/images/office-laptop/msi-modern-15/msi-modern-15.jpg', 1],
  ['LG Gram 14ZD90N-V.AX55A5 Laptop', 'office-laptop', 28000000, 0, 'assets/images/office-laptop/lg-gram-14/lg-gram-14.jpg', 1],
  ['Máy tính chơi game PCAP Apollo', 'gaming-pc', 13500000, 0, 'assets/images/gaming-pc/pcap-apollo/pcap-apollo.jpg', 1],
  ['Máy tính đa tác vụ PCAP Styx', 'gaming-pc', 13500000, 0, 'assets/images/gaming-pc/pcap-styx/pcap-styx.jpg', 1],
  ['Máy tính đa tác vụ PCAP Iris', 'gaming-pc', 23500000, 0, 'assets/images/gaming-pc/pcap-iris/pcap-iris.jpg', 1],
  ['Máy tính chơi game PCAP Poseidon', 'gaming-pc', 23500000, 0, 'assets/images/gaming-pc/pcap-poseidon/pcap-poseidon.jpg', 1],
  ['Máy tính chơi game PCAP Jupiter', 'gaming-pc', 20500000, 0, 'assets/images/gaming-pc/pcap-jupiter/pcap-jupiter.jpg', 1],
  ['Máy tính chơi game PCAP ASUS STRIX ULTRA 1', 'gaming-pc', 33500000, 0, 'assets/images/gaming-pc/asus-strix-ultra/asus-strix-ultra.jpg', 1],
  ['Tai nghe Asus ROG Cetra Core', 'accessory', 990000, 0, 'assets/images/accessory/asus-rog-cetra-core/asus-rog-cetra-core.jpg', 1],
  ['Tai nghe Asus TUF H3 Red', 'accessory', 990000, 0, 'assets/images/accessory/asus-tuf-h3/asus-tuf-h3.jpg', 1],
  ['Bàn phím cơ IKBC CD108 PD Blue Switch', 'accessory', 990000, 0, 'assets/images/accessory/ikbc-cd108/ikbc-cd108.jpg', 1],
  ['Ghế game DXRacer Valkyrie Series GC', 'accessory', 990000, 0, 'assets/images/accessory/dxracer-valkyrie/dxracer-valkyrie.jpg', 1],
];

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'duonggiaphat',
  });

  await pool.query('DELETE FROM products');
  await pool.query(
    'INSERT INTO products (name, category, price, stock, image, is_active) VALUES ?',
    [products]
  );

  const [rows] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
  console.log(`Seeded products: ${rows[0].total_products}`);
  await pool.end();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
