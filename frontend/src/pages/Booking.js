import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const SERVICES = ['Residential Cleaning', 'Corporate Office', 'Deep Cleaning', 'Regular Maintenance', 'Move In / Move Out', 'Eco-Friendly Cleaning', 'Custom Quote'];
const FREQUENCIES = ['One-Time', 'Weekly', 'Bi-Weekly', 'Monthly'];
const PACKAGES = ['Basic', 'Standard', 'Premium', 'Not Sure Yet'];
const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

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

export default function Booking() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', service: '', frequency: '',
    package: '', date: '', time: '', notes: '', isCustom: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get('package');
    const freq = params.get('frequency');
    const type = params.get('type');
    setForm(f => ({
      ...f,
      package: pkg ? pkg.charAt(0).toUpperCase() + pkg.slice(1) : f.package,
      frequency: freq === 'weekly' ? 'Weekly' : freq === 'biweekly' ? 'Bi-Weekly' : f.frequency,
      service: type === 'custom' ? 'Custom Quote' : f.service,
      isCustom: type === 'custom',
    }));
  }, []);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const step1Valid = form.firstName && form.lastName && form.email && form.phone;
  const step2Valid = form.address && form.city && form.service && form.frequency;
  const step3Valid = form.package && form.date && form.time;

  const handleSubmit = async () => {
    const { error } = await supabase.from('bookings').insert([{
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      service: form.service,
      frequency: form.frequency,
      package: form.package,
      date: form.date,
      time: form.time,
      notes: form.notes,
      status: 'pending',
    }]);

    if (error) {
      alert('Something went wrong saving your booking. Please try again.');
      console.error(error);
      return;
    }

    const { error: fnError } = await supabase.functions.invoke('send-booking-email', {
      body: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        service: form.service,
        package: form.package,
        frequency: form.frequency,
        date: form.date,
        time: form.time,
        address: form.address,
        city: form.city,
        notes: form.notes,
      },
    });

    if (fnError) {
      console.error('Email notification failed:', fnError);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: '#f9f8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 5% 80px' }}>
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{ width: 80, height: 80, background: 'rgba(62,207,176,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            <span style={{ fontSize: 36 }}>✓</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 700, color: '#0f1a2e', marginBottom: 16, lineHeight: 1.2 }}>
            You're all booked!
          </h1>
          <p style={{ fontSize: 16, color: '#666', lineHeight: 1.7, fontWeight: 300, marginBottom: 12 }}>
            Thanks, <strong>{form.firstName}</strong>! We've received your booking request and will confirm your appointment within a few hours.
          </p>
          <p style={{ fontSize: 15, color: '#999', marginBottom: 40 }}>A confirmation will be sent to <strong style={{ color: '#0f1a2e' }}>{form.email}</strong></p>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', service: '', frequency: '', package: '', date: '', time: '', notes: '', isCustom: false }); }} style={{
            background: '#3ecfb0', color: '#0f1a2e', border: 'none',
            padding: '14px 32px', fontSize: 15, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500, borderRadius: 2, cursor: 'pointer',
          }}>Book Another Clean</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f9f8f5', color: '#0f1a2e' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0f1a2e 0%, #162640 100%)', padding: '160px 5% 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(62,207,176,0.1)', pointerEvents: 'none' }} />
        <p style={{ color: '#3ecfb0', fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20, fontWeight: 500 }}>Book a Clean</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: '#f9f8f5', lineHeight: 1.1, marginBottom: 20 }}>
          Let's get your space<br />
          <em style={{ color: '#3ecfb0' }}>sparkling clean.</em>
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(249,248,245,0.6)', fontWeight: 300 }}>Takes less than 2 minutes. No commitment required.</p>
      </section>

      {/* STEPS INDICATOR */}
      <section style={{ background: 'white', borderBottom: '1px solid #eae9e4', padding: '24px 5%', position: 'sticky', top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          {[['1', 'Your Details'], ['2', 'Service Info'], ['3', 'Schedule']].map(([num, label], i) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? '#3ecfb0' : step === i + 1 ? '#0f1a2e' : '#f0efe9',
                  color: step >= i + 1 ? (step > i + 1 ? '#0f1a2e' : '#f9f8f5') : '#aaa',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.3s',
                }}>
                  {step > i + 1 ? '✓' : num}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 500 : 400, color: step === i + 1 ? '#0f1a2e' : '#999' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? '#3ecfb0' : '#eae9e4', margin: '0 16px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section style={{ padding: '60px 5% 100px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* STEP 1 */}
          {step === 1 && (
            <FadeIn>
              <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '48px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0f1a2e' }}>Your Details</h2>
                <p style={{ fontSize: 14, color: '#999', marginBottom: 36, fontWeight: 300 }}>Tell us a bit about yourself so we can get in touch.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input style={inputStyle} value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Jane" />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input style={inputStyle} value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Smith" />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input style={inputStyle} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@example.com" />
                </div>
                <div style={{ marginBottom: 36 }}>
                  <label style={labelStyle}>Phone Number *</label>
                  <input style={inputStyle} type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <button onClick={() => step1Valid && setStep(2)} style={{
                  background: step1Valid ? '#3ecfb0' : '#e0dfd9',
                  color: step1Valid ? '#0f1a2e' : '#aaa',
                  border: 'none', padding: '14px 36px', fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  borderRadius: 2, cursor: step1Valid ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}>Continue →</button>
              </div>
            </FadeIn>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <FadeIn>
              <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '48px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0f1a2e' }}>Service Info</h2>
                <p style={{ fontSize: 14, color: '#999', marginBottom: 36, fontWeight: 300 }}>Tell us about your space and what you need.</p>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Street Address *</label>
                  <input style={inputStyle} value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main Street" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>City *</label>
                  <input style={inputStyle} value={form.city} onChange={e => update('city', e.target.value)} placeholder="New York" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Service Type *</label>
                  <select style={inputStyle} value={form.service} onChange={e => update('service', e.target.value)}>
                    <option value="">Select a service...</option>
                    {SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 36 }}>
                  <label style={labelStyle}>How Often? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {FREQUENCIES.map(f => (
                      <button key={f} onClick={() => update('frequency', f)} style={{
                        padding: '12px', border: form.frequency === f ? '2px solid #3ecfb0' : '1px solid #e0dfd9',
                        borderRadius: 2, background: form.frequency === f ? 'rgba(62,207,176,0.08)' : 'white',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                        color: form.frequency === f ? '#0f1a2e' : '#666',
                        cursor: 'pointer', fontWeight: form.frequency === f ? 500 : 400,
                        transition: 'all 0.2s',
                      }}>{f}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)} style={{ background: 'transparent', color: '#666', border: '1px solid #e0dfd9', padding: '14px 28px', fontSize: 15, fontFamily: "'DM Sans', sans-serif", borderRadius: 2, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => step2Valid && setStep(3)} style={{
                    background: step2Valid ? '#3ecfb0' : '#e0dfd9',
                    color: step2Valid ? '#0f1a2e' : '#aaa',
                    border: 'none', padding: '14px 36px', fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    borderRadius: 2, cursor: step2Valid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}>Continue →</button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <FadeIn>
              <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '48px' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0f1a2e' }}>Schedule Your Clean</h2>
                <p style={{ fontSize: 14, color: '#999', marginBottom: 36, fontWeight: 300 }}>Pick a date, time, and package that works for you.</p>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Package *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {PACKAGES.map(p => (
                      <button key={p} onClick={() => update('package', p)} style={{
                        padding: '12px', border: form.package === p ? '2px solid #3ecfb0' : '1px solid #e0dfd9',
                        borderRadius: 2, background: form.package === p ? 'rgba(62,207,176,0.08)' : 'white',
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                        color: form.package === p ? '#0f1a2e' : '#666',
                        cursor: 'pointer', fontWeight: form.package === p ? 500 : 400,
                        transition: 'all 0.2s',
                      }}>{p}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Preferred Date *</label>
                    <input style={inputStyle} type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => update('date', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Preferred Time *</label>
                    <select style={inputStyle} value={form.time} onChange={e => update('time', e.target.value)}>
                      <option value="">Select time...</option>
                      {TIMES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 36 }}>
                  <label style={labelStyle}>Additional Notes</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special instructions, access codes, pet info, areas to focus on..." />
                </div>

                {/* SUMMARY */}
                <div style={{ background: '#f9f8f5', border: '1px solid #eae9e4', borderRadius: 2, padding: '20px 24px', marginBottom: 28 }}>
                  <p style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>Booking Summary</p>
                  {[
                    ['Name', `${form.firstName} ${form.lastName}`],
                    ['Email', form.email],
                    ['Address', `${form.address}, ${form.city}`],
                    ['Service', form.service],
                    ['Frequency', form.frequency],
                    ['Package', form.package],
                    ['Date & Time', form.date && form.time ? `${form.date} at ${form.time}` : '—'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: '#999' }}>{label}</span>
                      <span style={{ color: '#0f1a2e', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(2)} style={{ background: 'transparent', color: '#666', border: '1px solid #e0dfd9', padding: '14px 28px', fontSize: 15, fontFamily: "'DM Sans', sans-serif", borderRadius: 2, cursor: 'pointer' }}>← Back</button>
                  <button onClick={() => step3Valid && handleSubmit()} style={{
                    background: step3Valid ? '#3ecfb0' : '#e0dfd9',
                    color: step3Valid ? '#0f1a2e' : '#aaa',
                    border: 'none', padding: '14px 36px', fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    borderRadius: 2, cursor: step3Valid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s', flex: 1,
                  }}>Confirm Booking ✓</button>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}