import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown, MapPin } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&h=1080&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&h=1080&q=80',
];

const QUICK_SEARCHES = [
  { label: 'Washington DC', icon: MapPin },
  { label: 'New York', icon: MapPin },
  { label: 'Atlanta', icon: MapPin },
  { label: 'Houston', icon: MapPin },
];

const STATS = [
  { value: '500+', label: 'Premium Listings' },
  { value: '15yrs', label: 'Trusted Expertise' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '30+', label: 'States Covered' },
];

export default function Hero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setImgIndex(i => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    navigate(`/apartments?${params.toString()}`);
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#0B1A12',
    }}>
      {/* Background Images */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === imgIndex ? 0.42 : 0,
            transition: 'opacity 1.5s ease',
            transform: 'scale(1.05)',
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(11,26,18,0.88) 0%, rgba(11,26,18,0.55) 50%, rgba(11,26,18,0.80) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, #0B1A12 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Emerald accent line at top */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
        background: 'linear-gradient(to right, transparent, #059669, transparent)',
        opacity: 0.7,
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: 'var(--header-h)' }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-logo"
          style={{ marginBottom: 'var(--s-6)', display: 'flex', justifyContent: 'center' }}
        >
          <img
            src="/logo.PNG"
            alt="Rotex One Realty"
            style={{ height: 64, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </motion.div>

        {/* Pre-heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-3)', marginBottom: 'var(--s-5)' }}
        >
          <div style={{ width: '2rem', height: '1px', background: '#059669' }} />
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#059669' }}>
            United States | Nationwide Rental Properties
          </span>
          <div style={{ width: '2rem', height: '1px', background: '#059669' }} />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl"
          style={{
            color: 'var(--white)',
            maxWidth: 900,
            margin: '0 auto var(--s-5)',
          }}
        >
          Live Where Excellence
          <br />
          <span style={{ color: '#059669', display: 'inline-block' }}>Is The Standard</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="hero-subtitle"
          style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: 580,
            margin: '0 auto var(--s-10)',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Rotex One Realty connects clients with premium rental residences across the United States. Headquartered in Washington DC with offices in major cities nationwide.
        </motion.p>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ maxWidth: 700, margin: '0 auto var(--s-6)' }}
        >
          <form onSubmit={handleSearch}>
            <div className="hero-search-bar" style={{
              display: 'flex',
              gap: 0,
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--r-2xl)',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}>
              {/* Search Input */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: 'var(--s-5)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="City, neighborhood, or state..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    flex: 1, padding: 'var(--s-5) var(--s-5) var(--s-5) calc(var(--s-5) + 28px)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--white)',
                    fontSize: '0.9375rem',
                    outline: 'none',
                  }}
                />
                <style>{`
                  input::placeholder { color: rgba(255,255,255,0.4); }
                  @media (max-width: 640px) {
                    .hero-search-bar { flex-direction: column !important; border-radius: 16px !important; }
                    .hero-search-bar > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08); }
                    .hero-search-btn { border-radius: 0 0 14px 14px !important; padding: 14px !important; justify-content: center; }
                    .hero-quick { display: none !important; }
                    .hero-stats { gap: 24px !important; }
                    .hero-stats > div > div:first-child { font-size: 1.5rem !important; }
                  }
                  @media (max-width: 480px) {
                    .hero-logo img { height: 48px !important; }
                    .hero-preheading { font-size: 0.625rem !important; }
                    .display-xl { font-size: 2rem !important; }
                    .hero-subtitle { font-size: 0.9375rem !important; }
                  }
                `}</style>
              </div>

              {/* Type Selector — hidden on mobile to keep it simple */}
              <div className="hero-type-select" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{
                    height: '100%', padding: 'var(--s-5) var(--s-10) var(--s-5) var(--s-5)',
                    background: 'transparent',
                    border: 'none',
                    color: type ? 'var(--white)' : 'rgba(255,255,255,0.4)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    minWidth: 140,
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
                <ChevronDown size={14} style={{ position: 'absolute', right: 'var(--s-4)', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }} />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="hero-search-btn"
                style={{
                  padding: 'var(--s-5) var(--s-8)',
                  background: '#059669',
                  border: 'none',
                  color: 'var(--white)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background var(--t-fast)',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
              >
                <Search size={15} /> Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="hero-quick"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s-2)', flexWrap: 'wrap' }}
        >
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.4)', marginRight: 'var(--s-1)' }}>Popular:</span>
          {QUICK_SEARCHES.map(q => (
            <button
              key={q.label}
              onClick={() => navigate(`/apartments?search=${encodeURIComponent(q.label)}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.375rem 0.875rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--r-full)',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.15)'; e.currentTarget.style.borderColor = 'rgba(5,150,105,0.4)'; e.currentTarget.style.color = '#34D399'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            >
              <MapPin size={11} /> {q.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: 'var(--s-12)', left: 0, right: 0,
          zIndex: 2,
        }}
      >
        <div className="container">
          <div className="hero-stats" style={{
            display: 'flex', justifyContent: 'center', gap: 'var(--s-12)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: 'var(--s-6)',
            flexWrap: 'wrap',
          }}>
            {STATS.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: '#059669', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 'var(--s-1)', fontWeight: 500, letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute', bottom: 'var(--s-6)', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-1)',
        }}
      >
        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
