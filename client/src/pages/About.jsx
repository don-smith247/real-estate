import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Heart, Shield, Zap, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const VALUES = [
  { icon: Shield, title: 'Integrity First', desc: 'Every transaction is built on complete transparency. No hidden fees, no surprise charges. Honest guidance and clear terms from day one.' },
  { icon: Heart, title: 'Client-Centered', desc: 'Our clients are our community. Everything we do is designed around your needs, your timeline, and your vision of an exceptional home.' },
  { icon: Award, title: 'Curated Excellence', desc: 'We represent only properties we would be proud to call home ourselves. Our portfolio is built on quality, character, and attention to detail.' },
  { icon: Zap, title: 'Responsive Service', desc: 'Every inquiry answered within hours. Every concern resolved with urgency. We take our commitment to your experience seriously.' },
];

const TEAM = [
  { name: 'Victoria Pemberton', role: 'Founder & Principal Broker', bio: '20 years of experience leading luxury residential transactions across major US cities.' },
  { name: 'James Okafor', role: 'Director of Leasing', bio: 'Specialist in matching clients with their ideal residence across our nationwide portfolio of premier properties.' },
  { name: 'Sophia Lane', role: 'Head of Client Experience', bio: 'Ensures every interaction meets the Rotex One standard of excellence, from first call to move-in day.' },
  { name: 'Raymond Kessler', role: 'Property Portfolio Manager', bio: 'Oversees our nationwide portfolio with an eye for quality, resident satisfaction, and long-term value.' },
];

const FAQ = [
  { q: 'What is the typical lease term?', a: 'Our standard lease is 12 months. Rotex One Realty also offers 6, 18, and 24-month terms depending on the property. Contact us for flexible arrangements tailored to your needs.' },
  { q: 'How quickly can I move in?', a: 'For available units, we can typically facilitate move-in within 1 to 2 weeks after lease signing and deposit payment. Our team works to accommodate your timeline.' },
  { q: 'What credit score do I need?', a: 'We generally require a minimum credit score of 650 and monthly income of 3x the rent. We evaluate each application on its full merits.' },
  { q: 'Do you accept co-signers?', a: 'Yes, co-signers are accepted for qualified applicants who may not meet all income requirements independently. Contact our leasing team for details.' },
  { q: 'Are any utilities included?', a: 'This varies by property. Some residences include water, gas, or trash. All included utilities are clearly noted on each listing page.' },
  { q: 'What is your pet policy?', a: 'Many of our properties are pet-friendly. Pet policies, deposits, and restrictions vary by building and are listed on each property page.' },
];

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'var(--midnight)', paddingTop: 'calc(var(--header-h) + var(--s-12))', paddingBottom: 'var(--s-20)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="section-label"><span>Our Story</span></div>
            <h1 style={{ color: 'var(--white)', marginBottom: 'var(--s-6)' }}>
              Redefining What
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Renting Should Feel Like</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 620, marginBottom: 'var(--s-8)' }}>
              Rotex One Realty was founded on the belief that the rental experience should match the quality of the residence itself. For fifteen years, we have served clients across the United States with the expertise, integrity, and personal attention they deserve. Headquartered in Washington DC, with offices in major cities nationwide.
            </p>
            <Link
              to="/apartments"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
                padding: '0.875rem 2rem',
                background: 'var(--gold)',
                color: 'var(--white)',
                borderRadius: 'var(--r-full)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-dark)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
            >
              View Our Properties <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><span>Our Values</span></div>
            <h2>What We Stand For</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--s-5)' }}>
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ padding: 'var(--s-8)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-2xl)', background: 'var(--white)' }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--r-xl)', background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: 'var(--s-5)' }}>
                    <Icon size={22} />
                  </div>
                  <h4 style={{ marginBottom: 'var(--s-3)' }}>{v.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><span>Our Team</span></div>
            <h2>Meet the <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Rotex One Team</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--s-6)' }}>
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-2xl)', overflow: 'hidden', transition: 'all var(--t-base)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--midnight) 100%)', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--gold)' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <div style={{ padding: 'var(--s-5)' }}>
                  <h4 style={{ marginBottom: 'var(--s-1)' }}>{member.name}</h4>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--s-3)' }}>{member.role}</div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" style={{ background: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><span>FAQ</span></div>
            <h2>Frequently Asked <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Questions</span></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ padding: 'var(--s-6)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', background: 'var(--white)' }}
              >
                <h5 style={{ marginBottom: 'var(--s-2)', color: 'var(--midnight)', fontSize: '0.9375rem' }}>{item.q}</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .about-hero h1 { font-size: 2rem !important; }
          .about-values { grid-template-columns: 1fr !important; }
          .about-team { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-team { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
