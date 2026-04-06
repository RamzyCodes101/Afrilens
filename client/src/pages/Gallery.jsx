import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import ImageCard from '../components/ImageCard';
import { useAuth } from '../context/AuthContext';

export default function Gallery() {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState('');
  const [inputQ, setInputQ] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/images/categories').then(({ data }) => setCategories(data));
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 24 };
      if (q) params.q = q;
      if (category) params.category = category;
      const { data } = await api.get('/images', { params });
      setImages(data.images);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [q, category, page]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQ(inputQ);
    setPage(1);
  };

  const handleDelete = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <p style={styles.heroEyebrow}>Free African imagery</p>
        <h1 style={styles.heroTitle}>
          The world through<br />
          <span style={styles.heroAccent}>an African lens.</span>
        </h1>
        <p style={styles.heroSub}>
          High-quality photos and art — free to download and use.
        </p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={inputQ}
              onChange={(e) => setInputQ(e.target.value)}
              placeholder="Search by keyword, place, mood..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchBtn}>Search</button>
          </div>
        </form>
        {total > 0 && !loading && (
          <p style={styles.heroCount}>{total.toLocaleString()} images available</p>
        )}
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.filters}>
          {['', ...categories].map((cat) => (
            <button
              key={cat || 'all'}
              style={{ ...styles.chip, ...(category === cat ? styles.chipActive : {}) }}
              onClick={() => { setCategory(cat); setPage(1); }}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
        {(q || category) && (
          <button
            onClick={() => { setQ(''); setInputQ(''); setCategory(''); setPage(1); }}
            style={styles.clearBtn}
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Gallery */}
      <div style={styles.galleryWrap}>
        {loading ? (
          <div style={styles.loadingGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ ...styles.skeleton, height: `${180 + (i % 3) * 60}px` }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>◈</p>
            <p style={styles.emptyText}>No images found</p>
            <p style={styles.emptySub}>Try a different search or category</p>
          </div>
        ) : (
          <div style={styles.masonry}>
            {images.map((img) => (
              <ImageCard key={img.id} image={img} isAdmin={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={styles.pageBtn}>
            ← Prev
          </button>
          <span style={styles.pageInfo}>Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={styles.pageBtn}>
            Next →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>◈ AfriLens</span>
        <span style={styles.footerText}>Free African photography & art</span>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808' },

  // Hero
  hero: {
    position: 'relative', overflow: 'hidden',
    textAlign: 'center', padding: '100px 32px 80px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  heroGlow: {
    position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, rgba(232,160,32,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroEyebrow: {
    fontSize: '12px', fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: '3px', color: '#E8A020', margin: '0 0 20px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900',
    lineHeight: 1.1, color: '#fff', margin: '0 0 20px',
  },
  heroAccent: { color: '#E8A020' },
  heroSub: { fontSize: '16px', color: '#666', maxWidth: '420px', margin: '0 auto 36px', lineHeight: 1.6 },
  heroCount: { fontSize: '13px', color: '#444', marginTop: '16px' },

  // Search
  searchForm: { maxWidth: '560px', margin: '0 auto' },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: '#111', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', padding: '6px 6px 6px 16px',
    transition: 'border-color 0.2s',
  },
  searchIcon: { color: '#555', flexShrink: 0 },
  searchInput: {
    flex: 1, background: 'none', border: 'none', outline: 'none',
    color: '#f0f0f0', fontSize: '15px', padding: '8px 12px',
  },
  searchBtn: {
    background: '#E8A020', color: '#000', border: 'none',
    padding: '10px 22px', borderRadius: '10px',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    flexShrink: 0,
  },

  // Filters
  filterBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '12px',
    padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  filters: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: {
    padding: '6px 16px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'none', color: '#666', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500',
    transition: 'all 0.2s',
  },
  chipActive: {
    background: 'rgba(232,160,32,0.15)',
    border: '1px solid rgba(232,160,32,0.4)',
    color: '#E8A020', fontWeight: '600',
  },
  clearBtn: {
    background: 'none', border: 'none', color: '#555',
    cursor: 'pointer', fontSize: '13px',
  },

  // Gallery
  galleryWrap: { padding: '32px 40px' },
  masonry: {
    columns: 'auto 280px', columnGap: '12px',
  },
  loadingGrid: {
    columns: 'auto 280px', columnGap: '12px',
  },
  skeleton: {
    background: 'linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%)',
    backgroundSize: '200% 100%',
    borderRadius: '12px', marginBottom: '12px', breakInside: 'avoid',
    animation: 'shimmer 1.5s infinite',
  },
  empty: { textAlign: 'center', padding: '100px 32px' },
  emptyIcon: { fontSize: '40px', color: '#222', margin: '0 0 16px' },
  emptyText: { fontSize: '20px', fontWeight: '700', color: '#444', margin: '0 0 8px' },
  emptySub: { fontSize: '14px', color: '#333', margin: 0 },

  // Pagination
  pagination: {
    display: 'flex', justifyContent: 'center', gap: '12px',
    alignItems: 'center', padding: '40px',
  },
  pageBtn: {
    padding: '10px 24px', background: '#111',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#eee', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500',
    transition: 'background 0.2s',
  },
  pageInfo: { color: '#555', fontSize: '13px' },

  // Footer
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap', gap: '8px',
  },
  footerLogo: { fontSize: '14px', fontWeight: '700', color: '#E8A020' },
  footerText: { fontSize: '13px', color: '#333' },
};
