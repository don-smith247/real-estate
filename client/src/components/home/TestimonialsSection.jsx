import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Olivia Chambers',
    role: 'Corporate Attorney',
    location: 'The Meridian, Dupont Circle',
    rating: 5,
    text: 'Rotex One Realty transformed what could have been a stressful relocation into a seamless experience. From the first showing to the day I picked up my keys, every step was handled with professionalism and genuine care. I couldn\'t imagine working with anyone else.',
    initials: 'OC',
  },
  {
    name: 'Jonathan & Priya Bose',
    role: 'Healthcare Executives',
    location: 'The Westbury, Georgetown',
    rating: 5,
    text: 'We relocated from Chicago and were initially overwhelmed by DC\'s rental market. Rotex One Realty understood exactly what we needed — they didn\'t just show us listings, they showed us the right listing on the first try. Two years later, we\'ve never looked back.',
    initials: 'JB',
  },
  {
    name: 'Elaine Forrester',
    role: 'Government Relations Director',
    location: 'Capitol View Penthouse, Capitol Hill',
    rating: 5,
    text: 'There is a distinct difference between a real estate company and a real estate partner. Rotex One Realty is the latter. The attention to detail, the market knowledge, and the genuine investment in finding me the perfect home — it\'s a level of service that simply stands apart.',
    initials: 'EF',
  },
  {
    name: 'Marcus St. James',
    role: 'Investment Banker',
    location: 'The Adams Loft, Adams Morgan',
    rating: 5,
    text: 'I\'ve worked with real estate firms in New York, London, and Dubai. What sets Rotex One Realty apart is the integrity. The pricing is transparent, the process is clear, and the team genuinely delivers on every promise. Outstanding in every regard.',
    initials: 'MS',
  },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= rating ? '#059669' : 'none'} stroke="#059669" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => c === 0 ? TESTIMONIALS.length - 1 : c - 1);
  const next = () => setCurrent(c => c === TESTIMONIALS.length - 1 ? 0 : c + 1);

  const t = TESTIMONIALS[current];

  return (
    <section className="section" style={{ background: 'var(--cream)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}><span>Client Stories</span></div>
          <h2>
            Hear From Our
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}> Clients</span>
          </h2>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.35 }}
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--r-3xl)',
                padding: 'var(--s-12)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--gray-200)',
                position: 'relative',
              }}
            >
              {/* Quote Icon */}
              <div style={{
                position: 'absolute', top: 'var(--s-8)', right: 'var(--s-10)',
                color: 'var(--gold-pale)',
              }}>
                <Quote size={64} strokeWidth={1} />
              </div>

              <StarRating rating={t.rating} />

              <blockquote style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.125rem, 2.5vw, 1.4375rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--midnight)',
                lineHeight: 1.65,
                margin: 'var(--s-6) 0',
                position: 'relative', zIndex: 1,
              }}>
                "{t.text}"
              </blockquote>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--midnight)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '2px' }}>{t.role}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-1)', fontSize: '0.75rem', color: 'var(--gold)', marginTop: 'var(--s-1)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--s-8)' }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--r-full)',
                    background: i === current ? 'var(--gold)' : 'var(--gray-300)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--t-base)',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
              {[{ fn: prev, icon: ChevronLeft }, { fn: next, icon: ChevronRight }].map(({ fn, icon: Icon }, i) => (
                <button
                  key={i}
                  onClick={fn}
                  style={{
                    width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 'var(--r-full)',
                    border: '1.5px solid var(--gray-200)',
                    background: 'var(--white)',
                    color: 'var(--midnight)',
                    cursor: 'pointer',
                    transition: 'all var(--t-fast)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--midnight)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
