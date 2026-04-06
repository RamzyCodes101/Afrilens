import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import useIsMobile from '../hooks/useIsMobile';

export default function ImageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [related, setRelated] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setImgLoaded(false);
    api.get(`/images/${id}`).then(({ data }) => {
      setImage(data);
      api.get('/images', { params: { category: data.category, limit: 6 } })
        .then(({ data: rel }) => setRelated(rel.images.filter(i => i.id !== id).slice(0, 4)));
    }).catch(() => navigate('/gallery'));
  }, [id, navigate]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await api.post(`/images/download/${id}`);
      const a = document.createElement('a');
      a.href = data.url;
      a.download = data.filename;
      a.click();
      setImage(prev => ({ ...prev, downloads: prev.downloads + 1 }));
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  if (!image) return (
    <div style={s.loadingPage}>
      <div style={s.spinner} />
    </div>
  );

  const tags = image.tags ? image.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div style={s.page}>

      {/* Breadcrumb bar */}
      <div style={s.topBar}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
        <div style={s.breadcrumbs}>
          <Link to="/gallery" style={s.breadcrumbLink}>Gallery</Link>
          <span style={s.breadcrumbSep}>/</span>
          <span style={s.breadcrumbCurrent}>{image.category}</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ ...s.layout, gridTemplateColumns: isMobile ? '1fr' : '1fr 340px' }}>

        {/* Left — image viewer */}
        <div style={s.viewer}>
          <div style={s.imageContainer}>
            {!imgLoaded && <div style={s.imgSkeleton} />}
            <img
              src={image.url}
              alt={image.title}
              style={{ ...s.mainImg, opacity: imgLoaded ? 1 : 0 }}
              onLoad={() => setImgLoaded(true)}
            />
          </div>

          {/* Related images */}
          {related.length > 0 && (
            <div style={s.related}>
              <p style={s.relatedTitle}>More in {image.category}</p>
              <div style={s.relatedGrid}>
                {related.map(img => (
                  <Link to={`/image/${img.id}`} key={img.id} style={s.relatedItem}>
                    <img src={img.url} alt={img.title} style={s.relatedImg} />
                    <div style={s.relatedOverlay}>
                      <span style={s.relatedName}>{img.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — info panel */}
        <div style={s.panel}>
          <div style={s.panelInner}>

            <span style={s.categoryBadge}>{image.category}</span>
            <h1 style={s.title}>{image.title}</h1>

            {image.description && (
              <p style={s.description}>{image.description}</p>
            )}

            <div style={s.divider} />

            {/* Stats row */}
            <div style={s.statsRow}>
              <div style={s.stat}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#E8A020' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span style={s.statValue}>{image.downloads.toLocaleString()}</span>
                <span style={s.statLabel}>downloads</span>
              </div>
              <div style={s.stat}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#E8A020' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={s.statValue}>{new Date(image.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div style={s.divider} />

            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ ...s.dlBtn, ...(downloaded ? s.dlBtnDone : {}) }}
            >
              {downloaded ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Downloaded!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  {downloading ? 'Downloading...' : 'Free Download'}
                </>
              )}
            </button>

            <p style={s.licenseNote}>
              Free to use for personal and commercial projects.<br />
              Credit to AfriLens appreciated but not required.
            </p>

            <div style={s.divider} />

            {/* Tags */}
            {tags.length > 0 && (
              <div style={s.tagsWrap}>
                <p style={s.tagsLabel}>Tags</p>
                <div style={s.tags}>
                  {tags.map(tag => (
                    <Link to={`/gallery?q=${tag}`} key={tag} style={s.tag}>#{tag}</Link>
                  ))}
                </div>
              </div>
            )}

            {/* License card */}
            <div style={s.licenseCard}>
              <div style={s.licenseRow}>
                <span style={s.licenseIcon}>✓</span>
                <span style={s.licenseText}>Free for commercial use</span>
              </div>
              <div style={s.licenseRow}>
                <span style={s.licenseIcon}>✓</span>
                <span style={s.licenseText}>No attribution required</span>
              </div>
              <div style={s.licenseRow}>
                <span style={s.licenseIcon}>✓</span>
                <span style={s.licenseText}>High resolution download</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#080808', color: '#f0f0f0' },

  loadingPage: {
    minHeight: '100vh', background: '#080808',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner: {
    width: '32px', height: '32px', borderRadius: '50%',
    border: '2px solid #1a1a1a', borderTop: '2px solid #E8A020',
    animation: 'spin 0.8s linear infinite',
  },

  topBar: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'none', border: '1px solid rgba(255,255,255,0.08)',
    color: '#888', padding: '7px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '12px', fontWeight: '500',
    transition: 'color 0.2s, border-color 0.2s', flexShrink: 0,
  },
  breadcrumbs: { display: 'flex', alignItems: 'center', gap: '8px' },
  breadcrumbLink: { fontSize: '13px', color: '#555' },
  breadcrumbSep: { color: '#333', fontSize: '13px' },
  breadcrumbCurrent: { fontSize: '13px', color: '#888', fontWeight: '500' },

  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    minHeight: 'calc(100vh - 53px)',
  },

  // Viewer
  viewer: { padding: '16px', borderRight: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' },
  imageContainer: {
    position: 'relative', background: '#0d0d0d',
    borderRadius: '16px', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '300px',
  },
  imgSkeleton: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(90deg, #111 25%, #161616 50%, #111 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  mainImg: {
    maxWidth: '100%', maxHeight: '75vh',
    objectFit: 'contain', display: 'block',
    transition: 'opacity 0.5s ease',
    borderRadius: '16px',
  },

  // Related
  related: { marginTop: '40px' },
  relatedTitle: { fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600', marginBottom: '16px' },
  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  relatedItem: { borderRadius: '8px', overflow: 'hidden', position: 'relative', aspectRatio: '1', display: 'block' },
  relatedImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' },
  relatedOverlay: {
    position: 'absolute', inset: 0, opacity: 0,
    background: 'rgba(0,0,0,0.6)', display: 'flex',
    alignItems: 'flex-end', padding: '8px',
    transition: 'opacity 0.3s',
  },
  relatedName: { fontSize: '10px', color: '#fff', fontWeight: '600', lineHeight: 1.2 },

  // Panel
  panel: { background: '#0a0a0a', overflowY: 'auto' },
  panelInner: { padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '20px' },

  categoryBadge: {
    display: 'inline-flex', alignItems: 'center',
    fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '1.5px', color: '#E8A020',
    background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)',
    padding: '4px 10px', borderRadius: '20px', width: 'fit-content',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px', fontWeight: '800', color: '#f0f0f0',
    margin: 0, lineHeight: 1.25,
  },
  description: { fontSize: '13px', color: '#555', lineHeight: 1.8, margin: 0 },

  divider: { height: '1px', background: 'rgba(255,255,255,0.05)' },

  statsRow: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  stat: { display: 'flex', alignItems: 'center', gap: '6px' },
  statValue: { fontSize: '13px', color: '#bbb', fontWeight: '600' },
  statLabel: { fontSize: '12px', color: '#444' },

  dlBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '13px 20px', background: '#E8A020', color: '#000',
    border: 'none', borderRadius: '10px', fontWeight: '800',
    fontSize: '14px', cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
    width: '100%',
  },
  dlBtnDone: { background: '#22c55e', color: '#fff' },

  licenseNote: { fontSize: '11px', color: '#333', lineHeight: 1.6, margin: 0, textAlign: 'center' },

  tagsWrap: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tagsLabel: { fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, fontWeight: '600' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontSize: '12px', color: '#555', background: '#111',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '4px 10px', borderRadius: '20px',
    transition: 'color 0.2s, border-color 0.2s',
  },

  licenseCard: {
    background: '#111', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px', padding: '16px 18px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  licenseRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  licenseIcon: { color: '#22c55e', fontSize: '12px', fontWeight: '800', flexShrink: 0 },
  licenseText: { fontSize: '12px', color: '#555' },
};
