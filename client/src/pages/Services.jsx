import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Eye, FileText, MapPin, Building2, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const SERVICES = [
  {
    icon: Search,
    title: 'Rental Search & Placement',
    desc: 'We match you with residences that align with your lifestyle, budget, and timeline. Our advisors leverage deep market knowledge to surface options you won\'t find on your own.',
  },
  {
    icon: Eye,
    title: 'Virtual & In-Person Tours',
    desc: 'Schedule flexible viewings with our expert advisors, available six days a week. Whether you prefer an immersive in-person experience or a high-definition virtual walkthrough, we accommodate your needs.',
  },
  {
    icon: FileText,
    title: 'Lease Negotiation',
    desc: 'Our team advocates for your best interests through every stage of the leasing process — from initial terms to move-in conditions — so you enter your new home with complete confidence.',
  },
  {
    icon: MapPin,
    title: 'Relocation Assistance',
    desc: 'Moving to Washington from another city? We guide you from first call to first night home. Our relocation specialists understand the urgency and complexity of cross-city moves.',
  },
  {
    icon: Building2,
    title: 'Property Management',
    desc: 'For building owners and investors seeking professional, hands-on management. We handle tenant relations, maintenance coordination, and reporting so you can focus on what matters.',
  },
  {
    icon: BarChart3,
    title: 'Market Advisory',
    desc: 'Trusted insights on DC\'s rental market — pricing trends, neighborhood dynamics, and optimal timing. We help both clients and property owners make informed, strategic decisions.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Consult',
    desc: 'We begin with a thorough consultation to understand your priorities, preferences, and timeline. No generic questionnaires — a real conversation with an experienced advisor.',
  },
  {
    step: '02',
    title: 'View',
    desc: 'We curate a personalized selection of residences and accompany you through every viewing, offering candid professional insight at each property.',
  },
  {
    step: '03',
    title: 'Move In',
    desc: 'From lease signing to handing you your keys, our team manages every detail so your move-in day is exactly what it should be — the beginning of something exceptional.',
  },
];

export default function Services() {
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

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            <div className="section-label"><span>What We Offer</span></div>
            <h1 style={{ color: 'var(--white)', marginBottom: 'var(--s-6)' }}>
              Comprehensive Services
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Built Around You</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 580, marginBottom: 'var(--s-8)' }}>
              From your first search to the day you sign your lease, Rotex One Realty provides the full spectrum of services that discerning clients in Washington DC deserve.
            </p>
            <Link
              to="/contact"
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
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><span>Our Services</span></div>
            <h2>Everything You Need,<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>In One Place</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--s-6)' }}>
            {SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    padding: 'var(--s-8)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--r-2xl)',
                    background: 'var(--white)',
                    transition: 'all var(--t-base)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--gray-200)';
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.transform = '';
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 'var(--r-xl)',
                    background: 'var(--gold-pale)',
                    border: '1px solid var(--gold-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)',
                    marginBottom: 'var(--s-5)',
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--midnight)', marginBottom: 'var(--s-3)' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>
                    {service.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--s-12)', textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}><span>How It Works</span></div>
            <h2>A Simple, Guided <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Process</span></h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--gray-500)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7, marginTop: 'var(--s-4)' }}>
              We've refined our process over 15 years to make finding your ideal Washington residence as effortless as it should be.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--s-8)' }}>
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ textAlign: 'center', padding: 'var(--s-6)' }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--gold)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em',
                  margin: '0 auto var(--s-6)',
                  boxShadow: 'var(--shadow-gold)',
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--midnight)', marginBottom: 'var(--s-4)' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--midnight)', padding: 'var(--s-20) 0', position: 'relative', overflow: 'hidden' }}>
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
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--s-5)' }}>
              Ready to Experience the<br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Rotex One Difference?</span>
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto var(--s-8)', lineHeight: 1.7 }}>
              Connect with our team today and discover how effortless finding the right home in Washington DC can truly be.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/contact"
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
                Schedule a Consultation <ArrowRight size={16} />
              </Link>
              <Link
                to="/apartments"
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
                Browse Residences
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}
