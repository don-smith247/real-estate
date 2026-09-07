import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/property/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../utils/api';

export default function SavedHomes() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.getSaved()
      .then(r => setSaved(r.data.data || []))
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 'var(--header-h)' }}>
        <div style={{ borderBottom: '1px solid #EEEEEE', padding: '32px 0' }}>
          <div className="container">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#222', letterSpacing: '-0.025em', marginBottom: '4px' }}>
              Saved homes
            </h1>
            <p style={{ color: '#717171', fontSize: '0.9375rem' }}>
              {loading ? 'Loading…' : `${saved.length} saved ${saved.length === 1 ? 'home' : 'homes'}`}
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: '40px var(--s-6) 80px' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: '12px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '8px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : saved.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#FFF0F1', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 24px',
              }}>
                <Heart size={32} style={{ color: '#FF385C' }} />
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#222', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                No saved homes yet
              </h2>
              <p style={{ color: '#717171', fontSize: '0.9375rem', marginBottom: '28px', maxWidth: 360, margin: '0 auto 28px' }}>
                Tap the heart icon on any listing to save it here for easy access later.
              </p>
              <Link to="/apartments" style={{
                display: 'inline-block', padding: '13px 28px',
                background: '#FF385C', color: 'white', borderRadius: '8px',
                fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none',
              }}>
                Browse apartments
              </Link>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {saved.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <PropertyCard property={p} index={i} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
