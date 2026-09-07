import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Home, FileText, Phone, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/property/PropertyCard';
import { propertiesApi } from '../utils/api';

export default function UserDashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    propertiesApi.getAll({ limit: 4 })
      .then(r => setFeatured(r.data.data || []))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const saved = user?.savedProperties || [];
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  const quickLinks = [
    { icon: Home, label: 'Browse apartments', desc: 'Explore all available listings', href: '/apartments', color: '#FF385C' },
    { icon: Heart, label: 'Saved homes', desc: `${saved.length} saved propert${saved.length === 1 ? 'y' : 'ies'}`, href: '/saved', color: '#E31C5F' },
    { icon: User, label: 'Edit profile', desc: 'Update your info and password', href: '/profile', color: '#484848' },
    { icon: Phone, label: 'Contact us', desc: 'Schedule a tour or ask a question', href: '/contact', color: '#717171' },
  ];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 'var(--header-h)' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #EEEEEE', background: '#fff', padding: '40px 0 32px' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#FF385C', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.375rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222', marginBottom: '2px', letterSpacing: '-0.02em' }}>
                    Welcome back, {user?.name?.split(' ')[0]}
                  </h1>
                  <p style={{ color: '#717171', fontSize: '0.9375rem' }}>{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', border: '1px solid #DDDDDD',
                  borderRadius: '8px', background: '#fff',
                  fontSize: '0.875rem', fontWeight: 500, color: '#484848', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F7F7'; e.currentTarget.style.borderColor = '#222'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#DDDDDD'; }}
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '40px var(--s-6) 80px' }}>
          {/* Quick Links */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '56px' }}>
            {quickLinks.map((q, i) => (
              <motion.div
                key={q.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={q.href} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{
                    padding: '20px', border: '1px solid #EEEEEE', borderRadius: '12px',
                    background: '#fff', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#DDDDDD'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#EEEEEE'; }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '10px',
                      background: q.color + '15',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px',
                    }}>
                      <q.icon size={18} style={{ color: q.color }} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#222', marginBottom: '4px' }}>{q.label}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#717171' }}>{q.desc}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Saved Homes Preview */}
          {saved.length > 0 && (
            <section style={{ marginBottom: '56px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#222', letterSpacing: '-0.02em' }}>
                  Saved homes
                </h2>
                <Link to="/saved" style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.875rem', fontWeight: 600, color: '#FF385C', textDecoration: 'none',
                }}>
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                {saved.slice(0, 4).map((p, i) => (
                  <PropertyCard key={p._id} property={p} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Browse more */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#222', letterSpacing: '-0.02em' }}>
                {saved.length === 0 ? 'Start browsing' : 'More to explore'}
              </h2>
              <Link to="/apartments" style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '0.875rem', fontWeight: 600, color: '#FF385C', textDecoration: 'none',
              }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {featured.map((p, i) => (
                <PropertyCard key={p._id} property={p} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
