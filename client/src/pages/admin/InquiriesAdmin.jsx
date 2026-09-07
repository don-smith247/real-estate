import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Trash2, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { inquiriesApi } from '../../utils/api';
import { formatDate, statusColors } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

const STATUSES = ['', 'new', 'read', 'contacted', 'resolved', 'archived'];
const STATUS_LABELS = { '': 'All', new: 'New', read: 'Read', contacted: 'Contacted', resolved: 'Resolved', archived: 'Archived' };

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.new;
  return <span style={{ padding: '0.2rem 0.6rem', borderRadius: 'var(--r-full)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', background: c.bg, color: c.color }}>{status?.replace(/_/g, ' ')}</span>;
}

export default function InquiriesAdmin() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState([]);
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
      const res = await inquiriesApi.getAll({ ...params, limit: 50 });
      setInquiries(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSelect = (inq) => {
    setSelected(inq);
    setNotes(inq.adminNotes || '');
    if (inq.status === 'new') {
      inquiriesApi.update(inq._id, { status: 'read' }).then(() => {
        setInquiries(prev => prev.map(i => i._id === inq._id ? { ...i, status: 'read' } : i));
      });
    }
  };

  const handleUpdate = async (field, value) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await inquiriesApi.update(selected._id, { [field]: value });
      setSelected(res.data.data);
      setInquiries(prev => prev.map(i => i._id === selected._id ? res.data.data : i));
      toast('Updated', 'success');
    } catch {
      toast('Failed to update', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await inquiriesApi.delete(id);
      setInquiries(prev => prev.filter(i => i._id !== id));
      if (selected?._id === id) setSelected(null);
      toast('Inquiry deleted', 'success');
    } catch { toast('Failed to delete', 'error'); }
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 'var(--s-6)' }}>
        <h2 style={{ marginBottom: 'var(--s-1)' }}>Inquiries</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{inquiries.length} total</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--s-3)', marginBottom: 'var(--s-5)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 'var(--s-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input type="text" placeholder="Search name, email..." className="form-input" style={{ paddingLeft: 'calc(var(--s-3) + 18px)' }}
            value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(f => ({ ...f, status: s }))}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: filter.status === s ? 'var(--midnight)' : 'var(--gray-200)', background: filter.status === s ? 'var(--midnight)' : 'var(--white)', color: filter.status === s ? 'var(--white)' : 'var(--gray-600)', fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)', whiteSpace: 'nowrap' }}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 'var(--s-5)', alignItems: 'start' }}
        className="inquiries-layout">

        {/* List */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ padding: 'var(--s-4) var(--s-5)', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 'var(--s-3)' }}>
                <div className="skeleton" style={{ height: 40, width: 40, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  <div className="skeleton" style={{ height: 12, width: '80%' }} />
                </div>
              </div>
            ))
          ) : inquiries.length === 0 ? (
            <div style={{ padding: 'var(--s-12)', textAlign: 'center', color: 'var(--gray-400)' }}>No inquiries found</div>
          ) : (
            inquiries.map(inq => (
              <div
                key={inq._id}
                onClick={() => handleSelect(inq)}
                style={{
                  padding: 'var(--s-4) var(--s-5)',
                  borderBottom: '1px solid var(--gray-100)',
                  cursor: 'pointer',
                  background: selected?._id === inq._id ? 'var(--gold-pale)' : inq.status === 'new' ? 'rgba(201,168,76,0.04)' : 'var(--white)',
                  transition: 'background var(--t-fast)',
                }}
                onMouseEnter={e => { if (selected?._id !== inq._id) e.currentTarget.style.background = 'var(--gray-50)'; }}
                onMouseLeave={e => { if (selected?._id !== inq._id) e.currentTarget.style.background = inq.status === 'new' ? 'rgba(201,168,76,0.04)' : 'var(--white)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s-3)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, color: 'var(--gray-600)', flexShrink: 0 }}>
                    {inq.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-2)' }}>
                      <div style={{ fontWeight: inq.status === 'new' ? 700 : 500, fontSize: '0.875rem', color: 'var(--midnight)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</div>
                      <StatusBadge status={inq.status} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inq.propertyTitle || 'General Inquiry'} — {inq.type}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{formatDate(inq.createdAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden', position: 'sticky', top: 'var(--s-6)' }}
            >
              <div style={{ padding: 'var(--s-5) var(--s-6)', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Inquiry Detail</h4>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}><X size={16} /></button>
              </div>

              <div style={{ padding: 'var(--s-6)', display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
                {/* Contact */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-3)' }}>Contact</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--s-2)' }}>{selected.name}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                    <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gold)' }}><Mail size={13} />{selected.email}</a>
                    {selected.phone && <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-600)' }}><Phone size={13} />{selected.phone}</a>}
                  </div>
                </div>

                {selected.propertyTitle && (
                  <div style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--gray-50)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--midnight)' }}>
                    <Building2 size={14} style={{ color: 'var(--gold)' }} />
                    <span style={{ fontWeight: 500 }}>{selected.propertyTitle}</span>
                    <span style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>— {selected.type}</span>
                  </div>
                )}

                {selected.preferredDate && (
                  <div style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--gray-50)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--midnight)' }}>
                    <Calendar size={14} style={{ color: 'var(--gold)' }} />
                    Preferred Tour: {formatDate(selected.preferredDate)} {selected.preferredTime && `(${selected.preferredTime})`}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-2)' }}>Message</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.7, padding: 'var(--s-4)', background: 'var(--gray-50)', borderRadius: 'var(--r-lg)' }}>{selected.message}</p>
                </div>

                {/* Status */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-2)' }}>Update Status</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
                    {['read', 'contacted', 'resolved', 'archived'].map(s => (
                      <button key={s} onClick={() => handleUpdate('status', s)}
                        style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--r-full)', border: '1px solid', borderColor: selected.status === s ? 'var(--midnight)' : 'var(--gray-200)', background: selected.status === s ? 'var(--midnight)' : 'var(--white)', color: selected.status === s ? 'var(--white)' : 'var(--gray-600)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all var(--t-fast)', textTransform: 'capitalize' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 'var(--s-2)' }}>Admin Notes</div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="form-input"
                    style={{ minHeight: 80, fontSize: '0.875rem' }}
                    placeholder="Add internal notes..."
                  />
                  <button onClick={() => handleUpdate('adminNotes', notes)} disabled={updating}
                    style={{ marginTop: 'var(--s-2)', padding: '0.5rem 1rem', background: 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
                    Save Notes
                  </button>
                </div>

                {/* Delete */}
                <button onClick={() => handleDelete(selected._id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s-2)', padding: 'var(--s-3)', border: '1px solid #FEE2E2', borderRadius: 'var(--r-lg)', background: '#FEF2F2', color: 'var(--error)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                  <Trash2 size={14} /> Delete Inquiry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .inquiries-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
