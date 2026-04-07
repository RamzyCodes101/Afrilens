const BACKEND = 'https://afrilens-production.up.railway.app';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const path = req.url.replace(/^\/api/, '/api');
  const url = `${BACKEND}${path}`;

  const headers = { ...req.headers };
  delete headers.host;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half',
    });

    response.headers.forEach((val, key) => {
      if (key !== 'transfer-encoding') res.setHeader(key, val);
    });
    res.status(response.status);
    const buf = await response.arrayBuffer();
    res.end(Buffer.from(buf));
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', detail: err.message });
  }
}
