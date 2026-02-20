import { useState, useEffect } from 'react';

const TABS = ['Overview', 'Bookings', 'Customers'];

const STATUS_COLORS = {
  pending: { bg: 'rgba(255,193,7,0.12)', color: '#b8860b', label: 'Pending' },
  confirmed: { bg: 'rgba(62,207,176,0.12)', color: '#2a9d8f', label: 'Confirmed' },
  completed: { bg: 'rgba(62,207,176,0.2)', color: '#1a7a6e', label: 'Completed' },
  cancelled: { bg: 'rgba(220,53,69,0.1)', color: '#c0392b', label: 'Cancelled' },
};

function StatCard({ icon, label, value, sub, delay = 0 }) {
  return (
    <div style={{
      background: 'white', border: '1px solid #eae9e4', borderRadius: 4,
      padding: '28px 32px', display: 'flex', alignItems: 'flex-start', gap: 16,
    }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: '#999', marginBottom: 4, letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: '#0f1a2e', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#3ecfb0', marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '4px 12px', borderRadius: 2,
      fontSize: 12, fontWeight: 500, letterSpacing: '0.5px',
      textTransform: 'capitalize',
    }}>{s.label}</span>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('Overview');
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cleanco_bookings') || '[]');
    // Add demo bookings if empty
    if (stored.length === 0) {
      const demo = [
        { id: 1, firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah@example.com', phone: '+1 555 010 1234', address: '45 Maple Ave', city: 'New York', service: 'Residential Cleaning', frequency: 'Bi-Weekly', package: 'Standard', date: '2025-03-10', time: '9:00 AM', notes: 'Have a dog, please knock.', status: 'confirmed', createdAt: '2025-02-18T10:00:00Z' },
        { id: 2, firstName: 'James', lastName: 'Thornton', email: 'james@acmecorp.com', phone: '+1 555 020 5678', address: '200 Corporate Blvd', city: 'Brooklyn', service: 'Corporate Office', frequency: 'Weekly', package: 'Premium', date: '2025-03-08', time: '8:00 AM', notes: 'Access via reception. Ask for James.', status: 'confirmed', createdAt: '2025-02-17T14:00:00Z' },
        { id: 3, firstName: 'Lena', lastName: 'Kovacs', email: 'lena@example.com', phone: '+1 555 030 9012', address: '12 Birch Street', city: 'Manhattan', service: 'Deep Cleaning', frequency: 'One-Time', package: 'Premium', date: '2025-03-05', time: '10:00 AM', notes: '', status: 'completed', createdAt: '2025-02-16T09:00:00Z' },
        { id: 4, firstName: 'Marcus', lastName: 'Reid', email: 'marcus@example.com', phone: '+1 555 040 3456', address: '78 Oak Lane', city: 'Queens', service: 'Move In / Move Out', frequency: 'One-Time', package: 'Standard', date: '2025-03-12', time: '11:00 AM', notes: 'Moving out — need full clean for landlord inspection.', status: 'pending', createdAt: '2025-02-19T08:30:00Z' },
        { id: 5, firstName: 'Priya', lastName: 'Sharma', email: 'priya@example.com', phone: '+1 555 050 7890', address: '34 Elm Road', city: 'Bronx', service: 'Eco-Friendly Cleaning', frequency: 'Monthly', package: 'Basic', date: '2025-03-15', time: '2:00 PM', notes: 'Allergic to strong scents — eco products only please.', status: 'pending', createdAt: '2025-02-19T11:00:00Z' },
      ];
      localStorage.setItem('cleanco_bookings', JSON.stringify(demo));
      setBookings(demo);
    } else {
      setBookings(stored);
    }
  }, []);

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem('cleanco_bookings', JSON.stringify(updated));
  };

  const updateStatus = (id, status) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    saveBookings(updated);
    if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status });
  };

  const deleteBooking = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    saveBookings(updated);
    setSelectedBooking(null);
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${b.firstName} ${b.lastName} ${b.email} ${b.service} ${b.city}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const customers = Object.values(
    bookings.reduce((acc, b) => {
      const key = b.email;
      if (!acc[key]) acc[key] = { name: `${b.firstName} ${b.lastName}`, email: b.email, phone: b.phone, city: b.city, bookings: [], totalSpend: 0 };
      acc[key].bookings.push(b);
      return acc;
    }, {})
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f4f3f0', minHeight: '100vh', paddingTop: 72 }}>
      <style>{`
        .dash-row:hover { background: #fafaf8 !important; }
        .status-btn { border: none; padding: '6px 14px'; border-radius: 2; font-size: 12; font-family: "'DM Sans', sans-serif"; cursor: pointer; transition: opacity 0.2s; }
        .status-btn:hover { opacity: 0.8; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: '#0f1a2e', padding: '28px 5%', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: '#3ecfb0', marginBottom: 4 }}>Admin Dashboard</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#f9f8f5' }}>CleanCo Control Panel</h1>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(249,248,245,0.4)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: 'white', borderBottom: '1px solid #eae9e4', padding: '0 5%' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '16px 24px', fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              color: tab === t ? '#0f1a2e' : '#999',
              borderBottom: tab === t ? '2px solid #3ecfb0' : '2px solid transparent',
              fontWeight: tab === t ? 500 : 400,
              transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 5%' }}>

        {/* OVERVIEW */}
        {tab === 'Overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
              <StatCard icon="📋" label="Total Bookings" value={stats.total} sub="All time" />
              <StatCard icon="⏳" label="Pending" value={stats.pending} sub="Awaiting confirmation" />
              <StatCard icon="✅" label="Confirmed" value={stats.confirmed} sub="Upcoming cleans" />
              <StatCard icon="⭐" label="Completed" value={stats.completed} sub="Successfully done" />
            </div>

            <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '32px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#0f1a2e', marginBottom: 24 }}>Recent Bookings</h2>
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} onClick={() => { setSelectedBooking(b); setTab('Bookings'); }}
                  className="dash-row"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0efe9', cursor: 'pointer', transition: 'background 0.2s', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {b.firstName[0]}{b.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: '#0f1a2e' }}>{b.firstName} {b.lastName}</div>
                      <div style={{ fontSize: 13, color: '#999' }}>{b.service}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge status={b.status} />
                    <div style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>{b.date} · {b.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'Bookings' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedBooking ? '1fr 380px' : '1fr', gap: 24 }}>
            <div>
              {/* FILTERS */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, service..."
                  style={{ flex: 1, minWidth: 200, padding: '11px 16px', border: '1px solid #e0dfd9', borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding: '11px 16px', border: '1px solid #e0dfd9', borderRadius: 2, fontFamily: "'DM Sans', sans-serif", fontSize: 14, background: 'white', outline: 'none' }}>
                  <option value="all">All Statuses</option>
                  {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
                </select>
              </div>

              {/* TABLE */}
              <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px', padding: '12px 20px', background: '#f9f8f5', borderBottom: '1px solid #eae9e4' }}>
                  {['Client', 'Service', 'Date', 'Status', ''].map(h => (
                    <div key={h} style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#aaa', fontWeight: 500 }}>{h}</div>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 15 }}>No bookings found.</div>
                )}
                {filtered.map(b => (
                  <div key={b.id} onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                    className="dash-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px',
                      padding: '16px 20px', borderBottom: '1px solid #f0efe9',
                      cursor: 'pointer', transition: 'background 0.15s',
                      background: selectedBooking?.id === b.id ? '#f0faf8' : 'white',
                    }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: '#0f1a2e' }}>{b.firstName} {b.lastName}</div>
                      <div style={{ fontSize: 12, color: '#bbb' }}>{b.email}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#555', alignSelf: 'center' }}>{b.service}</div>
                    <div style={{ fontSize: 13, color: '#555', alignSelf: 'center' }}>{b.date}</div>
                    <div style={{ alignSelf: 'center' }}><Badge status={b.status} /></div>
                    <div style={{ alignSelf: 'center' }}>
                      <select
                        value={b.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(b.id, e.target.value)}
                        style={{ fontSize: 12, border: '1px solid #e0dfd9', borderRadius: 2, padding: '4px 8px', fontFamily: "'DM Sans', sans-serif", background: 'white', cursor: 'pointer', outline: 'none' }}>
                        {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{STATUS_COLORS[s].label}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAIL PANEL */}
            {selectedBooking && (
              <div style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '32px', height: 'fit-content', position: 'sticky', top: 160 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#0f1a2e', marginBottom: 12 }}>
                      {selectedBooking.firstName[0]}{selectedBooking.lastName[0]}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#0f1a2e', marginBottom: 4 }}>
                      {selectedBooking.firstName} {selectedBooking.lastName}
                    </h3>
                    <Badge status={selectedBooking.status} />
                  </div>
                  <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#bbb' }}>✕</button>
                </div>

                {[
                  ['📧 Email', selectedBooking.email],
                  ['📞 Phone', selectedBooking.phone],
                  ['📍 Address', `${selectedBooking.address}, ${selectedBooking.city}`],
                  ['🧹 Service', selectedBooking.service],
                  ['📦 Package', selectedBooking.package],
                  ['🔄 Frequency', selectedBooking.frequency],
                  ['📅 Date', selectedBooking.date],
                  ['⏰ Time', selectedBooking.time],
                ].map(([label, value]) => (
                  <div key={label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f5f4f0' }}>
                    <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: '#333' }}>{value || '—'}</div>
                  </div>
                ))}

                {selectedBooking.notes && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#bbb', marginBottom: 6 }}>📝 Notes</div>
                    <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6, background: '#f9f8f5', padding: '12px', borderRadius: 2 }}>{selectedBooking.notes}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {['confirmed', 'completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(selectedBooking.id, s)} style={{
                      flex: 1, padding: '9px 0', fontSize: 12,
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                      border: '1px solid #e0dfd9', borderRadius: 2, cursor: 'pointer',
                      background: selectedBooking.status === s ? STATUS_COLORS[s].bg : 'white',
                      color: STATUS_COLORS[s].color, transition: 'all 0.2s',
                      textTransform: 'capitalize',
                    }}>{s}</button>
                  ))}
                </div>

                <button onClick={() => deleteBooking(selectedBooking.id)} style={{
                  width: '100%', marginTop: 12, padding: '10px', fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", background: 'none',
                  border: '1px solid rgba(192,57,43,0.3)', color: '#c0392b',
                  borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s',
                }}>Delete Booking</button>
              </div>
            )}
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === 'Customers' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {customers.map(c => (
                <div key={c.email} style={{ background: 'white', border: '1px solid #eae9e4', borderRadius: 4, padding: '28px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0f1a2e, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#f9f8f5' }}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#0f1a2e' }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: '#999' }}>{c.city}</div>
                    </div>
                  </div>
                  {[
                    ['Email', c.email],
                    ['Phone', c.phone],
                    ['Total Bookings', c.bookings.length],
                    ['Services Used', [...new Set(c.bookings.map(b => b.service))].join(', ')],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f5f4f0' }}>
                      <span style={{ color: '#aaa' }}>{label}</span>
                      <span style={{ color: '#333', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 8 }}>
                    {c.bookings.map(b => <Badge key={b.id} status={b.status} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}