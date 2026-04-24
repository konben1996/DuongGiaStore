CREATE DATABASE IF NOT EXISTS duonggiaphat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE duonggiaphat;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price BIGINT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  image VARCHAR(500) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  customer VARCHAR(255) NOT NULL,
  total BIGINT NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, name, phone, role)
VALUES (
  'admin@dgstore.local',
  '$2a$10$QX7Qx3GfG2D4u6L4JQ8h0eO7xw5B9C6uL0Jx1kXgPq0q0q0q0q0qO',
  'Administrator',
  '0900000000',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO products (name, category, price, stock, image, is_active)
VALUES
  ('HP Omen 15-dh0172TX Gaming Laptop','gaming-laptop',42800000,0,'assets/images/gaming-laptop/hp-omen-15/hp-omen-15.jpg',1),
  ('Acer Predator Helios 300 PH315-52-78HH','gaming-laptop',34500000,0,'assets/images/gaming-laptop/acer-predator-helios/acer-predator-helios.jpg',1),
  ('ASUS ROG Zephyrus M GU502GU-AZ090T','gaming-laptop',31600000,0,'assets/images/gaming-laptop/rog-zephyrus-m/rog-zephyrus-m.jpg',1),
  ('ASUS TUF Gaming FX705DT-H7138T','gaming-laptop',42000000,0,'assets/images/gaming-laptop/asus-tuf-fx705/asus-tuf-fx705.jpg',1),
  ('Acer Swift 7 SF714-52T-7134 Laptop Black','office-laptop',48000000,0,'assets/images/office-laptop/acer-swift-7/acer-swift-7.jpg',1),
  ('LG Gram 17Z90N-V.AH75A5 Laptop Silver','office-laptop',38000000,0,'assets/images/office-laptop/lg-gram-17/lg-gram-17.jpg',1),
  ('ASUS VivoBook 15 A512FA-EJ1281T Laptop','office-laptop',13600000,0,'assets/images/office-laptop/asus-vivobook-15/asus-vivobook-15.jpg',1),
  ('MSI Modern 15 A10M-068VN Laptop','office-laptop',16800000,0,'assets/images/office-laptop/msi-modern-15/msi-modern-15.jpg',1),
  ('LG Gram 14ZD90N-V.AX55A5 Laptop','office-laptop',28000000,0,'assets/images/office-laptop/lg-gram-14/lg-gram-14.jpg',1),
  ('Máy tính chơi game PCAP Apollo','gaming-pc',13500000,0,'assets/images/gaming-pc/pcap-apollo/pcap-apollo.jpg',1),
  ('Máy tính đa tác vụ PCAP Styx','gaming-pc',13500000,0,'assets/images/gaming-pc/pcap-styx/pcap-styx.jpg',1),
  ('Máy tính đa tác vụ PCAP Iris','gaming-pc',23500000,0,'assets/images/gaming-pc/pcap-iris/pcap-iris.jpg',1),
  ('Máy tính chơi game PCAP Poseidon','gaming-pc',23500000,0,'assets/images/gaming-pc/pcap-poseidon/pcap-poseidon.jpg',1),
  ('Máy tính chơi game PCAP Jupiter','gaming-pc',20500000,0,'assets/images/gaming-pc/pcap-jupiter/pcap-jupiter.jpg',1),
  ('Máy tính chơi game PCAP ASUS STRIX ULTRA 1','gaming-pc',33500000,0,'assets/images/gaming-pc/asus-strix-ultra/asus-strix-ultra.jpg',1),
  ('Tai nghe Asus ROG Cetra Core','accessory',990000,0,'assets/images/accessory/asus-rog-cetra-core/asus-rog-cetra-core.jpg',1),
  ('Tai nghe Asus TUF H3 Red','accessory',990000,0,'assets/images/accessory/asus-tuf-h3/asus-tuf-h3.jpg',1),
  ('Bàn phím cơ IKBC CD108 PD Blue Switch','accessory',990000,0,'assets/images/accessory/ikbc-cd108/ikbc-cd108.jpg',1),
  ('Ghế game DXRacer Valkyrie Series GC','accessory',990000,0,'assets/images/accessory/dxracer-valkyrie/dxracer-valkyrie.jpg',1)
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  price = VALUES(price),
  stock = VALUES(stock),
  image = VALUES(image),
  is_active = VALUES(is_active);

INSERT INTO orders (code, customer, total, status, created_at)
VALUES (
  'DH-0001',
  'Nguyễn Văn A',
  45990000,
  'pending',
  '2026-04-24 08:30:00'
)
ON DUPLICATE KEY UPDATE
  customer = VALUES(customer),
  total = VALUES(total),
  status = VALUES(status),
  created_at = VALUES(created_at);
