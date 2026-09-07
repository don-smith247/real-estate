import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Calendar } from 'lucide-react';

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'var(--midnight)', padding: 'var(--s-24) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,41,24,0.8) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(5,150,105,0.4), transparent)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>
              <span>Begin Today</span>
            </div>

            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--s-5)', maxWidth: 660, margin: '0 auto var(--s-5)' }}>
              Your Exceptional Residence
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Awaits You Here</span>
            </h2>

            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto var(--s-10)' }}>
              Step into a new standard of living. Rotex One Realty curates Washington DC's finest rental residences — every property vetted, every detail verified, and every client served with distinction.
            </p>

            <div style={{ display: 'flex', gap: 'var(--s-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/apartments')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                  padding: '0.875rem 2rem',
                  background: 'var(--gold)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--r-full)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all var(--t-fast)',
                  boxShadow: 'var(--shadow-gold)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(5,150,105,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-gold)'; }}
              >
                Explore Residences <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/contact')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  color: 'var(--white)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--r-full)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--t-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Calendar size={16} />
                Schedule a Consultation
              </button>
            </div>

            {/* Contact line */}
            <p style={{ marginTop: 'var(--s-8)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>
              Prefer to speak with an advisor?{' '}
              <a href="tel:+12025550180" style={{ color: 'var(--gold)', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={12} /> (202) 555-0180
              </a>
              {' '}— Available Mon–Sat, 9am–6pm
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
