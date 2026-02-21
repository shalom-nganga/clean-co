import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  { icon: '🏠', title: 'Residential Cleaning', desc: 'Your home deserves more than clean — it deserves care. We treat every space like our own.' },
  { icon: '🏢', title: 'Corporate Offices', desc: 'A clean workspace fuels productivity. We work around your schedule so your team never skips a beat.' },
  { icon: '✨', title: 'Deep Cleaning', desc: 'For the moments that call for a full reset. Every corner, every surface, spotless.' },
  { icon: '🔄', title: 'Regular Maintenance', desc: 'Consistency is key. Set up a recurring plan and never think about cleaning again.' },
];

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '5★', label: 'Average Rating' },
  { value: '3+', label: 'Years of Service' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Homeowner', text: 'I came home to a place that felt brand new. The attention to detail was incredible — they even folded the towels.' },
  { name: 'James T.', role: 'Office Manager', text: 'Our entire office gets compliments now. The team is professional, punctual, and thorough every single time.' },
  { name: 'Lena K.', role: 'Airbnb Host', text: 'My listings went from 4.7 to 5 stars after switching. Guests always mention how spotless everything is.' },
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

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f8f5', color: '#0f1a2e' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .service-card { background: white; border: 1px solid #eae9e4; padding: 36px 32px; border-radius: 2px; transition: box-shadow 0.3s, transform 0.3s; }
        .service-card:hover { box-shadow: 0 12px 40px rgba(15,26,46,0.08); transform: translateY(-4px); }
        .dot { width: 8px; height: 8px; border-radius: 50%; cursor: pointer; transition: background 0.2s, transform 0.2s; }
        @media (max-width: 768px) {
          .why-us-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; }
          .hero-buttons { flex-direction: column !important; }
          .hero-buttons a { text-align: center; }
          .cta-box { padding: 48px 28px !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1a2e 0%, #162640 60%, #1a2e4a 100%)',
        display: 'flex', alignItems: 'center',
        padding: '0 5%', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '5%', right: '0%', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(62,207,176,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', paddingTop: 80 }}>
          <div style={{ maxWidth: 680, animation: 'fadeUp 0.8s ease 0.1s both' }}>
            <p style={{ color: '#3ecfb0', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 24, fontWeight: 500 }}>
              Professional Cleaning Services
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 700, color: '#f9f8f5', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 28 }}>
              A cleaner space.<br />
              <em style={{ color: '#3ecfb0', fontStyle: 'italic' }}>A clearer mind.</em>
            </h1>
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(249,248,245,0.65)', lineHeight: 1.7, marginBottom: 44, fontWeight: 300, maxWidth: 520 }}>
              We bring professional-grade cleaning to homes and offices across the city — so you can focus on what actually matters.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/booking" style={{
                background: '#3ecfb0', color: '#0f1a2e', padding: '16px 36px',
                fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                borderRadius: 2, textDecoration: 'none',
              }}>Book a Clean</Link>
              <Link to="/services" style={{
                background: 'transparent', color: '#f9f8f5', padding: '15px 36px',
                fontSize: 16, border: '1.5px solid rgba(255,255,255,0.4)',
                borderRadius: 2, textDecoration: 'none',
              }}>View Services</Link>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Scroll</p>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(62,207,176,0.5), transparent)', animation: 'pulse 2s ease infinite' }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0f1a2e', padding: '40px 5%' }}>
        <div className="stats-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div style={{ textAlign: 'center', padding: '16px 0', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#3ecfb0', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(249,248,245,0.5)', marginTop: 6, letterSpacing: '1px', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 5%', background: '#f9f8f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 16, fontWeight: 500 }}>What We Do</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: '#0f1a2e', marginBottom: 16, lineHeight: 1.15 }}>
              Services built for<br />every kind of space
            </h2>
            <p style={{ color: '#667', fontSize: 17, maxWidth: 480, lineHeight: 1.7, marginBottom: 60, fontWeight: 300 }}>
              Whether it's your living room or your boardroom, we show up ready.
            </p>
          </FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.1}>
                <div className="service-card">
                  <div style={{ fontSize: 32, marginBottom: 20 }}>{s.icon}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, marginBottom: 12, color: '#0f1a2e' }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: '#667', lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 5%', background: 'white' }}>
        <div className="why-us-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeIn>
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f1a2e, #1e3a5f)', borderRadius: 4, padding: 'clamp(32px, 5vw, 60px) clamp(24px, 4vw, 48px)', color: 'white' }}>
                <div style={{ fontSize: 64, marginBottom: 24 }}>🧹</div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, lineHeight: 1.2 }}>
                  "We don't just clean.<br />We restore."
                </div>
                <div style={{ width: 40, height: 2, background: '#3ecfb0', marginTop: 24 }} />
              </div>
              <div style={{ position: 'absolute', top: -16, right: -16, width: 100, height: 100, border: '2px solid #3ecfb0', borderRadius: 4, opacity: 0.3 }} />
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 16, fontWeight: 500 }}>Why Choose Us</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 700, color: '#0f1a2e', marginBottom: 32, lineHeight: 1.2 }}>
                The standard is high.<br />The process is simple.
              </h2>
              {[
                { title: 'Vetted Professionals', body: 'Every cleaner is background-checked, trained, and held to our rigorous quality standard.' },
                { title: 'Flexible Scheduling', body: 'Book one-time, weekly, or monthly — we work around your life, not the other way around.' },
                { title: 'Eco-Friendly Products', body: 'Safe for your family, pets, and the planet. We only use certified non-toxic solutions.' },
                { title: 'Satisfaction Guaranteed', body: "Not happy with something? We'll come back and fix it. No questions asked." },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
                  <div style={{ width: 32, height: 32, minWidth: 32, background: '#3ecfb0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <span style={{ color: '#0f1a2e', fontSize: 14, fontWeight: 700 }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 4, color: '#0f1a2e' }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: '#667', lineHeight: 1.6, fontWeight: 300 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 5%', background: '#0f1a2e' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 16, fontWeight: 500 }}>Testimonials</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 700, color: '#f9f8f5', marginBottom: 60, lineHeight: 1.2 }}>
              What our clients say
            </h2>
          </FadeIn>
          <div style={{ position: 'relative', minHeight: 200 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} style={{
                position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0,
                opacity: activeTestimonial === i ? 1 : 0,
                transform: `translateY(${activeTestimonial === i ? 0 : 16}px)`,
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                pointerEvents: activeTestimonial === i ? 'auto' : 'none',
              }}>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(16px, 2.5vw, 24px)', color: '#f9f8f5', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 28 }}>
                  "{t.text}"
                </p>
                <div style={{ color: '#3ecfb0', fontWeight: 500, fontSize: 15 }}>{t.name}</div>
                <div style={{ color: 'rgba(249,248,245,0.4)', fontSize: 13, marginTop: 2 }}>{t.role}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 48 }}>
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className="dot" onClick={() => setActiveTestimonial(i)}
                style={{ background: activeTestimonial === i ? '#3ecfb0' : 'rgba(255,255,255,0.2)', transform: activeTestimonial === i ? 'scale(1.3)' : 'scale(1)' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 5%', background: '#f9f8f5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <FadeIn>
            <div className="cta-box" style={{ background: 'linear-gradient(135deg, #0f1a2e, #162640)', borderRadius: 4, padding: '72px 60px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.15)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(62,207,176,0.05)' }} />
              <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 20, fontWeight: 500 }}>Get Started Today</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 700, color: '#f9f8f5', marginBottom: 20, lineHeight: 1.15 }}>
                Ready for a space<br />you're proud of?
              </h2>
              <p style={{ color: 'rgba(249,248,245,0.55)', fontSize: 16, marginBottom: 40, fontWeight: 300, lineHeight: 1.6 }}>
                Book your first clean in minutes. No contracts, no commitments — just a cleaner space.
              </p>
              <Link to="/booking" style={{
                background: '#3ecfb0', color: '#0f1a2e', padding: '18px 44px',
                fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                borderRadius: 2, textDecoration: 'none', display: 'inline-block',
              }}>Book Your First Clean</Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}