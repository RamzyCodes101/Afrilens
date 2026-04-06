import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useIsMobile from '../hooks/useIsMobile';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo} onClick={close}>
          <span style={styles.logoIcon}>◈</span>
          AfriLens
        </Link>

        {isMobile ? (
          <button onClick={() => setMenuOpen(o => !o)} style={styles.hamburger}>
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        ) : (
          <div style={styles.links}>
            <Link to="/gallery" style={{ ...styles.link, ...(isActive('/gallery') ? styles.linkActive : {}) }}>Gallery</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>Upload</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Sign out</button>
              </>
            ) : (
              <Link to="/login" style={styles.adminBtn}>Admin</Link>
            )}
          </div>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && menuOpen && (
        <div style={styles.drawer}>
          <Link to="/gallery" style={styles.drawerLink} onClick={close}>Gallery</Link>
          {isAdmin ? (
            <>
              <Link to="/admin" style={styles.drawerLink} onClick={close}>Upload</Link>
              <button onClick={handleLogout} style={styles.drawerLogout}>Sign out</button>
            </>
          ) : (
            <Link to="/login" style={styles.drawerAdminBtn} onClick={close}>Admin Login</Link>
          )}
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: '60px',
    background: 'rgba(10,10,10,0.45)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '-0.3px',
  },
  logoIcon: { color: '#E8A020', fontSize: '20px' },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: { color: '#fff', fontSize: '14px', fontWeight: '500', padding: '6px 12px', borderRadius: '8px', transition: 'color 0.2s' },
  linkActive: { color: '#fff', background: 'rgba(255,255,255,0.1)' },
  adminBtn: { fontSize: '13px', fontWeight: '600', color: '#000', background: '#E8A020', padding: '7px 16px', borderRadius: '8px' },
  logoutBtn: { fontSize: '13px', fontWeight: '500', color: '#fff', background: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer' },
  hamburger: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },

  // Mobile drawer
  drawer: {
    position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 99,
    background: 'rgba(10,10,10,0.96)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column', padding: '16px 24px 24px', gap: '4px',
  },
  drawerLink: { fontSize: '16px', color: '#fff', fontWeight: '500', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  drawerAdminBtn: { marginTop: '12px', fontSize: '15px', fontWeight: '700', color: '#000', background: '#E8A020', padding: '12px 20px', borderRadius: '10px', textAlign: 'center' },
  drawerLogout: { marginTop: '12px', fontSize: '15px', fontWeight: '500', color: '#888', background: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer' },
};
