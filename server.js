require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

app.use(cors());
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
    const { email, password, name } = req.body;

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
        'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
        [email, passwordHash, name, 'user']
      );

      return res.status(201).json({
        message: 'Tạo tài khoản thành công',
        user: {
          id: result.insertId,
          email,
          name,
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
      'SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1',
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    const dbCheck = await getDbOrFallbackRows(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = ? LIMIT 1',
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
      { id: user.id, email: user.email, name: user.name, role: user.role },
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
