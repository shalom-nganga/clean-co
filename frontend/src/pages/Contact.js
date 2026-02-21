import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '1px solid #e0dfd9', borderRadius: 2,
  fontFamily: "'DM Sans', sans-serif", fontSize: 15,
  color: '#0f1a2e', background: 'white',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: '#444', marginBottom: 8, letterSpacing: '0.3px',
};

const CONTACT_INFO = [
  { icon: '📞', label: 'Phone', value: '+1 (555) 123 4567', sub: 'Mon – Sat, 8am – 6pm' },
  { icon: '📧', label: 'Email', value: 'hello@cleanco.com', sub: 'We reply within a few hours' },
  { icon: '📍', label: 'Address', value: '123 Clean Street, New York, NY 10001', sub: 'By appointment only' },
];

const SOCIALS = [
  { label: 'Instagram', icon: '📸', handle: '@cleanco', url: '#' },
  { label: 'Facebook', icon: '👍', handle: 'CleanCo', url: '#' },
  { label: 'Twitter / X', icon: '🐦', handle: '@cleanco', url: '#' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const isValid = form.name && form.email && form.message;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);

    const { error } = await supabase.from('messages').insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    }]);

    if (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f8f5', color: '#0f1a2e' }}>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-form-box { padding: 28px 20px !important; }
          .contact-name-grid { grid-template-columns: 1fr !important; }
          .contact-hero { padding: 120px 5% 60px !important; }
          .contact-main { padding: 48px 5% 60px !important; }
          .map-card { position: relative !important; top: auto !important; left: auto !important; transform: none !important; margin: 16px; width: calc(100% - 32px); box-sizing: border-box; }
        }
      `}</style>

      {/* HERO */}
      <section className="contact-hero" style={{
        background: 'linear-gradient(135deg, #0f1a2e 0%, #162640 100%)',
        padding: '160px 5% 100px',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(62,207,176,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <p style={{ color: '#3ecfb0', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>Get In Touch</p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#f9f8f5', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 24 }}>
            We'd love to<br />
            <em style={{ color: '#3ecfb0' }}>hear from you.</em>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(249,248,245,0.6)', lineHeight: 1.7, fontWeight: 300 }}>
            Have a question, a special request, or just want to say hello? We're here.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="contact-main" style={{ padding: '80px 5% 100px' }}>
        <div className="contact-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'start' }}>

          {/* LEFT — CONTACT INFO */}
          <div>
            <FadeIn>
              <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 16, fontWeight: 500 }}>Contact Info</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: '#0f1a2e', marginBottom: 40, lineHeight: 1.2 }}>
                Several ways to reach us
              </h2>
            </FadeIn>

            {CONTACT_INFO.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div style={{ display: 'flex', gap: 20, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #eae9e4' }}>
                  <div style={{ width: 48, height: 48, minWidth: 48, background: 'rgba(62,207,176,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#0f1a2e', marginBottom: 4 }}>{item.value}</div>
                    <div style={{ fontSize: 13, color: '#999' }}>{item.sub}</div>
                  </div>
                </div>
              </FadeIn>
            ))}

            {/* SOCIALS */}
            <FadeIn delay={0.3}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#aaa', marginBottom: 16 }}>Follow Us</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {SOCIALS.map(s => (
                    <a key={s.label} href={s.url} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', background: 'white',
                      border: '1px solid #eae9e4', borderRadius: 2,
                      textDecoration: 'none', transition: 'border-color 0.2s',
                    }}
                      onMouseOver={e => e.currentTarget.style.borderColor = '#3ecfb0'}
                      onMouseOut={e => e.currentTarget.style.borderColor = '#eae9e4'}
                    >
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#0f1a2e' }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — CONTACT FORM */}
          <FadeIn delay={0.15}>
            <div className="contact-form-box" style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '48px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 64, height: 64, background: 'rgba(62,207,176,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>✓</div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#0f1a2e', marginBottom: 12 }}>Message sent!</h3>
                  <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>
                    Thanks for reaching out. We'll get back to you at <strong style={{ color: '#0f1a2e' }}>{form.email}</strong> within a few hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }} style={{
                    background: 'none', border: '1px solid #e0dfd9', color: '#666',
                    padding: '10px 24px', borderRadius: 2, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  }}>Send Another Message</button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 12, fontWeight: 500 }}>Send a Message</p>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#0f1a2e', marginBottom: 32 }}>
                    We'll get back to you shortly
                  </h2>

                  <div className="contact-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone (optional)</label>
                      <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Email Address *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@example.com" />
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      placeholder="Tell us what you need, ask a question, or just say hello..."
                    />
                  </div>

                  <button onClick={handleSubmit} disabled={!isValid || loading} style={{
                    width: '100%', background: isValid ? '#3ecfb0' : '#e0dfd9',
                    color: isValid ? '#0f1a2e' : '#aaa',
                    border: 'none', padding: '15px', fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    borderRadius: 2, cursor: isValid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}>
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MAP */}
      <section style={{ height: 400, background: '#e8e7e2', position: 'relative', overflow: 'hidden' }}>
        <iframe
          title="CleanCo Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878459418!3d40.71278937933114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae01!2sWall%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%" height="100%"
          style={{ border: 0, filter: 'grayscale(20%)' }}
          allowFullScreen=""
          loading="lazy"
        />
        <div className="map-card" style={{
          position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)',
          background: '#0f1a2e', color: '#f9f8f5', padding: '24px 32px', borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 8 }}>Our Location</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>CleanCo HQ</div>
          <div style={{ fontSize: 13, color: 'rgba(249,248,245,0.6)' }}>123 Clean Street, New York, NY</div>
        </div>
      </section>
    </div>
  );
}