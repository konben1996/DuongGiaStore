CREATE DATABASE IF NOT EXISTS duonggiaphat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE duonggiaphat;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@gmail.com',
  '$2b$10$u1vXg3xKx7Q1b1PpQ8nZfO0a3JXQm1vQF0y9h5f2Gg8Xc1T9ZQ5Q5u',
  'Admin',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;
