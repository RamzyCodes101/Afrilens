import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import useIsMobile from '../hooks/useIsMobile';

const CATEGORIES = [
  'Photography', 'Art', 'Nature', 'People', 'Architecture',
  'Wildlife', 'Fashion', 'Culture', 'Food', 'Other'
];

export default function AdminUpload() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', description: '', category: 'Photography', tags: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const isMobile = useIsMobile();
  if (!isAdmin) { navigate('/login'); return null; }

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
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
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Upload Image</h1>
            <p style={styles.sub}>Add a new image to the AfriLens library</p>
          </div>
          <button onClick={() => navigate('/gallery')} style={styles.viewBtn}>View Gallery →</button>
        </div>

        {success && (
          <div style={styles.successBanner}>
            <div style={styles.successLeft}>
              <span style={styles.successCheck}>✓</span>
              <div>
                <p style={styles.successTitle}>Image uploaded successfully!</p>
                <p style={styles.successSub}>It's now live in the gallery</p>
              </div>
            </div>
            <button onClick={() => setSuccess(false)} style={styles.successDismiss}>Upload another</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            {/* Drop zone */}
            <div
              style={{
                ...styles.dropzone,
                ...(dragOver ? styles.dropzoneActive : {}),
                ...(preview ? styles.dropzoneWithPreview : {}),
              }}
              onClick={() => document.getElementById('fileInput').click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {preview ? (
                <img src={preview} alt="preview" style={styles.previewImg} />
              ) : (
                <div style={styles.dropzoneInner}>
                  <div style={styles.uploadIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p style={styles.dropText}>Drop image here</p>
                  <p style={styles.dropSub}>or click to browse</p>
                  <p style={styles.dropHint}>JPEG, PNG, WebP · Max 20MB</p>
                </div>
              )}
              {preview && (
                <div style={styles.changeOverlay}>
                  <span>Change image</span>
                </div>
              )}
            </div>
            <input id="fileInput" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} />

            {/* Fields */}
            <div style={styles.fields}>
              <div style={styles.field}>
                <label style={styles.label}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Maasai Sunrise"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe this image..."
                  style={{ ...styles.input, height: '88px', resize: 'vertical' }}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="kenya, landscape, sunset (comma-separated)"
                  style={styles.input}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>⚠ {error}</div>
              )}

              <button type="submit" disabled={loading} style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}>
                {loading ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload to Library
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#080808', padding: 'clamp(20px, 4vw, 40px)' },
  container: { maxWidth: '960px', margin: '0 auto' },

  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '32px', fontWeight: '800', color: '#fff', margin: '0 0 6px',
  },
  sub: { fontSize: '14px', color: '#555', margin: 0 },
  viewBtn: {
    background: 'none', border: '1px solid rgba(255,255,255,0.1)',
    color: '#888', padding: '9px 18px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
  },

  successBanner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
  },
  successLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  successCheck: {
    width: '32px', height: '32px', background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.3)', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#22c55e', fontSize: '14px', fontWeight: '700', flexShrink: 0,
  },
  successTitle: { fontSize: '14px', fontWeight: '600', color: '#22c55e', margin: '0 0 2px' },
  successSub: { fontSize: '12px', color: '#555', margin: 0 },
  successDismiss: {
    background: 'none', border: '1px solid rgba(34,197,94,0.3)',
    color: '#22c55e', padding: '7px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px',
  },

  form: {},
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },

  dropzone: {
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: '16px', cursor: 'pointer',
    minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
    background: '#0d0d0d', transition: 'border-color 0.2s',
  },
  dropzoneActive: { borderColor: 'rgba(232,160,32,0.5)', background: 'rgba(232,160,32,0.04)' },
  dropzoneWithPreview: { border: '2px dashed transparent' },
  dropzoneInner: { textAlign: 'center', padding: '32px' },
  uploadIcon: {
    width: '56px', height: '56px', background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 16px', color: '#555',
  },
  dropText: { fontSize: '15px', fontWeight: '600', color: '#888', margin: '0 0 4px' },
  dropSub: { fontSize: '13px', color: '#444', margin: '0 0 12px' },
  dropHint: { fontSize: '11px', color: '#333', margin: 0 },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  changeOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '14px', fontWeight: '600', opacity: 0,
    transition: 'opacity 0.2s',
  },

  fields: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    width: '100%', padding: '11px 14px',
    background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#f0f0f0', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '13px', background: '#E8A020', color: '#000',
    border: 'none', borderRadius: '10px', fontWeight: '800',
    fontSize: '15px', cursor: 'pointer', marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  submitBtnLoading: { opacity: 0.7, cursor: 'not-allowed' },
};
