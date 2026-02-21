import { Link } from 'react-router-dom';

const LINKS = [
  ['Services', '/services'],
  ['Pricing', '/pricing'],
  ['Contact', '/contact'],
  ['Book Now', '/booking'],
  // ['Admin', '/admin'],
];
export default function Footer() {
  return (
    <footer style={{ background: '#0a1220', padding: '48px 5% 32px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: '#f9f8f5' }}>
            <span style={{ color: '#3ecfb0' }}>✦</span> CleanCo
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {LINKS.map(([label, path]) => (
              <Link key={path} to={path} style={{ fontSize: 13, color: 'rgba(249,248,245,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#3ecfb0'}
                onMouseOut={e => e.target.style.color = 'rgba(249,248,245,0.4)'}
              >{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(249,248,245,0.25)' }}>© 2025 CleanCo. All rights reserved.</p>
          <p style={{ fontSize: 12, color: 'rgba(249,248,245,0.25)' }}>Privacy · Terms</p>
        </div>
      </div>
    </footer>
  );
}