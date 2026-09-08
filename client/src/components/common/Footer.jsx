import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { settingsApi } from '../../utils/api';

const DEFAULTS = {
  contactPhone: '(202) 555-0180',
  contactEmail: 'info@rotexone.com',
  officeAddress: '1600 K Street NW',
  officeCity: 'Washington, DC 20006',
  companyTagline: "Washington DC's premier rental service.",
  instagramUrl: '#', facebookUrl: '#', linkedinUrl: '#',
  instagramHandle: '@rotexonerealty',
  facebookHandle: 'Rotex One Realty',
  linkedinHandle: 'Rotex One Realty',
};

const NAV_COLS = [
  {
    title: 'Top Cities',
    links: [
      { label: 'Washington DC',   href: '/apartments?search=Washington' },
      { label: 'New York City',   href: '/apartments?search=New+York' },
      { label: 'Atlanta',         href: '/apartments?search=Atlanta' },
      { label: 'Houston',         href: '/apartments?search=Houston' },
      { label: 'Chicago',         href: '/apartments?search=Chicago' },
      { label: 'Miami',           href: '/apartments?search=Miami' },
    ],
  },
  {
    title: 'Properties',
    links: [
      { label: 'All Listings',    href: '/apartments' },
      { label: 'Studios',         href: '/apartments?type=studio' },
      { label: '1 Bedrooms',      href: '/apartments?type=1br' },
      { label: '2 Bedrooms',      href: '/apartments?type=2br' },
      { label: '3 Bedrooms',      href: '/apartments?type=3br' },
      { label: 'Penthouses',      href: '/apartments?type=penthouse' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',        href: '/about' },
      { label: 'Services',        href: '/services' },
      { label: 'Testimonials',    href: '/testimonials' },
      { label: 'Contact',         href: '/contact' },
      { label: 'Schedule a Tour', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const [s, setS] = useState(DEFAULTS);

  useEffect(() => {
    settingsApi.getPublic()
      .then(res => setS({ ...DEFAULTS, ...res.data.data }))
      .catch(() => {});
  }, []);

  const socials = [
    { Icon: Instagram, label: s.instagramHandle, href: s.instagramUrl },
    { Icon: Facebook,  label: s.facebookHandle,  href: s.facebookUrl },
    { Icon: Linkedin,  label: s.linkedinHandle,  href: s.linkedinUrl },
  ];

  return (
    <footer style={{ background: '#0B1A12', color: 'rgba(255,255,255,0.7)' }}>
      <div className="container" style={{ paddingTop: 56, paddingBottom: 40 }}>

        {/* Top: brand + nav columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr 1fr', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="footer-grid">

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: 16 }}>
              <img
                src="/logo.PNG"
                alt="Rotex One Realty"
                style={{ height: 44, width: 'auto', objectFit: 'contain' }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', marginBottom: 20, maxWidth: 220 }}>
              {s.companyTagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { Icon: Phone,  val: s.contactPhone, href: `tel:${s.contactPhone.replace(/\D/g, '')}` },
                { Icon: Mail,   val: s.contactEmail, href: `mailto:${s.contactEmail}` },
                { Icon: MapPin, val: `${s.officeAddress}, ${s.officeCity}`, href: '#' },
              ].map(({ Icon, val, href }) => (
                <a key={val} href={href} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#34D399'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                  <Icon size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{val}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {col.title}
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#34D399'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 24 }}>
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
            &copy; {new Date().getFullYear()} Rotex One Realty LLC &middot; Washington, DC &middot; All rights reserved
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Privacy Policy', 'Terms of Service', 'Fair Housing'].map(l => (
                <a key={l} href="#" style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map(({ Icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', transition: 'all var(--t-fast)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#34D399'; e.currentTarget.style.background = 'rgba(5,150,105,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; } .footer-grid > div:first-child { grid-column: 1 / -1; } }
        @media (max-width: 600px)  { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 400px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
