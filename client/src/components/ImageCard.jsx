import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ImageCard({ image, onDelete, isAdmin }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

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
      onMouseEnter={(e) => { e.currentTarget.querySelector('.overlay').style.opacity = '1'; }}
      onMouseLeave={(e) => { e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}
    >
      <div style={styles.imgWrap}>
        <img
          src={image.url}
          alt={image.title}
          style={styles.img}
          loading="lazy"
        />
        <div className="overlay" style={styles.overlay}>
          <button onClick={handleDownload} style={styles.dlBtn} disabled={downloading}>
            {downloading ? '...' : 'Download'}
          </button>
          {isAdmin && (
            <button onClick={handleDelete} style={styles.delBtn}>Delete</button>
          )}
        </div>
      </div>
      <div style={styles.info}>
        <span style={styles.title}>{image.title}</span>
        <span style={styles.category}>{image.category}</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
    background: '#1a1a1a', transition: 'transform 0.2s',
    border: '1px solid #2a2a2a',
  },
  imgWrap: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: '16px 12px 12px',
    display: 'flex', gap: '8px', opacity: 0,
    transition: 'opacity 0.2s',
  },
  dlBtn: {
    background: '#e8a020', color: '#000', border: 'none',
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '700',
  },
  delBtn: {
    background: '#c0392b', color: '#fff', border: 'none',
    padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '700',
  },
  info: {
    padding: '10px 12px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: '13px', color: '#eee', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' },
  category: { fontSize: '11px', color: '#e8a020', fontWeight: '500', textTransform: 'uppercase' },
};
