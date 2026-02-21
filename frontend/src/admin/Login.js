import { useState } from 'react';
import { supabase } from '../supabaseClient';

const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '1px solid #e0dfd9', borderRadius: 2,
  fontFamily: "'DM Sans', sans-serif", fontSize: 15,
  color: '#0f1a2e', background: 'white',
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: '#444', marginBottom: 8,
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }

    onLogin();
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh', background: '#0f1a2e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.6s ease both' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#f9f8f5' }}>
            <span style={{ color: '#3ecfb0' }}>✦</span> CleanCo
          </div>
          <p style={{ fontSize: 13, color: 'rgba(249,248,245,0.4)', marginTop: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Access</p>
        </div>

        {/* CARD */}
        <div style={{ background: 'white', borderRadius: 4, padding: '40px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: '#0f1a2e', marginBottom: 8 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: '#999', marginBottom: 32, fontWeight: 300 }}>Sign in to access the dashboard.</p>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin@cleanco.com"
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 2, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#c0392b', margin: 0 }}>{error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading || !email || !password} style={{
            width: '100%', background: email && password ? '#3ecfb0' : '#e0dfd9',
            color: email && password ? '#0f1a2e' : '#aaa',
            border: 'none', padding: '14px', fontSize: 15,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            borderRadius: 2, cursor: email && password ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(249,248,245,0.25)', marginTop: 24 }}>
          This area is restricted to authorized personnel only.
        </p>
      </div>
    </div>
  );
}