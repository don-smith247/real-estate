import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, Shield, Star, Clock } from 'lucide-react';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&h=1080&q=80',
    city: 'Washington, DC',
  },
  {
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&h=1080&q=80',
    city: 'New York, NY',
  },
  {
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&h=1080&q=80',
    city: 'Atlanta, GA',
  },
];

const STATS = [
  { value: '500+', label: 'Active Listings' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15 yrs', label: 'Experience' },
  { value: '30+', label: 'States Covered' },
];

const BADGES = [
  { icon: Shield, text: 'Verified Properties' },
  { icon: Star,   text: 'Top Rated Agency' },
  { icon: Clock,  text: '24hr Response Time' },
];

export default function Hero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (type)   p.set('type', type);
    navigate(`/apartments?${p.toString()}`);
  };

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#050E08' }}>

      {/* Slide images */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${s.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === slideIdx ? 0.5 : 0,
          transition: 'opacity 1.8s ease',
        }} />
      ))}

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,14,8,0.7) 0%, rgba(5,14,8,0.35) 40%, rgba(5,14,8,0.75) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,14,8,0.6) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Emerald top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #059669, #34D399, #059669)' }} />

      {/* Slide city label (bottom-right) */}
      <motion.div
        key={slideIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute', bottom: 32, right: 32, zIndex: 3,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 40, padding: '6px 14px',
        }}
        className="hero-city-badge"
      >
        <MapPin size={12} style={{ color: '#34D399' }} />
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{SLIDES[slideIdx].city}</span>
      </motion.div>

      {/* Slide dots */}
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 3 }} className="hero-dots">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlideIdx(i)} style={{
            width: i === slideIdx ? 24 : 6, height: 6,
            borderRadius: 3, border: 'none', cursor: 'pointer',
            background: i === slideIdx ? '#059669' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease', padding: 0,
          }} />
        ))}
      </div>

      {/* Main content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 'calc(var(--header-h) + 40px)', paddingBottom: 100 }}>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}
          className="hero-badges"
        >
          {BADGES.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.text} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.25)',
                borderRadius: 40, padding: '5px 12px',
              }}>
                <Icon size={12} style={{ color: '#34D399' }} />
                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, whiteSpace: 'nowrap' }}>{b.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: '#fff', maxWidth: 720, marginBottom: 16, lineHeight: 1.1 }}
          className="hero-heading"
        >
          Find Premium Rentals
          <br />
          <span style={{ color: '#34D399' }}>Across America</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}
          className="hero-sub"
        >
          Rotex One Realty connects you with verified, premium apartments in Washington DC and major cities nationwide. Trusted by thousands of renters.
        </motion.p>

        {/* Search card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: 8,
            maxWidth: 660, boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          }}
          className="hero-search-card"
        >
          <form onSubmit={handleSearch}>
            <div className="hero-form-row" style={{ display: 'flex', gap: 6 }}>

              {/* Location input */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '0 16px', minWidth: 0 }}>
                <Search size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="City, state or neighborhood..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    color: '#fff', fontSize: '0.9375rem', fontFamily: 'inherit',
                    padding: '14px 0',
                  }}
                />
              </div>

              {/* Type select */}
              <div className="hero-select-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{
                    height: '100%', padding: '0 36px 0 14px',
                    background: 'rgba(255,255,255,0.06)', border: 'none',
                    color: type ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontSize: '0.875rem', cursor: 'pointer', appearance: 'none',
                    outline: 'none', fontFamily: 'inherit', borderRadius: 12, minWidth: 130,
                  }}
                >
                  <option value="">Any Type</option>
                  <option value="studio">Studio</option>
                  <option value="1br">1 Bedroom</option>
                  <option value="2br">2 Bedrooms</option>
                  <option value="3br">3 Bedrooms</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="loft">Loft</option>
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  padding: '0 28px', background: '#059669', border: 'none',
                  borderRadius: 12, color: '#fff', fontWeight: 700,
                  fontSize: '0.9375rem', cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
                className="hero-search-btn"
              >
                <Search size={16} />
                <span className="hero-btn-text">Search</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}
          className="hero-quick"
        >
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.35)' }}>Popular:</span>
          {['Washington DC', 'New York', 'Atlanta', 'Houston', 'Chicago'].map(city => (
            <button
              key={city}
              onClick={() => navigate(`/apartments?search=${encodeURIComponent(city)}`)}
              style={{
                padding: '4px 12px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 40, color: 'rgba(255,255,255,0.55)',
                fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#34D399'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              {city}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ position: 'relative', zIndex: 2, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="container">
          <div className="hero-stats" style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0', flexWrap: 'wrap', gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#34D399', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.4) !important; }
        option { background: #0B1A12; color: #fff; }

        @media (max-width: 640px) {
          .hero-heading { font-size: 2.25rem !important; }
          .hero-sub { font-size: 0.9375rem !important; margin-bottom: 24px !important; }
          .hero-form-row { flex-direction: column !important; gap: 8px !important; }
          .hero-select-wrap { display: none !important; }
          .hero-search-btn { padding: 14px !important; justify-content: center; border-radius: 12px !important; }
          .hero-quick { display: none !important; }
          .hero-city-badge { display: none !important; }
          .hero-badges { gap: 6px !important; }
          .hero-stats > div { padding: 0 4px !important; }
          .hero-stats > div > div:first-child { font-size: 1.25rem !important; }
        }
        @media (max-width: 400px) {
          .hero-heading { font-size: 1.875rem !important; }
          .hero-badges > div > span { display: none; }
        }
      `}</style>
    </section>
  );
}
