import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ALL_TESTIMONIALS = [
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
  {
    name: 'Catherine Whitmore',
    role: 'Senior Policy Analyst',
    location: 'Shaw Row House, Shaw',
    rating: 5,
    text: 'I was initially skeptical — I\'ve had disappointing experiences with real estate agencies before. But Rotex One Realty was different from my very first interaction. Their advisor listened carefully, asked the right questions, and found me a home I genuinely love. The entire process took less than three weeks.',
    initials: 'CW',
  },
  {
    name: 'Dr. Nathaniel Cross',
    role: 'Academic & Researcher',
    location: 'Logan Circle Residence, Logan Circle',
    rating: 5,
    text: 'As someone who values precision and thoroughness, I appreciated Rotex One Realty\'s methodical approach. Every document was prepared correctly, every timeline was met, and every question I had was answered completely. A rare standard of professionalism in this industry.',
    initials: 'NC',
  },
  {
    name: 'Isabella Reyes',
    role: 'Non-Profit Executive Director',
    location: 'The Pemberton, Adams Morgan',
    rating: 5,
    text: 'I was balancing a demanding work schedule while searching for a new home, and Rotex One Realty made it possible. They were flexible with my availability, proactive in their communication, and found me a beautiful apartment that perfectly fit my budget and lifestyle. Exceptional from start to finish.',
    initials: 'IR',
  },
  {
    name: 'Thomas Langford',
    role: 'Diplomatic Correspondent',
    location: 'Georgetown Heights, Georgetown',
    rating: 5,
    text: 'My career requires periodic relocations, and I\'ve rented in cities around the world. Rotex One Realty stands among the very best I\'ve encountered. Their market knowledge is encyclopedic, their service is personal, and their commitment to getting things right is evident in everything they do.',
    initials: 'TL',
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

export default function Testimonials() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'var(--midnight)',
        paddingTop: 'calc(var(--header-h) + var(--s-16))',
        paddingBottom: 'var(--s-20)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -150, right: -150, width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(5,150,105,0.4), transparent)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}><span>Client Voices</span></div>
          <h1 style={{ color: 'var(--white)', marginBottom: 'var(--s-5)', maxWidth: 640, margin: '0 auto var(--s-5)' }}>
            What Our Clients
            <br />
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Are Saying</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            The greatest measure of our success is the satisfaction of the clients we serve. Here are their stories, in their own words.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 'var(--s-6)',
          }}
            className="testimonials-grid"
          >
            {ALL_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--r-2xl)',
                  padding: 'var(--s-8)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--gray-200)',
                  borderLeft: '4px solid var(--gold)',
                  transition: 'all var(--t-base)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = ''; }}
              >
                {/* Stars */}
                <div style={{ marginBottom: 'var(--s-4)' }}>
                  <StarRating rating={t.rating} />
                </div>

                {/* Quote */}
                <blockquote style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'var(--midnight)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--s-6)',
                }}>
                  "{t.text}"
                </blockquote>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9375rem', fontWeight: 700, color: 'var(--gold)',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--midnight)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{t.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--gold)', marginTop: '2px' }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {t.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--midnight)', padding: 'var(--s-20) 0', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(5,150,105,0.4), transparent)',
        }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--s-4)' }}>
              Ready to write your own<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>success story?</span>
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: 440, margin: '0 auto var(--s-8)', lineHeight: 1.7 }}>
              Join hundreds of satisfied clients who found their ideal Washington DC residence with Rotex One Realty.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/apartments"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                  padding: '0.875rem 2rem',
                  background: 'var(--gold)',
                  color: 'var(--white)',
                  borderRadius: 'var(--r-full)',
                  fontWeight: 700, fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                  boxShadow: 'var(--shadow-gold)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
              >
                Explore Residences <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  color: 'var(--white)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 'var(--r-full)',
                  fontWeight: 500, fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Contact an Advisor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 480px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
