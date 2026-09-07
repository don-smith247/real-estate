import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trash2, Mail, Phone, DollarSign, Calendar, User } from 'lucide-react';
import { applicationsApi } from '../../utils/api';
import { formatDate, formatCurrency, statusColors } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const STATUSES = ['', 'pending', 'under_review', 'approved', 'denied', 'withdrawn'];
const STATUS_LABELS = { '': 'All', pending: 'Pending', under_review: 'Under Review', approved: 'Approved', denied: 'Denied', withdrawn: 'Withdrawn' };

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.pending;
  return <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--r-full)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', background: c.bg, color: c.color }}>{status?.replace(/_/g, ' ')}</span>;
}

export default function ApplicationsAdmin() {
  const { toast } = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      const res = await applicationsApi.getAll({ ...params, limit: 50 });
      setApps(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSelect = async (app) => {
    try {
      const res = await applicationsApi.getById(app._id);
      setSelected(res.data.data);
      setNotes(res.data.data.adminNotes || '');
    } catch { toast('Failed to load application', 'error'); }
  };

  const handleStatusUpdate = async (status) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await applicationsApi.update(selected._id, { status, adminNotes: notes });
      setSelected(res.data.data);
      setApps(prev => prev.map(a => a._id === selected._id ? { ...a, status } : a));
      toast(`Application ${status.replace(/_/g, ' ')}`, 'success');
    } catch { toast('Failed to update', 'error'); } finally { setUpdating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await applicationsApi.delete(id);
      setApps(prev => prev.filter(a => a._id !== id));
      if (selected?._id === id) setSelected(null);
      toast('Application deleted', 'success');
    } catch { toast('Failed to delete', 'error'); }
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 'var(--s-6)' }}>
        <h2 style={{ marginBottom: 'var(--s-1)' }}>Applications</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{apps.length} total applications</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--s-3)', marginBottom: 'var(--s-5)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 'var(--s-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input type="text" placeholder="Search applicant, property..." className="form-input" style={{ paddingLeft: 'calc(var(--s-3) + 18px)' }}
            value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(f => ({ ...f, status: s }))}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: filter.status === s ? 'var(--midnight)' : 'var(--gray-200)', background: filter.status === s ? 'var(--midnight)' : 'var(--white)', color: filter.status === s ? 'var(--white)' : 'var(--gray-600)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)', whiteSpace: 'nowrap' }}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 440px' : '1fr', gap: 'var(--s-5)', alignItems: 'start' }}
        className="apps-layout">

        {/* Table */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
                  {['Applicant', 'Property', 'Income', 'Status', 'Date', ''].map(h => (
                    <th key={h} style={{ padding: 'var(--s-3) var(--s-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} style={{ padding: 'var(--s-4) var(--s-5)' }}><div className="skeleton" style={{ height: 14 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : apps.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 'var(--s-12)', textAlign: 'center', color: 'var(--gray-400)' }}>No applications found</td></tr>
                ) : apps.map(app => (
                  <tr key={app._id}
                    onClick={() => handleSelect(app)}
                    style={{ borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', background: selected?._id === app._id ? 'var(--gold-pale)' : 'var(--white)', transition: 'background var(--t-fast)' }}
                    onMouseEnter={e => { if (selected?._id !== app._id) e.currentTarget.style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (selected?._id !== app._id) e.currentTarget.style.background = 'var(--white)'; }}
                  >
                    <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--midnight)' }}>{app.applicant?.firstName} {app.applicant?.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{app.applicationNumber}</div>
                    </td>
                    <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.propertyTitle}</div>
                    </td>
                    <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--midnight)' }}>{app.employment?.monthlyIncome ? formatCurrency(app.employment.monthlyIncome) : '—'}</span>
                    </td>
                    <td style={{ padding: 'var(--s-4) var(--s-5)' }}><StatusBadge status={app.status} /></td>
                    <td style={{ padding: 'var(--s-4) var(--s-5)', fontSize: '0.75rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                      {formatDate(app.createdAt, { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                      <button onClick={e => { e.stopPropagation(); handleDelete(app._id); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: '1px solid #FEE2E2', borderRadius: 'var(--r-md)', background: '#FEF2F2', color: 'var(--error)', cursor: 'pointer' }}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden', position: 'sticky', top: 'var(--s-6)', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            >
              <div style={{ padding: 'var(--s-5) var(--s-6)', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--white)', zIndex: 1 }}>
                <h4>Application Detail</h4>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}><X size={16} /></button>
              </div>

              <div style={{ padding: 'var(--s-6)', display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
                <StatusBadge status={selected.status} />

                {/* Applicant */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-3)' }}>Applicant</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--s-2)' }}>{selected.applicant?.firstName} {selected.applicant?.lastName}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                    <a href={`mailto:${selected.applicant?.email}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gold)' }}><Mail size={13} />{selected.applicant?.email}</a>
                    {selected.applicant?.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-600)' }}><Phone size={13} />{selected.applicant?.phone}</span>}
                    {selected.moveInDate && <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-600)' }}><Calendar size={13} />Move-in: {formatDate(selected.moveInDate)}</span>}
                  </div>
                </div>

                {/* Employment */}
                {selected.employment && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-3)' }}>Employment</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Employer</span>
                        <span style={{ fontWeight: 500 }}>{selected.employment.employerName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Position</span>
                        <span style={{ fontWeight: 500 }}>{selected.employment.position}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--gray-500)' }}>Monthly Income</span>
                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(selected.employment.monthlyIncome || 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Actions */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-3)' }}>Decision</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                    <button onClick={() => handleStatusUpdate('under_review')} disabled={updating}
                      style={{ padding: 'var(--s-3)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--r-lg)', background: selected.status === 'under_review' ? 'var(--midnight)' : 'var(--white)', color: selected.status === 'under_review' ? 'var(--white)' : 'var(--gray-700)', fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                      Mark Under Review
                    </button>
                    <button onClick={() => handleStatusUpdate('approved')} disabled={updating}
                      style={{ padding: 'var(--s-3)', border: '1.5px solid #22A06B', borderRadius: 'var(--r-lg)', background: selected.status === 'approved' ? '#22A06B' : '#EBF8F0', color: selected.status === 'approved' ? 'white' : '#166534', fontWeight: 600, cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                      Approve Application
                    </button>
                    <button onClick={() => handleStatusUpdate('denied')} disabled={updating}
                      style={{ padding: 'var(--s-3)', border: '1.5px solid var(--error)', borderRadius: 'var(--r-lg)', background: selected.status === 'denied' ? 'var(--error)' : '#FEF2F2', color: selected.status === 'denied' ? 'white' : '#9B1C1C', fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                      Deny Application
                    </button>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-2)' }}>Notes</div>
                  <textarea className="form-input" style={{ minHeight: 80, fontSize: '0.875rem' }} placeholder="Internal notes..." value={notes} onChange={e => setNotes(e.target.value)} />
                  <button onClick={() => applicationsApi.update(selected._id, { adminNotes: notes }).then(() => toast('Notes saved', 'success'))}
                    style={{ marginTop: 'var(--s-2)', padding: '0.5rem 1rem', background: 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                    Save Notes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .apps-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
