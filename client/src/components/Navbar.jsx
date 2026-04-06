import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoIcon}>◈</span>
        AfriLens
      </Link>

      <div style={styles.links}>
        <Link to="/gallery" style={{ ...styles.link, ...(isActive('/gallery') ? styles.linkActive : {}) }}>
          Gallery
        </Link>
        {isAdmin ? (
          <>
            <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>
              Upload
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
          </>
        ) : (
          <Link to="/login" style={styles.adminBtn}>Admin</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: '64px',
    background: 'rgba(10,10,10,0.45)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '18px', fontWeight: '800', color: '#fff',
    letterSpacing: '-0.3px',
  },
  logoIcon: { color: '#E8A020', fontSize: '20px' },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: {
    color: '#888', fontSize: '14px', fontWeight: '500',
    padding: '6px 12px', borderRadius: '8px',
    transition: 'color 0.2s',
  },
  linkActive: { color: '#fff', background: 'rgba(255,255,255,0.06)' },
  adminBtn: {
    fontSize: '13px', fontWeight: '600', color: '#000',
    background: '#E8A020', padding: '7px 16px',
    borderRadius: '8px', transition: 'opacity 0.2s',
  },
  logoutBtn: {
    fontSize: '13px', fontWeight: '500', color: '#888',
    background: 'none', border: '1px solid rgba(255,255,255,0.1)',
    padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },
};
