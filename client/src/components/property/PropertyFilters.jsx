import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { debounce } from '../../utils/helpers';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 Bed' },
  { value: '2br', label: '2 Beds' },
  { value: '3br', label: '3 Beds' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'loft', label: 'Loft' },
];

const PRICE_RANGES = [
  { value: '', label: 'Any price' },
  { value: '0-2000', label: 'Under $2,000' },
  { value: '2000-3000', label: '$2,000 – $3,000' },
  { value: '3000-5000', label: '$3,000 – $5,000' },
  { value: '5000-999999', label: '$5,000+' },
];

const SORT = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'monthlyRent', label: 'Price: Low to High' },
  { value: '-monthlyRent', label: 'Price: High to Low' },
  { value: '-viewCount', label: 'Most Viewed' },
];

export default function PropertyFilters({ onFilter, total, loading }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [petPolicy, setPetPolicy] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const buildParams = (overrides = {}) => {
    const params = { sort };
    if (search.trim()) params.search = search.trim();
    if (type) params.type = type;
    if (petPolicy) params.petPolicy = 'true';
    if (price) {
      const [min, max] = price.split('-');
      if (min && Number(min) > 0) params.minRent = min;
      if (max && Number(max) < 999999) params.maxRent = max;
    }
    return { ...params, ...overrides };
  };

  useEffect(() => { onFilter(buildParams()); }, [type, price, sort, petPolicy]);

  const debouncedSearch = debounce((val) => {
    onFilter(buildParams({ search: val.trim() || undefined }));
  }, 350);

  const hasFilters = type || price || petPolicy || search;

  const clearAll = () => {
    setSearch(''); setType(''); setPrice('');
    setPetPolicy(false); setSort('-createdAt');
    onFilter({});
  };

  return (
    <div style={{ marginBottom: 'var(--s-6)' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {/* Search */}
        <div style={{
          flex: 1, minWidth: 220,
          display: 'flex', alignItems: 'center', gap: '10px',
          border: '1px solid #DDDDDD', borderRadius: '12px',
          padding: '10px 16px',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <Search size={15} style={{ color: '#717171', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by neighborhood or keyword..."
            value={search}
            onChange={e => { setSearch(e.target.value); debouncedSearch(e.target.value); }}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: '0.9375rem', fontFamily: 'inherit', color: '#222',
            }}
          />
          {search && (
            <button onClick={() => { setSearch(''); debouncedSearch(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171', display: 'flex', padding: 2 }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', flexShrink: 0 }} className="type-pills">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              style={{
                padding: '9px 18px', borderRadius: '40px',
                border: '1px solid', flexShrink: 0,
                borderColor: type === t.value ? '#222' : '#DDDDDD',
                background: type === t.value ? '#222' : '#fff',
                color: type === t.value ? '#fff' : '#222',
                fontSize: '0.875rem', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters button */}
        <button
          onClick={() => setShowModal(!showModal)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '12px',
            border: `1px solid ${hasFilters ? '#222' : '#DDDDDD'}`,
            background: hasFilters ? '#222' : '#fff',
            color: hasFilters ? '#fff' : '#222',
            fontSize: '0.875rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {hasFilters && !type && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF385C', display: 'inline-block' }} />
          )}
        </button>

        {hasFilters && (
          <button onClick={clearAll} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '9px 12px', background: 'none', border: 'none',
            color: '#717171', fontSize: '0.875rem', cursor: 'pointer',
            textDecoration: 'underline', flexShrink: 0,
          }}>
            Clear all
          </button>
        )}
      </div>

      {/* Advanced Filters Dropdown */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#fff', border: '1px solid #DDDDDD',
              borderRadius: '16px', padding: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              marginBottom: '16px',
              display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end',
            }}
          >
            {/* Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#222', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Price Range
              </label>
              <select
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="form-input"
                style={{ minWidth: 200, borderRadius: '8px', borderColor: '#DDDDDD' }}
              >
                {PRICE_RANGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#222', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sort By
              </label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="form-input"
                style={{ minWidth: 200, borderRadius: '8px', borderColor: '#DDDDDD' }}
              >
                {SORT.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Pets */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#222', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pet Policy
              </label>
              <button
                onClick={() => setPetPolicy(!petPolicy)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', borderRadius: '8px',
                  border: `1px solid ${petPolicy ? '#222' : '#DDDDDD'}`,
                  background: petPolicy ? '#222' : '#fff',
                  color: petPolicy ? '#fff' : '#222',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Pets welcome
              </button>
            </div>

            <button onClick={() => setShowModal(false)} style={{
              marginLeft: 'auto', padding: '10px 20px',
              background: '#222', color: '#fff', border: 'none',
              borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            }}>
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p style={{ fontSize: '0.875rem', color: '#717171' }}>
        {loading ? 'Searching...' : total !== undefined ? `${total.toLocaleString()} ${total === 1 ? 'home' : 'homes'} available` : ''}
      </p>
    </div>
  );
}
