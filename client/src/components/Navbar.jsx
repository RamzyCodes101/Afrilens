import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        AfriLens
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Gallery</Link>
        {isAdmin ? (
          <>
            <Link to="/admin" style={styles.link}>Upload</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Admin</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px', background: '#0f0f0f', borderBottom: '1px solid #222',
  },
  logo: {
    fontSize: '22px', fontWeight: '800', color: '#e8a020',
    textDecoration: 'none', letterSpacing: '-0.5px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '24px' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  btn: {
    background: 'none', border: '1px solid #444', color: '#ccc',
    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
  },
};
