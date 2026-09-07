import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import InquiryForm from '../components/forms/InquiryForm';
import { settingsApi } from '../utils/api';

const DEFAULTS = {
  contactPhone: '(202) 555-0180', contactEmail: 'hello@rotexonerealty.com',
  officeAddress: '1600 K Street NW', officeCity: 'Washington, DC 20006',
  officeHours: 'Mon–Fri: 9am–6pm · Sat: 10am–4pm',
  instagramUrl: '#', facebookUrl: '#', linkedinUrl: '#',
  instagramHandle: '@rotexonerealty', facebookHandle: 'Rotex One Realty', linkedinHandle: 'Rotex One Realty',
};

export default function Contact() {
  const [s, setS] = useState(DEFAULTS);
  useEffect(() => {
    settingsApi.getPublic().then(res => setS({ ...DEFAULTS, ...res.data.data })).catch(() => {});
  }, []);

  const CONTACT_INFO = [
    { icon: Phone,  label: 'Phone',        value: s.contactPhone,  sub: 'Mon–Sat, 9am–7pm',          href: `tel:${s.contactPhone.replace(/\D/g,'')}` },
    { icon: Mail,   label: 'Email',        value: s.contactEmail,  sub: 'We respond within 24 hours', href: `mailto:${s.contactEmail}` },
    { icon: MapPin, label: 'Office',       value: s.officeAddress, sub: s.officeCity,                 href: '#' },
    { icon: Clock,  label: 'Office Hours', value: s.officeHours,   sub: null,                         href: null },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />

      {/* Header */}
      <section style={{ background: 'var(--midnight)', paddingTop: 'calc(var(--header-h) + var(--s-12))', paddingBottom: 'var(--s-16)' }}>
        <div className="container">
          <div className="section-label"><span>Get In Touch</span></div>
          <h1 style={{ color: 'var(--white)', marginBottom: 'var(--s-4)' }}>
            We're Here
            <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}> To Help You Home</span>
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.55)', maxWidth: 540, lineHeight: 1.7 }}>
            Whether you're exploring your options, ready to schedule a viewing, or have questions about a specific property — our team is ready to guide you every step of the way.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 'var(--s-12)', alignItems: 'start' }}
            className="contact-layout">

            {/* Left: Contact Info */}
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)', marginBottom: 'var(--s-8)' }}
                className="contact-cards">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon;
                  const Wrapper = item.href ? 'a' : 'div';
                  return (
                    <Wrapper
                      key={item.label}
                      href={item.href || undefined}
                      style={{
                        display: 'block',
                        padding: 'var(--s-6)',
                        background: 'var(--white)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--r-2xl)',
                        transition: 'all var(--t-fast)',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={e => { if (item.href) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                      onMouseLeave={e => { if (item.href) { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; } }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--r-xl)', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: 'var(--s-4)' }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 'var(--s-1)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--midnight)', marginBottom: '0.25rem' }}>{item.value}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>{item.sub}</div>
                    </Wrapper>
                  );
                })}
              </div>

              {/* Social */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)' }}>
                <h4 style={{ marginBottom: 'var(--s-4)' }}>Follow Rotex One Realty</h4>
                <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                  {[
                    { Icon: Instagram, label: s.instagramHandle, href: s.instagramUrl },
                    { Icon: Facebook,  label: s.facebookHandle,  href: s.facebookUrl },
                    { Icon: Linkedin,  label: s.linkedinHandle,  href: s.linkedinUrl },
                  ].map(({ Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--r-full)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'var(--gray-700)',
                      transition: 'all var(--t-fast)',
                      textDecoration: 'none',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}>
                      <Icon size={14} /> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: 'var(--s-2)' }}>Send Us a Message</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 'var(--s-6)' }}>
                Our advisors respond within one business day.
              </p>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 1024px) {
          .contact-layout { grid-template-columns: 1fr !important; }
          .contact-layout > div:last-child { order: -1; }
        }
        @media (max-width: 600px) {
          .contact-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
