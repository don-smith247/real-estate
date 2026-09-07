import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--midnight)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--s-8)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 20vw, 12rem)', fontWeight: 300, color: 'rgba(255,255,255,0.05)', lineHeight: 1, marginBottom: '-2rem' }}>
          404
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--white)', marginBottom: 'var(--s-4)' }}>
          Page Not Found
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 'var(--s-8)', maxWidth: 360 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
            padding: '0.75rem 2rem',
            background: 'var(--gold)',
            color: 'var(--midnight)',
            borderRadius: 'var(--r-full)',
            fontWeight: 700,
            fontSize: '0.9375rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
