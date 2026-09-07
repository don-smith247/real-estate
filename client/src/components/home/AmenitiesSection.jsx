import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi, Dumbbell, Car, Waves, Package, Shield, Bike, Coffee,
  Sun, UtensilsCrossed, Dog, Zap, Wind, Leaf, Lock, Users,
} from 'lucide-react';

const AMENITIES = [
  { icon: Shield, label: '24/7 Concierge', desc: 'Round-the-clock dedicated assistance' },
  { icon: Dumbbell, label: 'Fitness Centers', desc: 'State-of-the-art equipment' },
  { icon: Waves, label: 'Rooftop Pools', desc: 'Heated year-round' },
  { icon: Car, label: 'Secure Parking', desc: 'Underground & valet options' },
  { icon: Wifi, label: 'High-Speed WiFi', desc: 'Gigabit internet included' },
  { icon: Package, label: 'Package Room', desc: 'Smart lockers, 24/7 access' },
  { icon: Bike, label: 'Bike Storage', desc: 'Climate-controlled, secure' },
  { icon: Dog, label: 'Pet Friendly', desc: 'Selected units & buildings' },
  { icon: Sun, label: 'Rooftop Terraces', desc: 'Panoramic DC skyline views' },
  { icon: UtensilsCrossed, label: 'Chef\'s Kitchens', desc: 'Wolf & Sub-Zero appliances' },
  { icon: Zap, label: 'EV Charging', desc: 'Level 2 charging stations' },
  { icon: Leaf, label: 'Green Certified', desc: 'LEED & Energy Star rated' },
];

const CHECKLIST = [
  'Premium finishes in every residence',
  '24-hour maintenance response guarantee',
  'Flexible lease terms available',
  'Move-in ready, furnished options',
];

export default function AmenitiesSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-16)', alignItems: 'center' }}
          className="amenities-layout">

          {/* Left: Text */}
          <div>
            <div className="section-label"><span>Building Amenities</span></div>
            <h2 style={{ marginBottom: 'var(--s-5)' }}>
              Every Comfort,
              <br />
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Thoughtfully</span> Designed
            </h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--gray-500)', lineHeight: 1.75, marginBottom: 'var(--s-8)', maxWidth: 460 }}>
              Rotex One Realty properties are designed to elevate every dimension of your daily life. From the moment you step into the lobby to the view from your private terrace, every detail reflects our unwavering commitment to excellence.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              {CHECKLIST.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', fontSize: '0.9375rem', color: 'var(--gray-700)' }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-pale)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Amenity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-3)' }}>
            {AMENITIES.map((amenity, i) => {
              const Icon = amenity.icon;
              return (
                <motion.div
                  key={amenity.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={visible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                  style={{
                    padding: 'var(--s-4)',
                    borderRadius: 'var(--r-xl)',
                    border: '1px solid var(--gray-200)',
                    background: 'var(--white)',
                    transition: 'all var(--t-base)',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-pale)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ color: 'var(--gold)', marginBottom: 'var(--s-2)' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--midnight)', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                    {amenity.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', lineHeight: 1.4 }}>
                    {amenity.desc}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .amenities-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
