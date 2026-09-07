import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { propertiesApi } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

const FALLBACK = [
  { _id: 'Dupont Circle', count: 12, minRent: 2100, image: '' },
  { _id: 'Georgetown', count: 8, minRent: 3200, image: '' },
  { _id: 'Capitol Hill', count: 10, minRent: 2600, image: '' },
  { _id: 'Adams Morgan', count: 7, minRent: 2400, image: '' },
  { _id: 'Shaw', count: 9, minRent: 2200, image: '' },
  { _id: 'Logan Circle', count: 6, minRent: 2000, image: '' },
];

const BG_COLORS = ['#152238', '#0F1E32', '#1A2C44', '#0D1929', '#1C3048', '#0B1929'];

export default function NeighborhoodSection() {
  const navigate = useNavigate();
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(() => {
    propertiesApi.getNeighborhoods()
      .then(res => setNeighborhoods(res.data.data?.length ? res.data.data : FALLBACK))
      .catch(() => setNeighborhoods(FALLBACK));
  }, []);

  const displayed = neighborhoods.slice(0, 6);

  return (
    <section className="section" style={{ background: 'var(--midnight)' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--s-12)' }}>
          <div className="section-label"><span style={{ color: 'var(--gold)' }}>Neighborhoods</span></div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
            <h2 style={{ color: 'var(--white)' }}>
              Discover DC's
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}> Finest</span> Areas
            </h2>
            <button
              onClick={() => navigate('/apartments')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                padding: '0.625rem 1.5rem',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--r-full)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                background: 'none',
                cursor: 'pointer',
                transition: 'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              All Neighborhoods <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-4)' }}
          className="neighborhood-grid">
          {displayed.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div
                onClick={() => navigate(`/apartments?search=${encodeURIComponent(n._id)}`)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--r-2xl)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  aspectRatio: i === 0 || i === 1 ? '4/3' : '4/3',
                  background: n.image ? `url(${n.image}) center/cover` : BG_COLORS[i % BG_COLORS.length],
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'transform var(--t-slow), box-shadow var(--t-slow)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                {/* Geometric Pattern Background */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(201,168,76,0.03) 0px, rgba(201,168,76,0.03) 1px, transparent 1px, transparent 40px)`,
                }} />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(11,17,32,0.9) 0%, rgba(11,17,32,0.2) 60%, transparent 100%)',
                }} />

                {/* Content */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: 'var(--s-5)',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-1)', marginBottom: 'var(--s-1)' }}>
                      <MapPin size={12} style={{ color: 'var(--gold)' }} />
                      <span style={{ fontSize: '0.6875rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Washington, DC
                      </span>
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.375rem',
                      fontWeight: 600,
                      color: 'var(--white)',
                      lineHeight: 1.2,
                      marginBottom: 'var(--s-1)',
                    }}>
                      {n._id}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
                      From {formatCurrency(n.minRent)}/mo
                    </p>
                  </div>
                  <div style={{
                    padding: '0.375rem 0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--r-full)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--white)' }}>
                      {n.count} {n.count === 1 ? 'unit' : 'units'}
                    </span>
                  </div>
                </div>

                {/* Arrow on hover */}
                <div style={{
                  position: 'absolute', top: 'var(--s-4)', right: 'var(--s-4)',
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 'var(--r-full)',
                  color: 'var(--gold)',
                  opacity: 0,
                  transition: 'opacity var(--t-fast)',
                }}
                  className="neighborhood-arrow"
                >
                  <ArrowRight size={15} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .neighborhood-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .neighborhood-grid { grid-template-columns: 1fr !important; }
        }
        div:hover .neighborhood-arrow { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
