import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, MessageSquare, FileText,
  LogOut, Menu, X, ChevronRight, Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NAV = [
  { label: 'Dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Properties',   href: '/admin/properties',   icon: Building2 },
  { label: 'Inquiries',    href: '/admin/inquiries',    icon: MessageSquare },
  { label: 'Applications', href: '/admin/applications', icon: FileText },
  { label: 'Site Settings',href: '/admin/settings',     icon: Settings },
];

const EMERALD = '#059669';
const EMERALD_BG = 'rgba(5,150,105,0.12)';

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast('Signed out successfully', 'info');
    navigate('/admin/login');
  };

  const handleToggle = () => {
    if (isMobile) setMobileOpen(o => !o);
    else setSidebarOpen(o => !o);
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const isExpanded = isMobile ? true : sidebarOpen;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '0 var(--s-4)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 'var(--s-3)', minHeight: 64 }}>
        <img
          src="/logo.PNG"
          alt="Rotex One Realty"
          style={{ height: 36, width: 36, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        {isExpanded && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', letterSpacing: '0.02em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>ROTEX ONE</div>
            <div style={{ fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: EMERALD, marginTop: 1 }}>Admin Panel</div>
          </div>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', padding: 4 }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--s-3) var(--s-2)' }}>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href || (href !== '/admin/dashboard' && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              title={!isExpanded ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                padding: 'var(--s-3) var(--s-3)',
                borderRadius: 'var(--r-lg)',
                marginBottom: 2,
                color: active ? EMERALD : 'rgba(255,255,255,0.5)',
                background: active ? EMERALD_BG : 'transparent',
                transition: 'all var(--t-fast)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textDecoration: 'none',
                borderLeft: active ? `2px solid ${EMERALD}` : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {isExpanded && <span style={{ fontSize: '0.875rem', fontWeight: active ? 600 : 400, flex: 1 }}>{label}</span>}
              {isExpanded && active && <ChevronRight size={13} style={{ flexShrink: 0, opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: 'var(--s-3) var(--s-2)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {isExpanded && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4, borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: EMERALD_BG, border: '1px solid rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: EMERALD, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={!isExpanded ? 'Sign Out' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
            padding: 'var(--s-3)',
            borderRadius: 'var(--r-lg)',
            border: 'none', background: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'all var(--t-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {isExpanded && <span style={{ fontSize: '0.875rem' }}>Sign Out</span>}
        </button>
      </div>
    </>
  );

  const currentPage = NAV.find(n => location.pathname === n.href || (n.href !== '/admin/dashboard' && location.pathname.startsWith(n.href)));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              zIndex: 199,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — desktop: sticky animated width, mobile: fixed drawer */}
      {isMobile ? (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: mobileOpen ? 0 : -260,
            width: 232,
            height: '100vh',
            background: '#0B1A12',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 200,
            transition: 'left 0.22s ease-in-out',
            overflow: 'hidden',
          }}
        >
          <SidebarContent />
        </aside>
      ) : (
        <motion.aside
          animate={{ width: sidebarOpen ? 232 : 60 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={{
            background: '#0B1A12',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top Bar */}
        <header style={{
          height: 64, background: 'var(--white)',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex', alignItems: 'center',
          padding: '0 var(--s-4)',
          gap: 'var(--s-3)',
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: 'var(--shadow-xs)',
        }}>
          <button
            onClick={handleToggle}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 'var(--r-md)', border: '1px solid var(--gray-200)', background: 'var(--white)', cursor: 'pointer', color: 'var(--gray-600)', flexShrink: 0, transition: 'all var(--t-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
          >
            {!isMobile && sidebarOpen ? <X size={15} /> : <Menu size={15} />}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            {currentPage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Admin</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-300)' }}>/</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--midnight)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentPage.label}</span>
              </div>
            )}
          </div>

          <Link
            to="/"
            target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-lg)', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gray-600)', textDecoration: 'none', transition: 'all var(--t-fast)', whiteSpace: 'nowrap', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
          >
            View Site ↗
          </Link>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--s-4)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
