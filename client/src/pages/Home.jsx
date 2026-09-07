import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import AmenitiesSection from '../components/home/AmenitiesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';
import PropertyCard from '../components/property/PropertyCard';
import { propertiesApi } from '../utils/api';

const TYPES = [
  { value: '', label: 'All homes' },
  { value: 'studio', label: 'Studios' },
  { value: '1br', label: '1 Bedroom' },
  { value: '2br', label: '2 Bedrooms' },
  { value: '3br', label: '3 Bedrooms' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'loft', label: 'Loft' },
];

const HOW_IT_WORKS = [
  { num: '1', title: 'Browse Residences', desc: 'Explore our curated portfolio of premium apartments across DC\'s most desirable neighborhoods. Filter by type, price, and lifestyle preferences.' },
  { num: '2', title: 'Schedule a Viewing', desc: 'Book an in-person or virtual tour with one of our expert advisors. We respond within a few hours and accommodate your schedule.' },
  { num: '3', title: 'Apply & Move In', desc: 'Complete our streamlined application and let Rotex One Realty handle the details. We review within 24–48 hours and guide you every step to move-in day.' },
];

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties(activeType);
  }, [activeType]);

  const fetchProperties = async (type) => {
    setLoading(true);
    try {
      const params = { limit: 12 };
      if (type) params.type = type;
      const res = await propertiesApi.getAll(params);
      setProperties(res.data.data || []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/apartments?search=${encodeURIComponent(search.trim())}` : '/apartments');
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Full-screen Hero */}
      <Hero />

      {/* Stats Section */}
      <StatsSection />

      {/* Property Search Section */}
      <section style={{
        paddingTop: '56px',
        paddingBottom: '32px',
        borderBottom: '1px solid #E8EEE9',
        background: '#FFFFFF',
      }}>
        <div className="container">
          <h2 style={{ marginBottom: '8px', color: '#0B1A12', letterSpacing: '-0.025em' }}>
            Find Your Next Residence in DC
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#6B8872', marginBottom: '28px', maxWidth: 520 }}>
            Premium apartments across Washington's most coveted neighborhoods — vetted by our team, verified for quality.
          </p>

          <form onSubmit={handleSearch} style={{ maxWidth: 640 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid #D0DBD3', borderRadius: '40px',
              boxShadow: '0 3px 16px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              background: '#fff',
            }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '10px' }}>
                <Search size={16} style={{ color: '#6B8872', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Neighborhood, address, or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '0.9375rem', fontFamily: 'inherit', color: '#0B1A12',
                    width: '100%', padding: '16px 0',
                  }}
                />
              </div>
              <button type="submit" style={{
                margin: '8px', padding: '14px 24px',
                background: '#059669', border: 'none', borderRadius: '32px',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.9375rem', fontWeight: 600, whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
              >
                <Search size={15} />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Type Filter Tabs */}
      <section style={{ borderBottom: '1px solid #E8EEE9', background: '#fff', position: 'sticky', top: 'var(--header-h)', zIndex: 10 }}>
        <div className="container" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '16px 0', whiteSpace: 'nowrap' }}>
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setActiveType(t.value)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '40px',
                  border: '1px solid',
                  borderColor: activeType === t.value ? '#059669' : '#D0DBD3',
                  background: activeType === t.value ? '#059669' : '#fff',
                  color: activeType === t.value ? '#fff' : '#0B1A12',
                  fontSize: '0.875rem', fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section style={{ padding: '40px 0 80px', background: '#fff' }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: '12px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '15px', width: '65%', marginBottom: '8px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ height: '13px', width: '45%', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0B1A12', marginBottom: '8px' }}>No listings found</p>
              <p style={{ color: '#6B8872' }}>Try a different filter or check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {properties.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <PropertyCard property={p} index={i} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && properties.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <button
                onClick={() => navigate('/apartments')}
                style={{
                  padding: '14px 32px',
                  border: '1.5px solid #059669', borderRadius: '8px',
                  background: 'transparent', color: '#059669',
                  fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#059669'; }}
              >
                View All Residences
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <AmenitiesSection />

      {/* How Rotex One Works */}
      <section style={{ background: '#F4F7F5', padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: '48px', letterSpacing: '-0.02em', color: '#0B1A12' }}>
            How Rotex One Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#059669', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.0625rem', marginBottom: '20px',
                }}>
                  {item.num}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: '#0B1A12', letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#6B8872', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CtaSection />

      <Footer />
    </div>
  );
}
