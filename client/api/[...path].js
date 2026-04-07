const BACKEND = 'https://afrilens-production.up.railway.app';

module.exports = async function handler(req, res) {
  const url = `${BACKEND}${req.url}`;

  const headers = {};
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];

  // Collect body
  let body = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    body = Buffer.concat(chunks);
    if (body.length === 0) body = undefined;
  }

  try {
    const upstream = await fetch(url, { method: req.method, headers, body });
    res.status(upstream.status);
    upstream.headers.forEach((val, key) => {
      if (!['transfer-encoding', 'connection'].includes(key)) res.setHeader(key, val);
    });
    const buf = await upstream.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: err.message });
  }
};

module.exports.config = { api: { bodyParser: false } };
