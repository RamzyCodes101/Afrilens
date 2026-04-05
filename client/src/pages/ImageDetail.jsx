import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get(`/images/${id}`).then(({ data }) => setImage(data)).catch(() => navigate('/'));
  }, [id, navigate]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await api.post(`/images/download/${id}`);
      const a = document.createElement('a');
      a.href = data.url;
      a.download = data.filename;
      a.click();
      setImage((prev) => ({ ...prev, downloads: prev.downloads + 1 }));
    } finally {
      setDownloading(false);
    }
  };

  if (!image) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.container}>
        <div style={styles.imgWrap}>
          <img
            src={image.url}
            alt={image.title}
            style={styles.img}
          />
        </div>
        <div style={styles.meta}>
          <span style={styles.category}>{image.category}</span>
          <h1 style={styles.title}>{image.title}</h1>
          {image.description && <p style={styles.desc}>{image.description}</p>}
          {image.tags && (
            <div style={styles.tags}>
              {image.tags.split(',').map((t) => (
                <span key={t} style={styles.tag}>{t.trim()}</span>
              ))}
            </div>
          )}
          <div style={styles.stats}>
            <span>{image.downloads} downloads</span>
            <span>{new Date(image.created_at).toLocaleDateString()}</span>
          </div>
          <button onClick={handleDownload} disabled={downloading} style={styles.dlBtn}>
            {downloading ? 'Downloading...' : 'Free Download'}
          </button>
          <p style={styles.license}>Free to use. Credit AfriLens appreciated.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#eee', padding: '24px 32px' },
  loading: { color: '#aaa', textAlign: 'center', padding: '80px' },
  back: {
    background: 'none', border: '1px solid #333', color: '#aaa',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px',
  },
  container: { display: 'flex', gap: '40px', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap' },
  imgWrap: { flex: '1 1 600px', borderRadius: '12px', overflow: 'hidden' },
  img: { width: '100%', display: 'block', borderRadius: '12px' },
  meta: { flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '16px' },
  category: { fontSize: '12px', color: '#e8a020', textTransform: 'uppercase', fontWeight: '700' },
  title: { fontSize: '28px', fontWeight: '800', margin: 0 },
  desc: { color: '#aaa', fontSize: '14px', lineHeight: '1.6', margin: 0 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontSize: '12px', background: '#1e1e1e', border: '1px solid #333',
    padding: '4px 10px', borderRadius: '20px', color: '#aaa',
  },
  stats: { display: 'flex', gap: '16px', color: '#555', fontSize: '13px' },
  dlBtn: {
    padding: '14px', background: '#e8a020', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: '800',
    fontSize: '16px', cursor: 'pointer',
  },
  license: { color: '#555', fontSize: '12px', margin: 0 },
};
