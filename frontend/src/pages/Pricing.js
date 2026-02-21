import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PACKAGES = [
  {
    name: 'Basic',
    tagline: 'Perfect for a quick freshen-up',
    price: { once: 79, weekly: 59, biweekly: 69 },
    color: '#f9f8f5',
    textColor: '#0f1a2e',
    accent: '#3ecfb0',
    includes: [
      'Living room & bedrooms',
      'Kitchen surfaces & sink',
      'Bathroom cleaning',
      'Vacuuming & mopping',
      'Trash removal',
    ],
    excludes: ['Inside appliances', 'Deep scrubbing', 'Windows'],
  },
  {
    name: 'Standard',
    tagline: 'Our most popular package',
    price: { once: 139, weekly: 99, biweekly: 119 },
    color: '#0f1a2e',
    textColor: '#f9f8f5',
    accent: '#3ecfb0',
    popular: true,
    includes: [
      'Everything in Basic',
      'Inside microwave & oven',
      'Inside fridge',
      'Window sills & blinds',
      'Baseboards & light fixtures',
      'Laundry folding',
    ],
    excludes: ['Full deep scrubbing', 'Exterior windows'],
  },
  {
    name: 'Premium',
    tagline: 'The complete experience',
    price: { once: 219, weekly: 169, biweekly: 189 },
    color: '#f9f8f5',
    textColor: '#0f1a2e',
    accent: '#3ecfb0',
    includes: [
      'Everything in Standard',
      'Full deep clean',
      'Inside all cabinets',
      'Grout & tile scrubbing',
      'Exterior windows',
      'Same dedicated cleaner',
      'Priority scheduling',
    ],
    excludes: [],
  },
];

const FAQS = [
  { q: 'Do I need to be home during the clean?', a: "Not at all. Many of our clients provide a key or access code. We're fully insured and all cleaners are background-checked." },
  { q: "What if I'm not happy with the result?", a: "We offer a 100% satisfaction guarantee. If something wasn't done to your standard, contact us within 24 hours and we'll return to fix it — free of charge." },
  { q: 'Can I change or cancel my plan?', a: 'Yes, anytime. There are no contracts or cancellation fees. Just give us 48 hours notice before your next scheduled clean.' },
  { q: 'Do you bring your own supplies?', a: 'Yes, we bring everything we need. If you have a preference for specific products or have allergies, just let us know in your booking notes.' },
  { q: 'How do I get a custom quote?', a: 'Click the "Request a Custom Quote" button below the packages and fill in your details. We\'ll get back to you within a few hours.' },
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

export default function Pricing() {
  const [frequency, setFrequency] = useState('biweekly');
  const [openFaq, setOpenFaq] = useState(null);

  const frequencyLabels = { once: 'One-Time', weekly: 'Weekly', biweekly: 'Bi-Weekly' };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f8f5', color: '#0f1a2e' }}>
      <style>{`
        @media (max-width: 900px) {
          .packages-grid { grid-template-columns: 1fr !important; max-width: 480px; margin-left: auto; margin-right: auto; }
          .packages-grid > div { transform: scale(1) !important; }
        }
        @media (max-width: 768px) {
          .custom-quote-banner { flex-direction: column !important; text-align: center; }
          .freq-toggle button { padding: 10px 14px !important; font-size: 13px !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1a2e 0%, #162640 100%)',
        padding: '160px 5% 100px',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(62,207,176,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <p style={{ color: '#3ecfb0', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>Transparent Pricing</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#f9f8f5', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 24 }}>
            Simple plans.<br />
            <em style={{ color: '#3ecfb0' }}>No surprises.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(249,248,245,0.6)', lineHeight: 1.7, fontWeight: 300 }}>
            Choose a package that works for your space and schedule. Need something custom? We do that too.
          </p>
        </div>
      </section>

      {/* FREQUENCY TOGGLE */}
      <section style={{ padding: '60px 5% 0', textAlign: 'center' }}>
        <div className="freq-toggle" style={{ display: 'inline-flex', background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: 4, gap: 4 }}>
          {Object.entries(frequencyLabels).map(([key, label]) => (
            <button key={key} onClick={() => setFrequency(key)} style={{
              background: frequency === key ? '#0f1a2e' : 'transparent',
              color: frequency === key ? '#f9f8f5' : '#666',
              border: 'none', borderRadius: 2, padding: '10px 24px',
              fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: frequency === key ? 500 : 400,
            }}>
              {label}
              {key === 'biweekly' && (
                <span style={{ marginLeft: 6, background: '#3ecfb0', color: '#0f1a2e', fontSize: 10, padding: '2px 6px', borderRadius: 2, fontWeight: 600 }}>SAVE</span>
              )}
            </button>
          ))}
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: '#999' }}>
          {frequency === 'once' ? 'One-time booking, no commitment' : frequency === 'weekly' ? 'Billed weekly — cancel anytime' : 'Best value — billed every two weeks'}
        </p>
      </section>

      {/* PACKAGES */}
      <section style={{ padding: '48px 5% 100px' }}>
        <div className="packages-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {PACKAGES.map((pkg, i) => (
            <FadeIn key={pkg.name} delay={i * 0.1}>
              <div style={{
                background: pkg.color,
                border: pkg.popular ? '2px solid #3ecfb0' : '1px solid #eae9e4',
                borderRadius: 4,
                padding: '40px 36px',
                position: 'relative',
                transform: pkg.popular ? 'scale(1.03)' : 'scale(1)',
                boxShadow: pkg.popular ? '0 20px 60px rgba(15,26,46,0.15)' : 'none',
              }}>
                {pkg.popular && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#3ecfb0', color: '#0f1a2e', fontSize: 11,
                    fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                    padding: '5px 16px', borderRadius: 2,
                  }}>Most Popular</div>
                )}

                <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: pkg.accent, marginBottom: 8, fontWeight: 500 }}>{pkg.tagline}</p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: pkg.textColor, marginBottom: 24 }}>{pkg.name}</h2>

                <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: `1px solid ${pkg.popular ? 'rgba(255,255,255,0.1)' : '#eae9e4'}` }}>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 52, fontWeight: 700, color: pkg.textColor }}>${pkg.price[frequency]}</span>
                  <span style={{ fontSize: 14, color: pkg.popular ? 'rgba(249,248,245,0.5)' : '#999', marginLeft: 8 }}>
                    {frequency === 'once' ? '/ visit' : frequency === 'weekly' ? '/ week' : '/ visit'}
                  </span>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: pkg.popular ? 'rgba(249,248,245,0.4)' : '#aaa', marginBottom: 16 }}>Includes</p>
                  {pkg.includes.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 18, height: 18, minWidth: 18, background: 'rgba(62,207,176,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#3ecfb0', fontSize: 10, fontWeight: 700 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 14, color: pkg.popular ? 'rgba(249,248,245,0.8)' : '#444' }}>{item}</span>
                    </div>
                  ))}
                  {pkg.excludes.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 18, height: 18, minWidth: 18, background: 'rgba(0,0,0,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#bbb', fontSize: 10 }}>✕</span>
                      </div>
                      <span style={{ fontSize: 14, color: pkg.popular ? 'rgba(249,248,245,0.35)' : '#bbb' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <Link to={`/booking?package=${pkg.name.toLowerCase()}&frequency=${frequency}`} style={{
                  display: 'block', textAlign: 'center',
                  background: pkg.popular ? '#3ecfb0' : 'transparent',
                  color: pkg.popular ? '#0f1a2e' : pkg.textColor,
                  border: pkg.popular ? 'none' : `1.5px solid #0f1a2e`,
                  padding: '14px 0', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500, borderRadius: 2, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  Get Started with {pkg.name}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CUSTOM QUOTE */}
        <FadeIn delay={0.3}>
          <div className="custom-quote-banner" style={{ maxWidth: 1100, margin: '48px auto 0', background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 8, fontWeight: 500 }}>Need Something Different?</p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#0f1a2e', marginBottom: 8 }}>Request a Custom Quote</h3>
              <p style={{ fontSize: 15, color: '#666', fontWeight: 300, lineHeight: 1.6 }}>Large properties, commercial spaces, or unique requirements — we'll build a plan around you.</p>
            </div>
            <Link to="/booking?type=custom" style={{
              background: '#0f1a2e', color: '#f9f8f5',
              padding: '14px 32px', fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              borderRadius: 2, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>Request a Quote</Link>
          </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 5%', background: 'white' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <FadeIn>
            <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 16, fontWeight: 500 }}>FAQ</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#0f1a2e', marginBottom: 48, lineHeight: 1.2 }}>
              Common questions
            </h2>
          </FadeIn>
          {FAQS.map((faq, i) => (
            <FadeIn key={faq.q} delay={i * 0.05}>
              <div style={{ borderBottom: '1px solid #eae9e4' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '22px 0', textAlign: 'left', gap: 16,
                }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 500, color: '#0f1a2e' }}>{faq.q}</span>
                  <span style={{ color: '#3ecfb0', fontSize: 20, lineHeight: 1, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', minWidth: 20 }}>+</span>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.4s ease',
                }}>
                  <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, fontWeight: 300, paddingBottom: 22 }}>{faq.a}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>
  );
}