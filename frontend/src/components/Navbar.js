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

  const navBg = isHome
    ? scrolled ? 'rgba(15,26,46,0.97)' : 'transparent'
    : '#0f1a2e';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: navBg,
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      transition: 'all 0.4s ease',
      padding: '0 5%',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#f9f8f5', letterSpacing: '-0.3px' }}>
            <span style={{ color: '#3ecfb0' }}>✦</span> CleanCo
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {[['Services', '/services'], ['Pricing', '/pricing'], ['Contact', '/booking']].map(([label, path]) => (
            <Link key={path} to={path} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 400,
              letterSpacing: '0.8px', textTransform: 'uppercase',
              color: location.pathname === path ? '#3ecfb0' : '#f9f8f5',
              textDecoration: 'none', transition: 'color 0.2s',
            }}>{label}</Link>
          ))}
          <Link to="/booking" style={{
            background: '#3ecfb0', color: '#0f1a2e',
            padding: '10px 22px', fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            borderRadius: 2, textDecoration: 'none',
            transition: 'background 0.2s',
          }}>Book Now</Link>
        </div>
      </div>
    </nav>
  );
}