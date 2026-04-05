import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CATEGORIES = [
  'Photography', 'Art', 'Nature', 'People', 'Architecture',
  'Wildlife', 'Fashion', 'Culture', 'Food', 'Other'
];

export default function AdminUpload() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', category: 'Photography', tags: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an image');
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      await api.post('/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setForm({ title: '', description: '', category: 'Photography', tags: '' });
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Upload Image</h2>
        {success && (
          <div style={styles.successBanner}>
            Image uploaded! <button onClick={() => setSuccess(false)} style={styles.dismiss}>Upload another</button>
            <button onClick={() => navigate('/')} style={{ ...styles.dismiss, marginLeft: 8 }}>View Gallery</button>
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.left}>
              <label style={styles.label}>Image *</label>
              <div style={styles.dropzone} onClick={() => document.getElementById('fileInput').click()}>
                {preview
                  ? <img src={preview} alt="preview" style={styles.previewImg} />
                  : <span style={{ color: '#555' }}>Click to select image (JPEG, PNG, WebP — max 20MB)</span>
                }
              </div>
              <input
                id="fileInput" type="file" accept="image/jpeg,image/png,image/webp"
                onChange={handleFile} style={{ display: 'none' }}
              />
            </div>
            <div style={styles.right}>
              <label style={styles.label}>Title *</label>
              <input
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Maasai Sunrise" style={styles.input} required
              />
              <label style={styles.label}>Category *</label>
              <select
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={styles.input}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description..." style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              />
              <label style={styles.label}>Tags (comma-separated)</label>
              <input
                value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. kenya, landscape, sunset" style={styles.input}
              />
            </div>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0f0f0f', padding: '40px 32px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  title: { color: '#e8a020', marginTop: 0, marginBottom: '24px', fontSize: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  row: { display: 'flex', gap: '32px', flexWrap: 'wrap' },
  left: { flex: '1 1 300px' },
  right: { flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' },
  dropzone: {
    border: '2px dashed #333', borderRadius: '10px', padding: '20px',
    cursor: 'pointer', minHeight: '220px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'contain', maxHeight: '300px' },
  input: {
    width: '100%', padding: '10px 12px', background: '#1a1a1a',
    border: '1px solid #333', borderRadius: '8px', color: '#eee',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  error: { color: '#e74c3c', fontSize: '13px', margin: 0 },
  btn: {
    padding: '13px', background: '#e8a020', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: '800',
    fontSize: '15px', cursor: 'pointer',
  },
  successBanner: {
    background: '#1a3a1a', border: '1px solid #2d6a2d', color: '#5cb85c',
    padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
  },
  dismiss: {
    background: 'none', border: 'none', color: '#5cb85c',
    textDecoration: 'underline', cursor: 'pointer', fontSize: '14px',
  },
};
