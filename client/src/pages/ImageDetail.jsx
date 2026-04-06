import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

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
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  if (!image) return (
    <div style={styles.loadingPage}>
      <div style={styles.loadingPulse}>◈</div>
    </div>
  );

  const tags = image.tags ? image.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <span style={styles.breadcrumb}>{image.category}</span>
      </div>

      <div style={styles.layout}>
        {/* Image */}
        <div style={styles.imageSection}>
          <div style={styles.imageFrame}>
            <img src={image.url} alt={image.title} style={styles.img} />
          </div>
        </div>

        {/* Info */}
        <div style={styles.infoSection}>
          <div style={styles.infoInner}>
            <span style={styles.categoryTag}>{image.category}</span>
            <h1 style={styles.title}>{image.title}</h1>

            {image.description && (
              <p style={styles.description}>{image.description}</p>
            )}

            {tags.length > 0 && (
              <div style={styles.tags}>
                {tags.map((tag) => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}

            <div style={styles.divider} />

            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statNum}>{image.downloads.toLocaleString()}</span>
                <span style={styles.statLabel}>Downloads</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>Free</span>
                <span style={styles.statLabel}>License</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statNum}>{new Date(image.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                <span style={styles.statLabel}>Added</span>
              </div>
            </div>

            <div style={styles.divider} />

            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ ...styles.dlBtn, ...(downloaded ? styles.dlBtnSuccess : {}) }}
            >
              {downloaded ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Downloaded!
                </>
              ) : downloading ? (
                'Downloading...'
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Free Download
                </>
              )}
            </button>
            <p style={styles.license}>Free to use. Credit to AfriLens appreciated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808' },
  loadingPage: {
    minHeight: '100vh', background: '#080808',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  loadingPulse: { fontSize: '40px', color: '#E8A020', animation: 'pulse 1.5s ease infinite' },

  topBar: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: '1px solid rgba(255,255,255,0.08)',
    color: '#888', padding: '8px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    transition: 'color 0.2s, border-color 0.2s',
  },
  breadcrumb: { fontSize: '13px', color: '#444' },

  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    minHeight: 'calc(100vh - 65px)',
  },

  imageSection: {
    background: '#0d0d0d', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px', borderRight: '1px solid rgba(255,255,255,0.04)',
  },
  imageFrame: { maxWidth: '100%', maxHeight: '80vh' },
  img: {
    maxWidth: '100%', maxHeight: '80vh',
    objectFit: 'contain', borderRadius: '12px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },

  infoSection: {
    overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.04)',
  },
  infoInner: { padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '16px' },

  categoryTag: {
    display: 'inline-block', fontSize: '11px', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '1.5px', color: '#E8A020',
    background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)',
    padding: '4px 10px', borderRadius: '20px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px', fontWeight: '800', color: '#fff',
    margin: 0, lineHeight: 1.2,
  },
  description: { fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontSize: '12px', color: '#555', background: '#111',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '4px 10px', borderRadius: '20px',
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
  stats: { display: 'flex', gap: '24px' },
  stat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  statNum: { fontSize: '18px', fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' },

  dlBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '14px', background: '#E8A020', color: '#000',
    border: 'none', borderRadius: '12px', fontWeight: '800',
    fontSize: '15px', cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  },
  dlBtnSuccess: { background: '#22c55e', color: '#fff' },
  license: { fontSize: '12px', color: '#333', margin: 0, textAlign: 'center' },
};
