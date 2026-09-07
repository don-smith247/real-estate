import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import { propertiesApi } from '../utils/api';

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchProperties = useCallback(async (filters = {}, page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const res = await propertiesApi.getAll(params);
      setProperties(res.data.data || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = {};
    if (searchParams.get('search')) initial.search = searchParams.get('search');
    if (searchParams.get('type')) initial.type = searchParams.get('type');
    setCurrentFilters(initial);
    fetchProperties(initial);
  }, []);

  const handleFilter = useCallback((filters) => {
    setCurrentFilters(filters);
    fetchProperties(filters, 1);
  }, [fetchProperties]);

  const handlePage = (page) => {
    fetchProperties(currentFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Page Header */}
      <div style={{ paddingTop: 'var(--header-h)', borderBottom: '1px solid #EEEEEE' }}>
        <div className="container" style={{ padding: '32px var(--s-6) 0' }}>
          <h1 style={{ marginBottom: '4px', color: '#222', letterSpacing: '-0.025em' }}>
            Apartments in Washington DC
          </h1>
          <p style={{ color: '#717171', fontSize: '1rem', marginBottom: '24px' }}>
            Premium long-term rentals across DC's most coveted neighborhoods
          </p>
        </div>
      </div>

      {/* Content */}
      <section style={{ background: '#FFFFFF', padding: '32px 0 80px' }}>
        <div className="container">
          <PropertyFilters
            onFilter={handleFilter}
            total={pagination.total}
            loading={loading}
          />

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i}>
                  <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: '12px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '15px', width: '65%', marginBottom: '8px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ height: '13px', width: '45%', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#DDDDDD" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="10" r="3" stroke="#DDDDDD" strokeWidth="2" />
                </svg>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', marginBottom: '8px' }}>No homes found</p>
              <p style={{ color: '#717171', marginBottom: '24px' }}>Try adjusting your filters or search terms.</p>
              <button
                onClick={() => handleFilter({})}
                style={{
                  padding: '12px 28px',
                  background: '#222', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <PropertyCard property={property} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && !loading && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '56px' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePage(page)}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: page === pagination.page ? '#222' : '#DDDDDD',
                    background: page === pagination.page ? '#222' : '#fff',
                    color: page === pagination.page ? '#fff' : '#222',
                    fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
