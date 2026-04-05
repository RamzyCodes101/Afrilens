const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { randomUUID: uuidv4 } = require('crypto');
const { pool } = require('../db');
const { requireAdmin } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  },
});

function uploadToCloudinary(buffer, folder = 'afrilens') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

// GET /api/images
router.get('/', async (req, res) => {
  const { q, category, page = 1, limit = 24 } = req.query;
  const offset = (page - 1) * limit;

  let where = [];
  let params = [];
  let i = 1;

  if (q) {
    where.push(`(title ILIKE $${i} OR description ILIKE $${i+1} OR tags ILIKE $${i+2})`);
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    i += 3;
  }
  if (category) {
    where.push(`category = $${i}`);
    params.push(category);
    i++;
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countRes = await pool.query(`SELECT COUNT(*) FROM images ${whereClause}`, params);
  const total = parseInt(countRes.rows[0].count);

  const rows = await pool.query(
    `SELECT id, title, description, category, tags, url, downloads, created_at
     FROM images ${whereClause}
     ORDER BY created_at DESC LIMIT $${i} OFFSET $${i+1}`,
    [...params, Number(limit), Number(offset)]
  );

  res.json({ images: rows.rows, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/images/categories
router.get('/categories', async (req, res) => {
  const { rows } = await pool.query(`SELECT DISTINCT category FROM images ORDER BY category`);
  res.json(rows.map((r) => r.category));
});

// GET /api/images/:id
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// POST /api/images/download/:id
router.post('/download/:id', async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  await pool.query(`UPDATE images SET downloads = downloads + 1 WHERE id = $1`, [req.params.id]);
  res.json({ url: rows[0].url, filename: rows[0].original_name });
});

// POST /api/images (admin upload)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { title, description, category, tags } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'title and category are required' });

  const result = await uploadToCloudinary(req.file.buffer);
  const id = uuidv4();

  await pool.query(
    `INSERT INTO images (id, title, description, category, tags, url, public_id, original_name, mime_type, size)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id, title, description || '', category, tags || '', result.secure_url, result.public_id,
     req.file.originalname, req.file.mimetype, req.file.size]
  );

  const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1`, [id]);
  res.status(201).json(rows[0]);
});

// DELETE /api/images/:id (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM images WHERE id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });

  await cloudinary.uploader.destroy(rows[0].public_id);
  await pool.query(`DELETE FROM images WHERE id = $1`, [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
