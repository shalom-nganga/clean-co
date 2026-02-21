import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const navBg = isHome
    ? scrolled ? 'rgba(15,26,46,0.97)' : 'transparent'
    : '#0f1a2e';

  return (
    <>
      <style>{`
        .nav-link-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          letter-spacing: 0.8px; text-transform: uppercase;
          text-decoration: none; transition: color 0.2s;
        }
        .nav-link-item:hover { color: #3ecfb0 !important; }
        .hamburger { display: none; }
        .desktop-links { display: flex; }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .desktop-links { display: none; }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: menuOpen ? 'rgba(15,26,46,0.99)' : navBg,
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#f9f8f5', letterSpacing: '-0.3px' }}>
              <span style={{ color: '#3ecfb0' }}>✦</span> CleanCo
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="desktop-links" style={{ gap: 36, alignItems: 'center' }}>
            {[['Services', '/services'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, path]) => (
              <Link key={path} to={path} className="nav-link-item" style={{
                color: location.pathname === path ? '#3ecfb0' : '#f9f8f5',
              }}>{label}</Link>
            ))}
            <Link to="/booking" style={{
              background: '#3ecfb0', color: '#0f1a2e',
              padding: '10px 22px', fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              borderRadius: 2, textDecoration: 'none',
            }}>Book Now</Link>
          </div>

          {/* HAMBURGER */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 5, padding: 4,
          }}>
            <span style={{ display: 'block', width: 24, height: 2, background: '#f9f8f5', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#f9f8f5', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#f9f8f5', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div style={{
          maxHeight: menuOpen ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease',
        }}>
          <div style={{ padding: '16px 0 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[['Services', '/services'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, path]) => (
              <Link key={path} to={path} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 16,
                color: location.pathname === path ? '#3ecfb0' : 'rgba(249,248,245,0.85)',
                textDecoration: 'none', padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                letterSpacing: '0.5px',
              }}>{label}</Link>
            ))}
            <Link to="/booking" style={{
              background: '#3ecfb0', color: '#0f1a2e',
              padding: '14px', fontSize: 15, textAlign: 'center',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              borderRadius: 2, textDecoration: 'none', marginTop: 16,
            }}>Book Now</Link>
          </div>
        </div>
      </nav>
    </>
  );
}