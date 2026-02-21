import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: '🏠',
    title: 'Residential Cleaning',
    tagline: 'Your home, spotless.',
    desc: 'We treat every home like our own — with care, attention, and the highest standards. Whether it\'s a studio apartment or a large family home, we\'ve got it covered.',
    includes: ['Living rooms & bedrooms', 'Kitchens & appliances', 'Bathrooms & fixtures', 'Floors, windows & surfaces'],
    duration: '2 – 5 hours',
    frequency: 'One-time or recurring',
  },
  {
    icon: '🏢',
    title: 'Corporate Offices',
    tagline: 'Clean spaces, sharp teams.',
    desc: 'First impressions matter. We keep your workplace spotless, hygienic, and welcoming — working around your schedule so operations are never disrupted.',
    includes: ['Workstations & common areas', 'Kitchens & break rooms', 'Restrooms & facilities', 'Reception & meeting rooms'],
    duration: 'Flexible to your needs',
    frequency: 'Daily, weekly or monthly',
  },
  {
    icon: '✨',
    title: 'Deep Cleaning',
    tagline: 'The full reset.',
    desc: 'For the moments that call for more than a standard clean. We go into every corner, every crevice, every surface — leaving nothing behind but spotless.',
    includes: ['Inside appliances & cabinets', 'Grout, tiles & hard-to-reach areas', 'Full bathroom sanitization', 'Baseboards, vents & light fixtures'],
    duration: '4 – 8 hours',
    frequency: 'One-time or seasonal',
  },
  {
    icon: '🔄',
    title: 'Regular Maintenance',
    tagline: 'Set it and forget it.',
    desc: 'Consistency is the key to a truly clean space. Sign up for a recurring plan and never have to think about cleaning again — we handle everything.',
    includes: ['Customizable cleaning checklist', 'Same trusted cleaner each visit', 'Priority scheduling', 'Flexible plan adjustments'],
    duration: '1.5 – 3 hours per visit',
    frequency: 'Weekly or bi-weekly',
  },
  {
    icon: '🛋️',
    title: 'Move In / Move Out',
    tagline: 'Start fresh. Leave clean.',
    desc: 'Moving is stressful enough. Let us handle the cleaning so your new place is ready to live in — or your old one is ready to hand back.',
    includes: ['Full property clean top to bottom', 'Inside all cabinets & drawers', 'Appliance interiors', 'Walls, doors & skirting boards'],
    duration: '4 – 7 hours',
    frequency: 'One-time',
  },
  {
    icon: '🌿',
    title: 'Eco-Friendly Cleaning',
    tagline: 'Clean home, clean planet.',
    desc: 'All our eco cleans use certified non-toxic, biodegradable products — safe for children, pets, and the environment without sacrificing results.',
    includes: ['Non-toxic certified products', 'Safe for kids & pets', 'Biodegradable packaging', 'All service types available'],
    duration: 'Same as standard services',
    frequency: 'Any frequency',
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function Services() {
  const [activeService, setActiveService] = useState(null);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f8f5', color: '#0f1a2e' }}>
      <style>{`
        .service-row { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; padding: 80px 0; border-bottom: 1px solid #eae9e4; }
        .service-row:last-child { border-bottom: none; }
        .include-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0efe9; font-size: 14px; color: #444; }
        .include-item:last-child { border-bottom: none; }
        .meta-pill { background: #f0efe9; border-radius: 2px; padding: 8px 16px; font-size: 13px; color: #555; display: inline-block; }
        @media (max-width: 768px) {
          .service-row { grid-template-columns: 1fr !important; gap: 28px !important; padding: 48px 0 !important; }
          .services-quick-nav { display: none !important; }
          .service-cta-box { padding: 48px 24px !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1a2e 0%, #162640 100%)',
        padding: 'clamp(120px, 15vw, 160px) 5% clamp(60px, 8vw, 100px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(62,207,176,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: '#3ecfb0', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>What We Offer</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 700, color: '#f9f8f5', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 24, maxWidth: 700 }}>
            Every space deserves<br />
            <em style={{ color: '#3ecfb0' }}>to shine.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(249,248,245,0.6)', lineHeight: 1.7, maxWidth: 520, fontWeight: 300 }}>
            From a quick freshen-up to a full deep clean, we have a service for every space, schedule, and budget.
          </p>
        </div>
      </section>

      {/* QUICK NAV */}
      <section className="services-quick-nav" style={{ background: 'white', borderBottom: '1px solid #eae9e4', padding: '0 5%', position: 'sticky', top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {SERVICES.map((s, i) => (
            <button key={s.title} onClick={() => {
              setActiveService(i);
              document.getElementById(`service-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '18px 24px', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              color: activeService === i ? '#3ecfb0' : '#666',
              borderBottom: activeService === i ? '2px solid #3ecfb0' : '2px solid transparent',
              transition: 'color 0.2s, border-color 0.2s', whiteSpace: 'nowrap',
              fontWeight: activeService === i ? 500 : 400,
            }}>
              {s.icon} {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* SERVICES LIST */}
      <section style={{ padding: '0 5% clamp(60px, 8vw, 100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {SERVICES.map((s, i) => (
            <div id={`service-${i}`} key={s.title} className="service-row">
              <FadeIn delay={0.1}>
                <div>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>{s.icon}</div>
                  <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 12, fontWeight: 500 }}>{s.tagline}</p>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, color: '#0f1a2e', marginBottom: 20, lineHeight: 1.2 }}>{s.title}</h2>
                  <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#555', lineHeight: 1.75, fontWeight: 300, marginBottom: 32 }}>{s.desc}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                    <div className="meta-pill">⏱ {s.duration}</div>
                    <div className="meta-pill">📅 {s.frequency}</div>
                  </div>
                  <Link to="/booking" style={{
                    background: '#3ecfb0', color: '#0f1a2e', padding: '13px 28px',
                    fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    borderRadius: 2, textDecoration: 'none', display: 'inline-block',
                    transition: 'background 0.2s',
                  }}>Book This Service</Link>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '36px 32px' }}>
                  <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: 20, fontWeight: 500 }}>What's Included</p>
                  {s.includes.map(item => (
                    <div key={item} className="include-item">
                      <div style={{ width: 20, height: 20, minWidth: 20, background: 'rgba(62,207,176,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#3ecfb0', fontSize: 11, fontWeight: 700 }}>✓</span>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(48px, 8vw, 80px) 5%', background: '#0f1a2e' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <div className="service-cta-box" style={{ padding: '0' }}>
              <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 20, fontWeight: 500 }}>Not Sure Where to Start?</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 700, color: '#f9f8f5', marginBottom: 20, lineHeight: 1.2 }}>
                We'll help you find<br />the right fit.
              </h2>
              <p style={{ color: 'rgba(249,248,245,0.5)', fontSize: 16, marginBottom: 36, fontWeight: 300, lineHeight: 1.6 }}>
                Fill in your details and we'll recommend the best service for your space and schedule.
              </p>
              <Link to="/booking" style={{
                background: '#3ecfb0', color: '#0f1a2e', padding: '16px 40px',
                fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                borderRadius: 2, textDecoration: 'none', display: 'inline-block',
              }}>Get a Free Recommendation</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}