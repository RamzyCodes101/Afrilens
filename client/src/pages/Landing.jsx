import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import IMAGES from '../config/images';
import useIsMobile from '../hooks/useIsMobile';

/* ─── Scroll reveal hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateY(${y}px)`,
      transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={s.page}>

      {/* ── Navigation ── */}
      <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
        <Link to="/" style={s.navLogo}>AfriLens</Link>
        <div style={s.navCenter}>
          <Link to="/gallery" style={s.navLink}>Gallery</Link>
          <a href="#about" style={s.navLink}>About</a>
          <a href="#stories" style={s.navLink}>Stories</a>
        </div>
        <Link to="/gallery" style={s.navCta}>Explore collection</Link>
      </nav>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <img
          src={IMAGES.hero}
          alt="AfriLens hero"
          style={{ ...s.heroBgImg, opacity: heroLoaded ? 1 : 0 }}
          onLoad={() => setHeroLoaded(true)}
        />
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <p style={{ ...s.heroLabel, opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
            Free African Imagery
          </p>
          <h1 style={{ ...s.heroTitle, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'none' : 'translateY(30px)', transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s' }}>
            Africa's story,<br />
            <em style={s.heroEm}>freely told.</em>
          </h1>
          <p style={{ ...s.heroSub, opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease 0.9s' }}>
            A curated library of high-quality photography and art<br />
            celebrating the depth of African life. Free to use, forever.
          </p>
          <div style={{ ...s.heroCtas, opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease 1.1s' }}>
            <Link to="/gallery" style={s.heroBtn}>
              Browse the collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#about" style={s.heroGhostBtn}>Our story</a>
          </div>
        </div>
        <div style={s.heroBottom}>
          <div style={s.heroStat}><span style={s.heroStatNum}>100%</span><span style={s.heroStatLabel}>Free</span></div>
          <div style={s.heroStatDivider} />
          <div style={s.heroStat}><span style={s.heroStatNum}>HD</span><span style={s.heroStatLabel}>Quality</span></div>
          <div style={s.heroStatDivider} />
          <div style={s.heroStat}><span style={s.heroStatNum}>∞</span><span style={s.heroStatLabel}>Downloads</span></div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div style={s.ticker}>
        <div style={s.tickerTrack}>
          {Array(3).fill(['Photography', 'Art', 'Culture', 'Wildlife', 'People', 'Architecture', 'Fashion', 'Nature', 'Portraits', 'Landscapes']).flat().map((t, i) => (
            <span key={i} style={s.tickerItem}>{t} <span style={s.tickerDot}>·</span></span>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" style={{ ...s.about, padding: isMobile ? '80px 24px' : '140px 48px' }}>
        <Reveal>
          <p style={s.sectionTag}>About AfriLens</p>
        </Reveal>
        <Reveal delay={120}>
          <h2 style={s.aboutHeadline}>
            The visual richness of Africa<br />
            has always deserved a global stage.
          </h2>
        </Reveal>
        <div style={s.aboutBody}>
          <Reveal delay={200} style={{ flex: 1 }}>
            <p style={s.aboutText}>
              AfriLens was created out of a simple frustration: the world's most popular image libraries
              consistently underrepresent Africa's landscapes, people, and cultures. We set out to change that —
              one high-quality image at a time.
            </p>
          </Reveal>
          <Reveal delay={300} style={{ flex: 1 }}>
            <p style={s.aboutText}>
              Every image in our library is free to download, share, and use in your projects.
              No watermarks, no paywalls, no barriers. Just authentic African imagery,
              made accessible to the world.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="stories" style={{ ...s.featureSection, padding: isMobile ? '0 24px 80px' : '0 48px 140px' }}>
        <Reveal style={s.featureHeaderWrap}>
          <p style={s.sectionTag}>Selected works</p>
          <Link to="/gallery" style={s.featureSeeAll}>View all images →</Link>
        </Reveal>

        <div style={{ ...s.featureGrid, gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr' }}>
          {/* Row 1 */}
          <Reveal delay={0} style={s.featureItemLarge}>
            <FeatureCard img={IMAGES.feature1} title="People of the Sahel" category="Photography" />
          </Reveal>
          <Reveal delay={100} style={s.featureItemSmall}>
            <FeatureCard img={IMAGES.feature2} title="East African Light" category="Landscape" />
          </Reveal>
          {/* Row 2 */}
          <Reveal delay={100} style={s.featureItemSmall}>
            <FeatureCard img={IMAGES.feature3} title="Urban Stories" category="Culture" />
          </Reveal>
          <Reveal delay={0} style={s.featureItemLarge}>
            <FeatureCard img={IMAGES.feature4} title="Wild Africa" category="Wildlife" />
          </Reveal>
        </div>
      </section>

      {/* ── Story / Editorial ── */}
      <section style={{ ...s.story, padding: isMobile ? '80px 24px' : '140px 48px', flexDirection: isMobile ? 'column' : 'row' }}>
        <Reveal style={s.storyText}>
          <p style={s.sectionTag}>Our mission</p>
          <h2 style={s.storyHeadline}>
            "Africa is not a country —
            it is a world of a billion stories."
          </h2>
          <p style={s.storyBody}>
            From the street markets of Lagos to the mountain peaks of Ethiopia,
            from the coastlines of Senegal to the deserts of Namibia —
            AfriLens exists to make that full spectrum visible.
          </p>
          <Link to="/gallery" style={s.storyBtn}>
            Start exploring
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </Reveal>
        <Reveal delay={150} style={s.storyImage}>
          <img src={IMAGES.story} alt="African story" style={s.storyImg} />
          <div style={s.storyImgOverlay} />
        </Reveal>
      </section>

      {/* ── Stats ── */}
      <section style={{ ...s.statsSection, padding: isMobile ? '60px 24px' : '100px 48px' }}>
        <Reveal>
          <div style={s.statsGrid}>
            {[
              { num: '100%', desc: 'Free to download and use in any project' },
              { num: 'HD', desc: 'High-resolution files, ready for print or web' },
              { num: '0', desc: 'Attribution required — though always appreciated' },
              { num: '∞', desc: 'Download limit — take as many as you need' },
            ].map(({ num, desc }) => (
              <div key={num} style={s.statCard}>
                <span style={s.statNum}>{num}</span>
                <div style={s.statDivider} />
                <p style={s.statDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <img src={IMAGES.cta} alt="" style={s.ctaBg} />
        <div style={s.ctaOverlay} />
        <div style={s.ctaContent}>
          <Reveal>
            <p style={s.ctaTag}>Ready?</p>
            <h2 style={s.ctaHeadline}>
              The collection<br />is waiting for you.
            </h2>
            <Link to="/gallery" style={s.ctaBtn}>
              Enter the gallery
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div>
            <p style={s.footerLogo}>AfriLens</p>
            <p style={s.footerTagline}>Free African photography & art</p>
          </div>
          <div style={s.footerLinks}>
            <div style={s.footerCol}>
              <p style={s.footerColHead}>Explore</p>
              <Link to="/gallery" style={s.footerLink}>Gallery</Link>
              <a href="#about" style={s.footerLink}>About</a>
            </div>
            <div style={s.footerCol}>
              <p style={s.footerColHead}>Access</p>
              <Link to="/login" style={s.footerLink}>Admin</Link>
              <Link to="/gallery" style={s.footerLink}>Browse free</Link>
            </div>
          </div>
        </div>
        <div style={s.footerBottom}>
          <p style={s.footerCopy}>© 2026 AfriLens. All images free to use.</p>
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .feature-card:hover .feature-overlay { opacity: 1 !important; }
        .feature-card:hover img { transform: scale(1.06) !important; }
        .nav-link:hover { color: #fff !important; }
        .hero-btn:hover { background: #fff !important; }
        .story-btn:hover { gap: 14px !important; }
      `}</style>
    </div>
  );
}

function FeatureCard({ img, title, category }) {
  return (
    <div className="feature-card" style={s.featureCard}>
      <img src={img} alt={title} style={s.featureImg} />
      <div className="feature-overlay" style={s.featureOverlay}>
        <p style={s.featureCategory}>{category}</p>
        <p style={s.featureTitle}>{title}</p>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#0e0e0e', color: '#f5f5f0', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' },

  // Nav
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: '64px',
    transition: 'background 0.4s ease, border-color 0.4s ease',
    borderBottom: '1px solid transparent',
  },
  navScrolled: {
    background: 'rgba(14,14,14,0.9)',
    backdropFilter: 'blur(20px)',
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  navLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px', fontWeight: '800', color: '#f5f5f0',
    letterSpacing: '-0.5px',
  },
  navCenter: { display: 'flex', gap: '4px' },
  navLink: {
    fontSize: '13px', color: '#666', padding: '7px 14px',
    borderRadius: '8px', transition: 'color 0.2s',
    fontWeight: '450',
  },
  navCta: {
    fontSize: '13px', fontWeight: '600', color: '#0e0e0e',
    background: '#f5f5f0', padding: '8px 18px', borderRadius: '8px',
    transition: 'opacity 0.2s',
  },

  // Hero
  hero: {
    position: 'relative', height: '100vh', minHeight: '600px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center', overflow: 'hidden',
  },
  heroBgImg: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center',
    transition: 'opacity 1.2s ease',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(105deg, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.6) 50%, rgba(14,14,14,0.3) 100%)',
  },
  heroContent: {
    position: 'relative', zIndex: 2,
    padding: '0 24px', maxWidth: '800px',
  },
  heroLabel: {
    fontSize: '11px', color: 'rgba(245,245,240,0.5)', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '28px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(52px, 7.5vw, 96px)',
    fontWeight: '900', lineHeight: 1.0,
    color: '#f5f5f0', margin: '0 0 28px',
    letterSpacing: '-2.5px',
  },
  heroEm: { fontStyle: 'italic', color: '#E8A020' },
  heroSub: {
    fontSize: '16px', color: 'rgba(245,245,240,0.55)',
    lineHeight: 1.75, maxWidth: '460px',
    margin: '0 0 44px', fontWeight: '400',
  },
  heroCtas: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
  heroBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    background: '#f5f5f0', color: '#0e0e0e',
    fontWeight: '700', fontSize: '14px',
    padding: '13px 26px', borderRadius: '10px',
    transition: 'background 0.2s',
  },
  heroGhostBtn: {
    fontSize: '14px', color: 'rgba(245,245,240,0.55)',
    borderBottom: '1px solid rgba(245,245,240,0.2)',
    paddingBottom: '2px', fontWeight: '450',
  },
  heroBottom: {
    position: 'absolute', bottom: '32px', left: '24px', zIndex: 2,
    display: 'flex', alignItems: 'center', gap: '20px',
  },
  heroStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  heroStatNum: { fontSize: '22px', fontWeight: '800', color: '#f5f5f0', lineHeight: 1 },
  heroStatLabel: { fontSize: '11px', color: 'rgba(245,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '1px' },
  heroStatDivider: { width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' },

  // Ticker
  ticker: {
    overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: '#0a0a0a', padding: '14px 0',
  },
  tickerTrack: { display: 'flex', animation: 'ticker 35s linear infinite', width: 'max-content' },
  tickerItem: { fontSize: '11px', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '2px', padding: '0 20px', fontWeight: '600', whiteSpace: 'nowrap' },
  tickerDot: { color: '#E8A020', margin: '0 8px' },

  // About
  about: { padding: '140px 48px', maxWidth: '1200px', margin: '0 auto' },
  sectionTag: { fontSize: '11px', color: '#E8A020', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: '28px' },
  aboutHeadline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(30px, 3.5vw, 52px)',
    fontWeight: '800', color: '#f5f5f0',
    lineHeight: 1.15, letterSpacing: '-1px',
    margin: '0 0 56px', maxWidth: '780px',
  },
  aboutBody: { display: 'flex', gap: '64px', flexWrap: 'wrap' },
  aboutText: { fontSize: '15px', color: '#555', lineHeight: 1.9, margin: 0, fontWeight: '400' },

  // Feature Grid
  featureSection: { padding: '0 48px 140px', maxWidth: '1200px', margin: '0 auto' },
  featureHeaderWrap: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  featureSeeAll: { fontSize: '13px', color: '#E8A020', fontWeight: '600', borderBottom: '1px solid rgba(232,160,32,0.3)', paddingBottom: '2px' },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gridTemplateRows: 'auto auto',
    gap: '10px',
  },
  featureItemLarge: {},
  featureItemSmall: {},
  featureCard: {
    position: 'relative', borderRadius: '12px', overflow: 'hidden',
    cursor: 'pointer', aspectRatio: '4/3',
  },
  featureImg: {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
  },
  featureOverlay: {
    position: 'absolute', inset: 0, opacity: 0,
    background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.75) 100%)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end', padding: '20px',
    transition: 'opacity 0.4s ease',
  },
  featureCategory: { fontSize: '10px', color: '#E8A020', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', margin: '0 0 4px' },
  featureTitle: { fontSize: '15px', color: '#f5f5f0', fontWeight: '700', margin: 0 },

  // Story
  story: {
    display: 'flex', gap: '80px', alignItems: 'center',
    padding: '140px 48px', maxWidth: '1200px', margin: '0 auto',
    flexWrap: 'wrap',
  },
  storyText: { flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '24px' },
  storyHeadline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(24px, 2.8vw, 40px)',
    fontWeight: '800', color: '#f5f5f0',
    lineHeight: 1.25, letterSpacing: '-0.5px', margin: 0,
    fontStyle: 'italic',
  },
  storyBody: { fontSize: '15px', color: '#555', lineHeight: 1.85, margin: 0 },
  storyBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    fontSize: '14px', color: '#E8A020', fontWeight: '700',
    borderBottom: '1px solid rgba(232,160,32,0.35)', paddingBottom: '3px',
    width: 'fit-content', transition: 'gap 0.2s',
  },
  storyImage: { flex: '1 1 360px', position: 'relative', borderRadius: '16px', overflow: 'hidden' },
  storyImg: { width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' },
  storyImgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(transparent 60%, rgba(14,14,14,0.4) 100%)',
  },

  // Stats
  statsSection: {
    padding: '100px 48px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: '#080808',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', maxWidth: '1100px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden' },
  statCard: { background: '#080808', padding: '48px 36px', display: 'flex', flexDirection: 'column', gap: '16px' },
  statNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: '900',
    color: '#f5f5f0', lineHeight: 1, letterSpacing: '-2px',
  },
  statDivider: { width: '32px', height: '2px', background: '#E8A020' },
  statDesc: { fontSize: '13px', color: '#555', lineHeight: 1.6, margin: 0 },

  // CTA
  ctaSection: { position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '180px 48px' },
  ctaBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' },
  ctaOverlay: { position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.82)' },
  ctaContent: { position: 'relative', zIndex: 2 },
  ctaTag: { fontSize: '11px', color: '#E8A020', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '700', marginBottom: '24px' },
  ctaHeadline: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(44px, 7vw, 88px)',
    fontWeight: '900', color: '#f5f5f0',
    lineHeight: 1.0, letterSpacing: '-2.5px',
    margin: '0 0 48px',
  },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    background: '#f5f5f0', color: '#0e0e0e',
    fontWeight: '800', fontSize: '15px',
    padding: '15px 32px', borderRadius: '12px',
    boxShadow: '0 0 80px rgba(245,245,240,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },

  // Footer
  footer: { background: '#080808', borderTop: '1px solid rgba(255,255,255,0.06)' },
  footerTop: {
    display: 'flex', justifyContent: 'space-between',
    padding: '64px 48px 48px', flexWrap: 'wrap', gap: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  footerLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '24px', fontWeight: '800', color: '#f5f5f0', margin: '0 0 8px',
  },
  footerTagline: { fontSize: '13px', color: '#3a3a3a', margin: 0 },
  footerLinks: { display: 'flex', gap: '64px' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  footerColHead: { fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', margin: '0 0 4px' },
  footerLink: { fontSize: '14px', color: '#555', transition: 'color 0.2s' },
  footerBottom: { padding: '24px 48px' },
  footerCopy: { fontSize: '12px', color: '#2a2a2a', margin: 0 },
};
