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

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchImages();
  };

  const handleDelete = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>African Lens</h1>
        <p style={styles.heroSub}>Free high-quality African photography and art</p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search images..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
      </div>

      <div style={styles.filters}>
        <button
          style={{ ...styles.chip, ...(category === '' ? styles.chipActive : {}) }}
          onClick={() => { setCategory(''); setPage(1); }}
        >All</button>
        {categories.map((cat) => (
          <button
            key={cat}
            style={{ ...styles.chip, ...(category === cat ? styles.chipActive : {}) }}
            onClick={() => { setCategory(cat); setPage(1); }}
          >{cat}</button>
        ))}
      </div>

      <div style={styles.meta}>
        {loading ? 'Loading...' : `${total} image${total !== 1 ? 's' : ''}`}
      </div>

      {images.length === 0 && !loading ? (
        <div style={styles.empty}>No images found</div>
      ) : (
        <div style={styles.grid}>
          {images.map((img) => (
            <ImageCard key={img.id} image={img} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div style={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={styles.pageBtn}>Prev</button>
          <span style={{ color: '#aaa' }}>Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={styles.pageBtn}>Next</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f0f', color: '#eee' },
  hero: {
    textAlign: 'center', padding: '60px 32px 40px',
    background: 'linear-gradient(180deg, #1a1200 0%, #0f0f0f 100%)',
  },
  heroTitle: { fontSize: '48px', fontWeight: '900', color: '#e8a020', margin: '0 0 8px' },
  heroSub: { color: '#aaa', fontSize: '16px', marginBottom: '28px' },
  searchForm: { display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '8px' },
  searchInput: {
    flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #333',
    background: '#1a1a1a', color: '#eee', fontSize: '15px', outline: 'none',
  },
  searchBtn: {
    padding: '12px 24px', background: '#e8a020', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
  },
  filters: { display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 32px 16px' },
  chip: {
    padding: '6px 14px', borderRadius: '20px', border: '1px solid #333',
    background: 'none', color: '#aaa', cursor: 'pointer', fontSize: '13px',
  },
  chipActive: { background: '#e8a020', color: '#000', borderColor: '#e8a020', fontWeight: '700' },
  meta: { padding: '0 32px 12px', color: '#666', fontSize: '13px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px', padding: '0 32px 40px',
  },
  empty: { textAlign: 'center', color: '#555', padding: '80px', fontSize: '18px' },
  pagination: { display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', padding: '24px' },
  pageBtn: {
    padding: '8px 20px', background: '#1a1a1a', border: '1px solid #333',
    color: '#eee', borderRadius: '6px', cursor: 'pointer',
  },
};
