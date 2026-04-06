import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={styles.input}
            required
          />
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ ...styles.input, paddingRight: '44px', width: '100%', boxSizing: 'border-box' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#0f0f0f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  card: {
    background: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '12px', padding: '40px', width: '360px',
  },
  title: { color: '#e8a020', textAlign: 'center', marginTop: 0, marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '12px 14px', background: '#0f0f0f', border: '1px solid #333',
    borderRadius: '8px', color: '#eee', fontSize: '14px', outline: 'none',
  },
  passwordWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#666', cursor: 'pointer',
    padding: '0', display: 'flex', alignItems: 'center',
  },
  error: { color: '#e74c3c', fontSize: '13px', margin: 0 },
  btn: {
    padding: '12px', background: '#e8a020', color: '#000',
    border: 'none', borderRadius: '8px', fontWeight: '700',
    fontSize: '15px', cursor: 'pointer', marginTop: '4px',
  },
};
