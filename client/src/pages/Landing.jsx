import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const [previews, setPreviews] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    api.get('/images', { params: { limit: 6 } }).then(({ data }) => setPreviews(data.images)).catch(() => {});
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={styles.page}>

      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>◈ AfriLens</span>
        <div style={styles.navLinks}>
          <Link to="/gallery" style={styles.navLink}>Gallery</Link>
          <Link to="/login" style={styles.navLoginBtn}>Admin</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={{ ...styles.heroBg, transform: `translateY(${scrollY * 0.3}px)` }} />
        <div style={styles.heroContent}>
          <p style={styles.heroLabel}>
            <span style={styles.heroDot} /> Est. 2026 · Free African Imagery
          </p>
          <h1 style={styles.heroTitle}>
            The world,<br />
            <em style={styles.heroItalic}>through</em><br />
            an African lens.
          </h1>
          <p style={styles.heroDesc}>
            A curated library of free, high-quality photography and art<br />
            celebrating the depth and beauty of African life.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/gallery" style={styles.heroCtaPrimary}>
              Browse the collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#about" style={styles.heroCtaSecondary}>Learn more</a>
          </div>
        </div>
        <div style={styles.heroScroll}>
          <div style={styles.heroScrollLine} />
          <span style={styles.heroScrollText}>Scroll</span>
        </div>
      </section>

      {/* Marquee */}
      <div style={styles.marqueeWrap}>
        <div style={styles.marqueeTrack}>
          {['Photography', 'Art', 'Culture', 'Wildlife', 'People', 'Architecture', 'Fashion', 'Nature', 'Free to use', 'High resolution',
            'Photography', 'Art', 'Culture', 'Wildlife', 'People', 'Architecture', 'Fashion', 'Nature', 'Free to use', 'High resolution',
          ].map((t, i) => (
            <span key={i} style={styles.marqueeItem}>
              {t} <span style={styles.marqueeDot}>◈</span>
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section id="about" style={styles.about}>
        <div style={styles.aboutInner}>
          <Reveal>
            <p style={styles.sectionNum}>01</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={styles.aboutTitle}>
              Africa has always been<br />
              a world of stories.
            </h2>
          </Reveal>
          <div style={styles.aboutCols}>
            <Reveal delay={200} style={{ flex: 1 }}>
              <p style={styles.aboutText}>
                AfriLens was built because the world's visual platforms
                consistently underrepresent African stories, landscapes, and people.
                We believe that changes by making beautiful African imagery
                freely accessible to everyone.
              </p>
            </Reveal>
            <Reveal delay={300} style={{ flex: 1 }}>
              <p style={styles.aboutText}>
                Every image in our library is free to download and use.
                No attribution required — though always appreciated.
                Just beautiful imagery, available to all.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <section style={styles.previewSection}>
          <div style={styles.previewHeader}>
            <Reveal>
              <p style={styles.sectionNum}>02</p>
              <h2 style={styles.previewTitle}>Selected works</h2>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/gallery" style={styles.seeAllLink}>
                See all images →
              </Link>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div style={styles.previewGrid}>
              {previews.slice(0, 5).map((img, i) => (
                <Link
                  to={`/image/${img.id}`}
                  key={img.id}
                  style={{ ...styles.previewItem, ...getPreviewStyle(i) }}
                >
                  <img src={img.url} alt={img.title} style={styles.previewImg} />
                  <div style={styles.previewOverlay}>
                    <span style={styles.previewCat}>{img.category}</span>
                    <span style={styles.previewName}>{img.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* Stats */}
      <section style={styles.stats}>
        <Reveal>
          <div style={styles.statsInner}>
            <p style={styles.sectionNum}>03</p>
            <div style={styles.statsGrid}>
              {[
                { num: '100%', label: 'Free to use' },
                { num: '∞', label: 'Downloads' },
                { num: '0', label: 'Attribution required' },
                { num: '1', label: 'Continent, infinite stories' },
              ].map(({ num, label }) => (
                <div key={label} style={styles.statItem}>
                  <span style={styles.statNum}>{num}</span>
                  <span style={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <div style={styles.ctaGlow} />
        <Reveal>
          <p style={styles.ctaEyebrow}>Ready to explore?</p>
          <h2 style={styles.ctaTitle}>
            The collection<br />awaits you.
          </h2>
          <Link to="/gallery" style={styles.ctaBtn}>
            Enter the gallery
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLeft}>
          <span style={styles.footerLogo}>◈ AfriLens</span>
          <span style={styles.footerTagline}>Free African photography & art</span>
        </div>
        <div style={styles.footerRight}>
          <Link to="/gallery" style={styles.footerLink}>Gallery</Link>
          <Link to="/login" style={styles.footerLink}>Admin</Link>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .preview-item:hover img {
          transform: scale(1.05);
        }
        .preview-item:hover .preview-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

function getPreviewStyle(i) {
  const layouts = [
    { gridColumn: '1 / 3', gridRow: '1 / 3', aspectRatio: '16/10' },
    { gridColumn: '3', gridRow: '1', aspectRatio: '1/1' },
    { gridColumn: '3', gridRow: '2', aspectRatio: '1/1' },
    { gridColumn: '1', gridRow: '3', aspectRatio: '4/3' },
    { gridColumn: '2 / 4', gridRow: '3', aspectRatio: '16/9' },
  ];
  return layouts[i] || {};
}

const styles = {
  page: { background: '#080808', color: '#f0f0f0', overflowX: 'hidden' },

  // Nav
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 48px', height: '64px',
    background: 'rgba(8,8,8,0.8)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    animation: 'fadeDown 0.8s ease both',
  },
  navLogo: { fontSize: '16px', fontWeight: '800', color: '#fff' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLink: { fontSize: '13px', color: '#888', padding: '6px 12px', borderRadius: '8px' },
  navLoginBtn: {
    fontSize: '12px', fontWeight: '700', color: '#000',
    background: '#E8A020', padding: '7px 16px', borderRadius: '8px',
  },

  // Hero
  hero: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    padding: '0 48px', overflow: 'hidden',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(232,160,32,0.06) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative', zIndex: 1,
    maxWidth: '760px', paddingTop: '64px',
    animation: 'fadeDown 1s cubic-bezier(0.16,1,0.3,1) both',
  },
  heroLabel: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '12px', color: '#555', fontWeight: '500',
    letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '32px',
  },
  heroDot: {
    display: 'inline-block', width: '6px', height: '6px',
    background: '#E8A020', borderRadius: '50',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(52px, 8vw, 100px)',
    fontWeight: '900', lineHeight: 1.0,
    color: '#fff', margin: '0 0 32px', letterSpacing: '-2px',
  },
  heroItalic: { fontStyle: 'italic', color: '#E8A020' },
  heroDesc: {
    fontSize: '16px', color: '#555', lineHeight: 1.8,
    maxWidth: '480px', margin: '0 0 48px',
  },
  heroCtas: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  heroCtaPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#E8A020', color: '#000', fontWeight: '800',
    padding: '14px 28px', borderRadius: '12px', fontSize: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 0 40px rgba(232,160,32,0.2)',
  },
  heroCtaSecondary: {
    fontSize: '14px', color: '#555', fontWeight: '500',
    borderBottom: '1px solid #333', paddingBottom: '2px',
    transition: 'color 0.2s',
  },
  heroScroll: {
    position: 'absolute', bottom: '40px', left: '48px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  heroScrollLine: {
    width: '1px', height: '48px',
    background: 'linear-gradient(#E8A020, transparent)',
    animation: 'pulse 2s ease infinite',
  },
  heroScrollText: { fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase', writingMode: 'vertical-lr' },

  // Marquee
  marqueeWrap: {
    overflow: 'hidden', padding: '16px 0',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: '#0a0a0a',
  },
  marqueeTrack: {
    display: 'flex', whiteSpace: 'nowrap',
    animation: 'marquee 30s linear infinite',
  },
  marqueeItem: { fontSize: '12px', color: '#333', fontWeight: '500', padding: '0 20px', letterSpacing: '1px', textTransform: 'uppercase' },
  marqueeDot: { color: '#E8A020', margin: '0 4px' },

  // About
  about: { padding: '120px 48px' },
  aboutInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionNum: { fontSize: '12px', color: '#333', letterSpacing: '2px', margin: '0 0 24px', fontFamily: 'monospace' },
  aboutTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 4vw, 56px)',
    fontWeight: '800', color: '#fff', lineHeight: 1.15,
    margin: '0 0 48px', letterSpacing: '-1px',
  },
  aboutCols: { display: 'flex', gap: '48px', flexWrap: 'wrap' },
  aboutText: { fontSize: '16px', color: '#555', lineHeight: 1.85, margin: 0 },

  // Preview
  previewSection: { padding: '0 48px 120px' },
  previewHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: '32px', maxWidth: '1100px', margin: '0 auto 32px',
  },
  previewTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: '800',
    color: '#fff', margin: '8px 0 0', letterSpacing: '-1px',
  },
  seeAllLink: {
    fontSize: '13px', color: '#E8A020', fontWeight: '600',
    borderBottom: '1px solid rgba(232,160,32,0.3)', paddingBottom: '2px',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'auto',
    gap: '8px', maxWidth: '1100px', margin: '0 auto',
  },
  previewItem: {
    position: 'relative', overflow: 'hidden', borderRadius: '10px',
    cursor: 'pointer', display: 'block',
  },
  previewImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
  },
  previewOverlay: {
    position: 'absolute', inset: 0, opacity: 0,
    background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8) 100%)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end', padding: '16px',
    transition: 'opacity 0.3s ease',
  },
  previewCat: { fontSize: '10px', color: '#E8A020', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '4px' },
  previewName: { fontSize: '13px', color: '#fff', fontWeight: '600' },

  // Stats
  stats: {
    padding: '120px 48px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: '#0a0a0a',
  },
  statsInner: { maxWidth: '1100px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginTop: '24px' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: '900',
    color: '#fff', lineHeight: 1, letterSpacing: '-2px',
  },
  statLabel: { fontSize: '13px', color: '#444', lineHeight: 1.5 },

  // CTA
  cta: {
    position: 'relative', textAlign: 'center',
    padding: '160px 48px', overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(232,160,32,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaEyebrow: {
    fontSize: '12px', color: '#E8A020', textTransform: 'uppercase',
    letterSpacing: '3px', marginBottom: '24px', fontWeight: '600',
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: '900',
    color: '#fff', lineHeight: 1.05, letterSpacing: '-2px',
    margin: '0 0 48px',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#E8A020', color: '#000',
    fontWeight: '800', fontSize: '16px',
    padding: '16px 36px', borderRadius: '14px',
    boxShadow: '0 0 60px rgba(232,160,32,0.25)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  // Footer
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 48px', borderTop: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap', gap: '12px',
  },
  footerLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  footerLogo: { fontSize: '14px', fontWeight: '800', color: '#E8A020' },
  footerTagline: { fontSize: '12px', color: '#333' },
  footerRight: { display: 'flex', gap: '24px' },
  footerLink: { fontSize: '13px', color: '#444' },
};
