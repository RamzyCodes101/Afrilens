import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ImageCard({ image, onDelete, isAdmin }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const { data } = await api.post(`/images/download/${image.id}`);
      const a = document.createElement('a');
      a.href = data.url;
      a.download = data.filename;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this image?')) return;
    await api.delete(`/images/${image.id}`);
    onDelete?.(image.id);
  };

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/image/${image.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.imgWrap}>
        <img src={image.url} alt={image.title} style={styles.img} loading="lazy" />
        <div style={{ ...styles.overlay, opacity: hovered ? 1 : 0 }}>
          <div style={styles.overlayTop}>
            <span style={styles.categoryBadge}>{image.category}</span>
            {isAdmin && (
              <button onClick={handleDelete} style={styles.deleteBtn} title="Delete">
                ✕
              </button>
            )}
          </div>
          <div style={styles.overlayBottom}>
            <p style={styles.cardTitle}>{image.title}</p>
            <button onClick={handleDownload} style={styles.dlBtn} disabled={downloading}>
              {downloading ? (
                <span style={styles.dlSpinner}>●</span>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Free
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer', borderRadius: '12px', overflow: 'hidden',
    background: '#111', breakInside: 'avoid', marginBottom: '12px',
    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  imgWrap: { position: 'relative', display: 'block', lineHeight: 0 },
  img: { width: '100%', display: 'block', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.85) 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '12px',
    transition: 'opacity 0.3s ease',
  },
  overlayTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  overlayBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  categoryBadge: {
    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '1px', color: '#E8A020',
    background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)',
    padding: '3px 8px', borderRadius: '20px',
  },
  cardTitle: {
    fontSize: '13px', fontWeight: '600', color: '#fff', margin: 0,
    maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  dlBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '12px', fontWeight: '700', color: '#000',
    background: '#E8A020', border: 'none',
    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  deleteBtn: {
    background: 'rgba(200,50,50,0.8)', border: 'none', color: '#fff',
    width: '26px', height: '26px', borderRadius: '50%', cursor: 'pointer',
    fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  dlSpinner: { fontSize: '10px', animation: 'spin 1s linear infinite' },
};
