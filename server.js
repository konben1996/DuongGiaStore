require('dotenv').config();

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
app.use(express.json());
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

    if (dbCheck.ok) {
      if (dbCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }
      return res.json({ user: dbCheck.rows[0] });
    }

    const user = memoryUsers.find((item) => item.id === req.user.id);
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

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const passwordHash = user.password_hash || user.passwordHash;
    const isMatch = await bcrypt.compare(password, passwordHash);
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

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
