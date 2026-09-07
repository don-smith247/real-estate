import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Star, Clock } from 'lucide-react';

const STATS = [
  { icon: Building2, value: 200, suffix: '+', label: 'Premium Listings', sublabel: 'Curated across DC' },
  { icon: Users, value: 3500, suffix: '+', label: 'Satisfied Clients', sublabel: 'And growing every year' },
  { icon: Star, value: 4.9, suffix: '', label: 'Client Rating', sublabel: 'From verified residents' },
  { icon: Clock, value: 15, suffix: ' Years', label: 'Of Expertise', sublabel: 'Serving Washington DC' },
];

function useCountUp(target, duration = 2000, isVisible) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isVisible, target, duration]);

  return count;
}

function StatCard({ stat, index, isVisible }) {
  const count = useCountUp(stat.value, 2000, isVisible);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--s-10) var(--s-8)',
        borderRight: index < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--r-xl)',
        background: 'rgba(5,150,105,0.12)',
        border: '1px solid rgba(5,150,105,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--s-5)',
        color: '#34D399',
      }}>
        <Icon size={22} />
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        fontWeight: 600,
        color: 'var(--white)',
        lineHeight: 1,
        marginBottom: 'var(--s-2)',
        letterSpacing: '-0.02em',
      }}>
        {count}{stat.suffix}
      </div>

      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--white)', marginBottom: 'var(--s-1)' }}>
        {stat.label}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>
        {stat.sublabel}
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: 'var(--midnight)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(5,150,105,0.4), transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(5,150,105,0.2), transparent)',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
          className="stats-grid"
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
