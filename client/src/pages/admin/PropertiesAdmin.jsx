import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, Eye, Search } from 'lucide-react';
import { propertiesApi } from '../../utils/api';
import { formatCurrency, propertyTypeLabel, getPrimaryImage } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function PropertiesAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await propertiesApi.getAll({ ...params, limit: 50 });
      setProperties(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (val) => {
    setSearch(val);
    if (val.length > 1) load({ search: val });
    else if (val.length === 0) load();
  };

  const handleDelete = async (id) => {
    try {
      await propertiesApi.delete(id);
      toast('Property deleted successfully', 'success');
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch {
      toast('Failed to delete property', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s-6)', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
        <div>
          <h2 style={{ marginBottom: 'var(--s-1)' }}>Properties</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{properties.length} total properties</p>
        </div>
        <button
          onClick={() => navigate('/admin/properties/new')}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: '0.625rem 1.25rem', background: 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all var(--t-fast)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--navy-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--midnight)'}
        >
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 'var(--s-5)', maxWidth: 400 }}>
        <Search size={15} style={{ position: 'absolute', left: 'var(--s-4)', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="form-input"
          style={{ paddingLeft: 'calc(var(--s-4) + 20px)' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
                {['Property', 'Type', 'Rent', 'Status', 'Views', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: 'var(--s-3) var(--s-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} style={{ padding: 'var(--s-4) var(--s-5)' }}>
                        <div className="skeleton" style={{ height: 14, width: j === 0 ? 200 : 60 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : properties.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
                      <img src={getPrimaryImage(p.images)} alt="" style={{ width: 52, height: 40, borderRadius: 'var(--r-md)', objectFit: 'cover', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--midnight)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{p.neighborhood}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--gray-700)' }}>{propertyTypeLabel(p.type)}</span>
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--midnight)' }}>{formatCurrency(p.monthlyRent)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>/mo</span>
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: 'var(--r-full)',
                      fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                      background: p.isAvailable ? '#EBF8F0' : 'var(--gray-100)',
                      color: p.isAvailable ? '#22A06B' : 'var(--gray-500)',
                    }}>
                      {p.isAvailable ? 'Available' : 'Rented'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      <Eye size={13} /> {p.viewCount || 0}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <Star size={16} fill={p.isFeatured ? '#C9A84C' : 'none'} stroke={p.isFeatured ? '#C9A84C' : 'var(--gray-300)'} />
                  </td>
                  <td style={{ padding: 'var(--s-4) var(--s-5)' }}>
                    <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
                      <button
                        onClick={() => navigate(`/admin/properties/${p._id}/edit`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.375rem 0.75rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', background: 'var(--white)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-600)', cursor: 'pointer', transition: 'all var(--t-fast)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--midnight)'; e.currentTarget.style.color = 'var(--midnight)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-600)'; }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0.375rem 0.75rem', border: '1px solid transparent', borderRadius: 'var(--r-md)', background: '#FEF2F2', fontSize: '0.75rem', fontWeight: 500, color: 'var(--error)', cursor: 'pointer', transition: 'all var(--t-fast)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E5483B'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = 'var(--error)'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && properties.length === 0 && (
          <div style={{ padding: 'var(--s-12)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--gray-300)', marginBottom: 'var(--s-4)' }}>No Properties</div>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--s-5)' }}>Add your first property to get started.</p>
            <button onClick={() => navigate('/admin/properties/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)', padding: '0.625rem 1.5rem', background: 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={16} /> Add Property
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s-4)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)', margin: '0 auto var(--s-4)' }}>
              <Trash2 size={22} />
            </div>
            <h3 style={{ marginBottom: 'var(--s-2)' }}>Delete Property?</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: 'var(--s-6)' }}>This action cannot be undone. All associated images will also be deleted.</p>
            <div style={{ display: 'flex', gap: 'var(--s-3)', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '0.625rem 1.5rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--r-full)', background: 'var(--white)', fontWeight: 500, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '0.625rem 1.5rem', border: 'none', borderRadius: 'var(--r-full)', background: 'var(--error)', color: 'var(--white)', fontWeight: 600, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
