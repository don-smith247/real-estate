import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, User, X, Heart, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchVal.trim() ? `/apartments?search=${encodeURIComponent(searchVal.trim())}` : '/apartments');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: '#FFFFFF',
        borderBottom: `1px solid ${scrolled ? '#D0DBD3' : '#E8EEE9'}`,
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', height: 'var(--header-h)' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
            <img
              src="/logo.PNG"
              alt="Rotex One Realty"
              style={{ height: 40, width: 'auto', maxWidth: 120, objectFit: 'contain' }}
              onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
            />
            <span style={{ display: 'none', fontWeight: 800, fontSize: '1rem', color: '#059669', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1 }}>
              ROTEX ONE<br/>
              <span style={{ fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.12em', color: '#6B8872' }}>REALTY</span>
            </span>
          </Link>

          {/* Center Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 460, margin: '0 auto' }} className="nav-search-wrap">
            <div
              style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid #D0DBD3', borderRadius: '40px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
                <Search size={14} style={{ color: '#6B8872', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search by neighborhood or type..."
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: '0.875rem', fontFamily: 'inherit', color: '#0B1A12',
                    width: '100%', padding: '11px 0',
                  }}
                />
                {searchVal && (
                  <button type="button" onClick={() => setSearchVal('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#6B8872', padding: 2 }}>
                    <X size={13} />
                  </button>
                )}
              </div>
              <button type="submit" style={{
                margin: '5px', padding: '9px 14px',
                background: '#059669', border: 'none', borderRadius: '32px',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#047857'}
                onMouseLeave={e => e.currentTarget.style.background = '#059669'}
              >
                <Search size={14} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            {[
              { label: 'Apartments', href: '/apartments' },
              { label: 'Services', href: '/services' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  padding: '10px 14px', borderRadius: '22px',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: location.pathname === link.href ? '#0B1A12' : '#4A6652',
                  textDecoration: 'none',
                  background: location.pathname === link.href ? '#F4F7F5' : 'transparent',
                  transition: 'background 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                className="nav-link-desktop"
                onMouseEnter={e => { if (location.pathname !== link.href) e.currentTarget.style.background = '#F4F7F5'; }}
                onMouseLeave={e => { if (location.pathname !== link.href) e.currentTarget.style.background = 'transparent'; }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Menu */}
            <div ref={dropdownRef} style={{ position: 'relative', marginLeft: '4px' }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 5px 5px 12px',
                  border: '1px solid #D0DBD3', borderRadius: '22px',
                  background: 'white', cursor: 'pointer',
                  transition: 'box-shadow 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.14)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <Menu size={15} style={{ color: '#0B1A12' }} />
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: isAuthenticated ? '#059669' : '#6B8872',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700, color: 'white',
                }}>
                  {isAuthenticated ? initials : <User size={14} style={{ color: 'white' }} />}
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'white', border: '1px solid #D0DBD3',
                  borderRadius: '12px', boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
                  minWidth: 200, zIndex: 1001, overflow: 'hidden',
                }}>
                  {isAuthenticated ? (
                    <>
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8EEE9' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0B1A12' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#6B8872', marginTop: '2px' }}>{user?.email}</div>
                      </div>
                      {isAdmin ? (
                        <>
                          <DropItem label="Admin panel" href="/admin" icon={<LayoutDashboard size={15} />} />
                          <DropItem label="Sign out" onClick={handleLogout} icon={<LogOut size={15} />} danger />
                        </>
                      ) : (
                        <>
                          <DropItem label="Dashboard" href="/dashboard" icon={<LayoutDashboard size={15} />} />
                          <DropItem label="Saved homes" href="/saved" icon={<Heart size={15} />} />
                          <DropItem label="Profile" href="/profile" icon={<User size={15} />} />
                          <div style={{ borderTop: '1px solid #E8EEE9' }} />
                          <DropItem label="Sign out" onClick={handleLogout} icon={<LogOut size={15} />} danger />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <DropItem label="Log in" href="/login" bold />
                      <DropItem label="Sign up" href="/register" />
                      <div style={{ borderTop: '1px solid #E8EEE9' }} />
                      <DropItem label="Apartments" href="/apartments" />
                      <DropItem label="Services" href="/services" />
                      <DropItem label="About" href="/about" />
                      <DropItem label="Contact" href="/contact" />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40,
                border: '1px solid #D0DBD3', borderRadius: '50%',
                background: 'white', cursor: 'pointer', color: '#0B1A12',
              }}
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--header-h)', left: 0, right: 0, zIndex: 999,
          background: '#fff', borderBottom: '1px solid #E8EEE9',
          padding: '16px 24px 24px',
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid #D0DBD3', borderRadius: '12px', padding: '12px 16px',
            }}>
              <Search size={14} style={{ color: '#6B8872' }} />
              <input
                type="text" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search residences..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9375rem', fontFamily: 'inherit', color: '#0B1A12' }}
              />
            </div>
          </form>
          {[
            { label: 'Apartments', href: '/apartments' },
            { label: 'Services', href: '/services' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(link => (
            <Link key={link.href} to={link.href} style={{
              display: 'block', padding: '12px 0',
              borderBottom: '1px solid #E8EEE9',
              fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none',
            }}>
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Link to="/dashboard" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8EEE9', fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none' }}>Dashboard</Link>
                  <Link to="/saved" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8EEE9', fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none' }}>Saved homes</Link>
                  <Link to="/profile" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8EEE9', fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none' }}>Profile</Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8EEE9', fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none' }}>Admin panel</Link>
              )}
              <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', border: 'none', background: 'none', fontSize: '1rem', fontWeight: 500, color: '#DC2626', cursor: 'pointer' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8EEE9', fontSize: '1rem', fontWeight: 600, color: '#0B1A12', textDecoration: 'none' }}>Log in</Link>
              <Link to="/register" style={{ display: 'block', padding: '12px 0', fontSize: '1rem', fontWeight: 500, color: '#0B1A12', textDecoration: 'none' }}>Sign up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-search-wrap { display: none !important; }
          .nav-link-desktop { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}

function DropItem({ label, href, onClick, icon, bold, danger }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) { onClick(); return; }
    navigate(href);
  };
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '11px 16px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        fontSize: '0.875rem', fontWeight: bold ? 600 : 400,
        color: danger ? '#DC2626' : '#0B1A12',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#F4F7F5'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon && <span style={{ color: danger ? '#DC2626' : '#6B8872' }}>{icon}</span>}
      {label}
    </button>
  );
}
