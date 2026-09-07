import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MessageSquare, FileText, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { adminApi } from '../../utils/api';
import { formatDate, statusColors } from '../../utils/helpers';

function StatCard({ title, value, sub, icon: Icon, color, index, href }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
      <Link to={href || '#'} style={{
        display: 'flex', alignItems: 'center', gap: 'var(--s-4)',
        padding: 'var(--s-6)',
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--r-xl)',
        textDecoration: 'none',
        transition: 'box-shadow var(--t-fast), transform var(--t-fast)',
        boxShadow: 'var(--shadow-xs)',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; e.currentTarget.style.transform = ''; }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 'var(--r-xl)', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          <Icon size={22} />
        </div>
        <div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--midnight)', lineHeight: 1, marginBottom: 4 }}>
            {value ?? <div className="skeleton" style={{ height: 28, width: 48, display: 'inline-block', borderRadius: 4 }} />}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)' }}>{title}</div>
          {sub && <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: 2 }}>{sub}</div>}
        </div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.new;
  return (
    <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', background: c.bg, color: c.color }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: 'Total Properties', value: stats?.properties?.total,      sub: `${stats?.properties?.available ?? 0} available`,  icon: Building2,    color: '#8B5CF6', href: '/admin/properties' },
    { title: 'New Inquiries',    value: stats?.inquiries?.new,          sub: `${stats?.inquiries?.total ?? 0} total`,            icon: MessageSquare, color: '#0EA5E9', href: '/admin/inquiries' },
    { title: 'Pending Reviews',  value: stats?.applications?.pending,   sub: `${stats?.applications?.total ?? 0} submitted`,     icon: FileText,      color: '#F59E0B', href: '/admin/applications' },
    { title: 'Approved Leases',  value: stats?.applications?.approved,  sub: 'All time',                                         icon: CheckCircle,   color: '#059669', href: '/admin/applications' },
  ];

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Page title */}
      <div style={{ marginBottom: 'var(--s-6)' }}>
        <h2 style={{ marginBottom: 4, color: 'var(--midnight)' }}>Dashboard</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Welcome back — here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s-4)', marginBottom: 'var(--s-8)' }} className="dash-cards">
        {cards.map((c, i) => <StatCard key={c.title} {...c} index={i} />)}
      </div>

      {/* Tables row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-6)' }} className="dash-tables">

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Recent Inquiries</h4>
            <Link to="/admin/inquiries" style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 13, width: '55%', borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 11, width: '70%', borderRadius: 4 }} />
                </div>
                <div className="skeleton" style={{ height: 20, width: 56, borderRadius: 20 }} />
              </div>
            ))
          ) : !stats?.recentInquiries?.length ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>No inquiries yet</div>
          ) : (
            stats.recentInquiries.map(inq => (
              <Link
                key={inq._id}
                to="/admin/inquiries"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', textDecoration: 'none', transition: 'background var(--t-fast)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--midnight)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.email} · {inq.propertyTitle || 'General'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <StatusBadge status={inq.status} />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>{formatDate(inq.createdAt, { month: 'short', day: 'numeric' })}</span>
                </div>
              </Link>
            ))
          )}
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Recent Applications</h4>
            <Link to="/admin/applications" style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 13, width: '50%', borderRadius: 4, marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 11, width: '65%', borderRadius: 4 }} />
                </div>
                <div className="skeleton" style={{ height: 20, width: 64, borderRadius: 20 }} />
              </div>
            ))
          ) : !stats?.recentApplications?.length ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.875rem' }}>No applications yet</div>
          ) : (
            stats.recentApplications.map(app => {
              const fullName = [app.applicant?.firstName, app.applicant?.lastName].filter(Boolean).join(' ') || 'Applicant';
              return (
                <Link
                  key={app._id}
                  to="/admin/applications"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--gray-100)', textDecoration: 'none', transition: 'background var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--midnight)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.propertyTitle || 'Unknown property'} · {formatDate(app.createdAt, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Tawk.to row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
        style={{ marginTop: 'var(--s-6)', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, boxShadow: 'var(--shadow-xs)', flexWrap: 'wrap' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--r-lg)', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} style={{ color: '#059669' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--midnight)' }}>Live Chat — Tawk.to</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>tickets@rotex-one-realty.p.tawk.email</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669' }} />
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Active</span>
          </div>
        </div>
        <a
          href="https://dashboard.tawk.to"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#059669', color: 'white', borderRadius: 'var(--r-lg)', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none', transition: 'background var(--t-fast)', whiteSpace: 'nowrap' }}
          onMouseEnter={e => e.currentTarget.style.background = '#047857'}
          onMouseLeave={e => e.currentTarget.style.background = '#059669'}
        >
          Open Tawk.to Dashboard <ExternalLink size={13} />
        </a>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) { .dash-cards { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .dash-cards { grid-template-columns: 1fr !important; } }
        @media (max-width: 860px)  { .dash-tables { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
