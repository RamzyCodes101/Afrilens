import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>AfriLens</span>
        </div>
        <h2 style={styles.title}>Admin access</h2>
        <p style={styles.sub}>Sign in to manage your image library</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
              style={styles.input}
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                style={{ ...styles.input, paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? (
              <span style={{ opacity: 0.7 }}>Signing in...</span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#080808',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '500px', height: '300px',
    background: 'radial-gradient(ellipse, rgba(232,160,32,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '400px',
    position: 'relative', zIndex: 1,
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px' },
  logoIcon: { fontSize: '20px', color: '#E8A020' },
  logoText: { fontSize: '16px', fontWeight: '800', color: '#fff' },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '26px', fontWeight: '800', color: '#fff', margin: '0 0 8px',
  },
  sub: { fontSize: '14px', color: '#555', margin: '0 0 32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    width: '100%', padding: '12px 16px',
    background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#f0f0f0', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  passwordWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#555',
    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
  },
  btn: {
    width: '100%', padding: '13px',
    background: '#E8A020', color: '#000',
    border: 'none', borderRadius: '10px',
    fontWeight: '800', fontSize: '15px', cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    marginTop: '4px',
  },
};
