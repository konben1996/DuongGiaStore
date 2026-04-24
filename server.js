require('dotenv').config();

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(__dirname));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'duonggiaphat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const memoryUsers = [];

function loadLocalProducts() {
  const files = [
    'js/data/products/gaming-laptop.js',
    'js/data/products/office-laptop.js',
    'js/data/products/gaming-pc.js',
    'js/data/products/accessory.js',
  ];

  const products = [];

  files.forEach((file) => {
    const filePath = path.join(__dirname, file);
    const source = fs.readFileSync(filePath, 'utf8');
    const sandbox = { window: { DuongGiaStoreProducts: {} } };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);
    const store = sandbox.window.DuongGiaStoreProducts || {};
    Object.values(store).forEach((group) => {
      if (Array.isArray(group.products)) {
        products.push(...group.products);
      }
    });
  });

  return products;
}

function normalizeProductForDb(product) {
  return {
    name: product.name,
    category: product.category,
    price: Number(product.price) || 0,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    image: product.image || null,
    is_active: 1,
  };
}

const CATEGORY_IMAGE_DIRS = {
  "gaming-laptop": path.join(__dirname, "assets/images/gaming-laptop"),
  "office-laptop": path.join(__dirname, "assets/images/office-laptop"),
  "gaming-pc": path.join(__dirname, "assets/images/gaming-pc"),
  accessory: path.join(__dirname, "assets/images/accessory"),
};

function resolveImageCategory(category, imageCategory) {
  return CATEGORY_IMAGE_DIRS[imageCategory] ? imageCategory : (CATEGORY_IMAGE_DIRS[category] ? category : "accessory");
}

function sanitizeFolderName(folderName) {
  return String(folderName || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDirectoryExists(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeImageFileName(originalName = "product-image.png") {
  const parsed = path.parse(originalName);
  const baseName = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product-image";
  const ext = (parsed.ext || ".png").toLowerCase();
  const suffix = crypto.randomBytes(4).toString("hex");
  return `${baseName}-${suffix}${ext}`;
}

function decodeDataUrlImage(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    throw new Error("Dữ liệu ảnh không hợp lệ");
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

function mimeTypeToExtension(mimeType) {
  const map = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };

  return map[mimeType.toLowerCase()] || ".png";
}

const seededAdminUser = {
  id: 999,
  email: 'admin@dgstore.local',
  password_hash: bcrypt.hashSync('admin123456', 10),
  name: 'Administrator',
  phone: '0900000000',
  role: 'admin',
  created_at: new Date().toISOString(),
};

function normalizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || null,
    role: user.role || 'user',
    created_at: user.created_at || new Date().toISOString(),
  };
}

async function getDbOrFallbackRows(query, params = []) {
  try {
    const [rows] = await pool.query(query, params);
    return { ok: true, rows };
  } catch (error) {
    return { ok: false, error };
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Thiếu token xác thực' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/register.html', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/api/health', async (req, res) => {
  const result = await getDbOrFallbackRows('SELECT 1 AS ok');
  if (result.ok) {
    return res.json({ ok: true, db: result.rows[0].ok === 1, message: 'Server is running' });
  }
  return res.json({ ok: true, db: false, fallback: true, message: 'Server is running without database' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Thiếu email, mật khẩu hoặc tên' });
    }

    const existingInMemory = memoryUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existingInMemory) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const dbCheck = await getDbOrFallbackRows('SELECT id FROM users WHERE email = ?', [email]);

    if (dbCheck.ok && dbCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (dbCheck.ok) {
      const [result] = await pool.query(
        'INSERT INTO users (email, password_hash, name, phone, role) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, name, phone || null, 'user']
      );

      return res.status(201).json({
        message: 'Tạo tài khoản thành công',
        user: {
          id: result.insertId,
          email,
          name,
          phone: phone || null,
          role: 'user',
        },
      });
    }

    const newUser = normalizeUser({
      id: memoryUsers.length + 1,
      email,
      name,
      role: 'user',
      created_at: new Date().toISOString(),
    });

    memoryUsers.push({
      ...newUser,
      password_hash: passwordHash,
    });

    return res.status(201).json({
      message: 'Tạo tài khoản thành công',
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const dbCheck = await getDbOrFallbackRows(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (dbCheck.ok && dbCheck.rows.length > 0) {
      return res.json({ user: dbCheck.rows[0] });
    }

    if (req.user.email && req.user.email.toLowerCase() === seededAdminUser.email.toLowerCase()) {
      return res.json({
        user: normalizeUser(seededAdminUser),
      });
    }

    const user = memoryUsers.find((item) => item.id === req.user.id || item.email.toLowerCase() === req.user.email?.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.json({ user: normalizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.patch('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (name !== undefined && typeof name !== 'string') {
      return res.status(400).json({ message: 'Tên không hợp lệ' });
    }

    if (phone !== undefined && phone !== null && typeof phone !== 'string') {
      return res.status(400).json({ message: 'Số điện thoại không hợp lệ' });
    }

    const nextName = typeof name === 'string' ? name.trim() : undefined;
    const nextPhone = phone === undefined ? undefined : phone === null ? null : phone.trim();

    if (nextName !== undefined && !nextName) {
      return res.status(400).json({ message: 'Tên không được để trống' });
    }

    const currentUserDb = await getDbOrFallbackRows(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (currentUserDb.ok) {
      if (currentUserDb.rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const currentUser = currentUserDb.rows[0];
      const updatedName = nextName !== undefined ? nextName : currentUser.name;
      const updatedPhone = nextPhone !== undefined ? nextPhone : currentUser.phone || null;

      await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [
        updatedName,
        updatedPhone,
        req.user.id,
      ]);

      return res.json({
        message: 'Cập nhật hồ sơ thành công',
        user: {
          ...currentUser,
          name: updatedName,
          phone: updatedPhone,
        },
      });
    }

    const memoryUserIndex = memoryUsers.findIndex((item) => item.id === req.user.id);
    if (memoryUserIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const currentUser = memoryUsers[memoryUserIndex];
    const updatedUser = {
      ...currentUser,
      name: nextName !== undefined ? nextName : currentUser.name,
      phone: nextPhone !== undefined ? nextPhone : currentUser.phone || null,
    };

    memoryUsers[memoryUserIndex] = updatedUser;

    return res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: normalizeUser(updatedUser),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.patch('/api/auth/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Mật khẩu không hợp lệ' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const currentUserDb = await getDbOrFallbackRows(
      'SELECT id, email, password_hash, name, phone, role, created_at FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );

    if (currentUserDb.ok) {
      if (currentUserDb.rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const currentUser = currentUserDb.rows[0];
      const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

      return res.json({ message: 'Đổi mật khẩu thành công' });
    }

    const memoryUserIndex = memoryUsers.findIndex((item) => item.id === req.user.id);
    if (memoryUserIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const currentUser = memoryUsers[memoryUserIndex];
    const isMatch = await bcrypt.compare(currentPassword, currentUser.password_hash || currentUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    memoryUsers[memoryUserIndex] = {
      ...currentUser,
      password_hash: newPasswordHash,
      passwordHash: newPasswordHash,
    };

    return res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu mới' });
    }

    if (typeof email !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const dbCheck = await getDbOrFallbackRows('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

    if (dbCheck.ok) {
      if (dbCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
      }

      await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [passwordHash, email]);

      return res.json({ message: 'Đặt lại mật khẩu thành công' });
    }

    const memoryUserIndex = memoryUsers.findIndex((item) => item.email.toLowerCase() === email.toLowerCase());
    if (memoryUserIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
    }

    memoryUsers[memoryUserIndex] = {
      ...memoryUsers[memoryUserIndex],
      password_hash: passwordHash,
      passwordHash: passwordHash,
    };

    return res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    const dbCheck = await getDbOrFallbackRows(
      'SELECT id, email, password_hash, name, phone, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    let user = null;

    if (dbCheck.ok) {
      user = dbCheck.rows[0] || null;
    } else {
      user = memoryUsers.find((item) => item.email.toLowerCase() === email.toLowerCase()) || null;
    }

    if (!user && email.toLowerCase() === seededAdminUser.email.toLowerCase()) {
      user = seededAdminUser;
    }

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    let isMatch = false;
    const passwordHash = user.password_hash || user.passwordHash;

    if (user.email && user.email.toLowerCase() === seededAdminUser.email.toLowerCase()) {
      isMatch = password === 'admin123456';
    } else if (passwordHash) {
      isMatch = await bcrypt.compare(password, passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, phone: user.phone || null, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Đăng nhập thành công',
      token,
      user: normalizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


function requireAdmin(req, res, next) {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập admin' });
  }
  return next();
}

async function seedProductsIfNeeded() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM products');
    if (Number(rows[0]?.total || 0) > 0) {
      return;
    }

    const products = loadLocalProducts().map(normalizeProductForDb);
    if (!products.length) {
      return;
    }

    const values = products
      .map((product) => [product.name, product.category, product.price, product.stock, product.image, product.is_active]);

    await pool.query(
      'INSERT INTO products (name, category, price, stock, image, is_active) VALUES ?',
      [values]
    );
  } catch (error) {
    console.error('Failed to seed products:', error.message);
  }
}

async function fetchAdminProducts() {
  const result = await getDbOrFallbackRows(
    'SELECT id, name, category, price, stock, image, is_active, created_at, updated_at FROM products ORDER BY id DESC'
  );
  if (result.ok) {
    return result.rows;
  }

  return [];
}

async function fetchAdminUsers() {
  const result = await getDbOrFallbackRows(
    'SELECT id, email, name, phone, role, created_at FROM users ORDER BY id DESC'
  );
  if (result.ok) {
    return result.rows;
  }

  return [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@dgstore.local',
      phone: '0900000000',
      role: 'admin',
    },
    {
      id: 2,
      name: 'Khách hàng 1',
      email: 'user1@dgstore.local',
      phone: '0911111111',
      role: 'user',
    },
  ];
}

app.get('/api/admin/dashboard', authMiddleware, requireAdmin, async (req, res) => {
  const [products, users] = await Promise.all([fetchAdminProducts(), fetchAdminUsers()]);
  const topCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];
  return res.json({
    totalProducts: products.length,
    activeProducts: products.filter((product) => Number(product.is_active) !== 0).length,
    totalUsers: users.length,
    recentProductName: products[0]?.name || null,
    topCategory: top ? top[0] : null,
  });
});

app.get('/api/admin/products', authMiddleware, requireAdmin, async (req, res) => {
  const products = await fetchAdminProducts();
  return res.json({ products });
});

app.get('/api/admin/users', authMiddleware, requireAdmin, async (req, res) => {
  const users = await fetchAdminUsers();
  return res.json({ users });
});

app.patch('/api/admin/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  const { name, phone, role } = req.body || {};

  if (role && !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role không hợp lệ' });
  }

  const dbCheck = await getDbOrFallbackRows('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
  if (dbCheck.ok) {
    if (dbCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await pool.query(
      'UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), role = COALESCE(?, role) WHERE id = ?',
      [name || null, phone === undefined ? null : phone, role || null, userId]
    );

    const updated = await pool.query(
      'SELECT id, email, name, phone, role, created_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    return res.json({ message: 'Cập nhật người dùng thành công', user: updated[0][0] });
  }

  return res.status(501).json({ message: 'Cập nhật người dùng chưa hỗ trợ ở chế độ fallback' });
});

app.delete('/api/admin/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  const userId = Number(req.params.id);
  const dbCheck = await getDbOrFallbackRows('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
  if (dbCheck.ok) {
    if (dbCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    return res.json({ message: 'Xoá người dùng thành công' });
  }

  return res.status(501).json({ message: 'Xoá người dùng chưa hỗ trợ ở chế độ fallback' });
});

app.post('/api/admin/products', authMiddleware, requireAdmin, async (req, res) => {
  const { name, category, price, stock, image, imageCategory, imageFolder, imageDataUrl, imageFileName } = req.body || {};
  const dbCheck = await getDbOrFallbackRows('SELECT id FROM products LIMIT 1');

  let finalImage = typeof image === 'string' ? image.trim() : '';
  if (imageDataUrl) {
    const targetCategory = resolveImageCategory(category, imageCategory);
    const folderName = sanitizeFolderName(imageFolder);
    if (!folderName) {
      return res.status(400).json({ message: 'Vui lòng nhập tên thư mục lưu ảnh' });
    }

    const targetDir = path.join(CATEGORY_IMAGE_DIRS[targetCategory] || CATEGORY_IMAGE_DIRS.accessory, folderName);
    ensureDirectoryExists(targetDir);

    const { mimeType, buffer } = decodeDataUrlImage(imageDataUrl);
    const extension = imageFileName ? path.extname(imageFileName) || mimeTypeToExtension(mimeType) : mimeTypeToExtension(mimeType);
    const fileName = safeImageFileName(imageFileName || `product-image${extension}`);
    const filePath = path.join(targetDir, fileName);
    fs.writeFileSync(filePath, buffer);
    finalImage = path.relative(__dirname, filePath).split(path.sep).join('/');
  }

  if (dbCheck.ok) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, price, stock, image, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name || 'Sản phẩm mới', category || 'accessory', Number(price || 0), Number(stock || 0), finalImage || '', 1]
    );
    const inserted = await pool.query(
      'SELECT id, name, category, price, stock, image, is_active, created_at, updated_at FROM products WHERE id = ? LIMIT 1',
      [result.insertId]
    );
    return res.status(201).json({ message: 'Tạo sản phẩm thành công', product: inserted[0][0] });
  }
  return res.status(501).json({ message: 'Tạo sản phẩm chưa hỗ trợ ở chế độ fallback' });
});

app.patch('/api/admin/products/:id', authMiddleware, requireAdmin, async (req, res) => {
  const productId = Number(req.params.id);
  const dbCheck = await getDbOrFallbackRows('SELECT id FROM products WHERE id = ? LIMIT 1', [productId]);
  if (dbCheck.ok) {
    if (dbCheck.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const { name, category, price, stock, image, imageCategory, imageFolder, imageDataUrl, imageFileName, is_active } = req.body || {};
    let finalImage = typeof image === 'string' ? image.trim() : '';

    if (imageDataUrl) {
      const targetCategory = resolveImageCategory(category, imageCategory);
      const folderName = sanitizeFolderName(imageFolder);
      if (!folderName) {
        return res.status(400).json({ message: 'Vui lòng nhập tên thư mục lưu ảnh' });
      }

      const targetDir = path.join(CATEGORY_IMAGE_DIRS[targetCategory] || CATEGORY_IMAGE_DIRS.accessory, folderName);
      ensureDirectoryExists(targetDir);

      const { mimeType, buffer } = decodeDataUrlImage(imageDataUrl);
      const extension = imageFileName ? path.extname(imageFileName) || mimeTypeToExtension(mimeType) : mimeTypeToExtension(mimeType);
      const fileName = safeImageFileName(imageFileName || `product-image${extension}`);
      const filePath = path.join(targetDir, fileName);
      fs.writeFileSync(filePath, buffer);
      finalImage = path.relative(__dirname, filePath).split(path.sep).join('/');
    }

    await pool.query(
      'UPDATE products SET name = COALESCE(?, name), category = COALESCE(?, category), price = COALESCE(?, price), stock = COALESCE(?, stock), image = COALESCE(?, image), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name || null, category || null, price === undefined ? null : Number(price), stock === undefined ? null : Number(stock), finalImage || null, is_active === undefined ? null : Number(Boolean(is_active)), productId]
    );
    const updated = await pool.query(
      'SELECT id, name, category, price, stock, image, is_active, created_at, updated_at FROM products WHERE id = ? LIMIT 1',
      [productId]
    );
    return res.json({ message: 'Cập nhật sản phẩm thành công', product: updated[0][0] });
  }
  return res.status(501).json({ message: 'Cập nhật sản phẩm chưa hỗ trợ ở chế độ fallback' });
});

app.delete('/api/admin/products/:id', authMiddleware, requireAdmin, async (req, res) => {
  const productId = Number(req.params.id);
  const dbCheck = await getDbOrFallbackRows('SELECT id FROM products WHERE id = ? LIMIT 1', [productId]);
  if (dbCheck.ok) {
    if (dbCheck.rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    return res.json({ message: 'Xoá sản phẩm thành công' });
  }
  return res.status(501).json({ message: 'Xoá sản phẩm chưa hỗ trợ ở chế độ fallback' });
});

seedProductsIfNeeded().finally(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
});
