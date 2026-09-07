import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { propertiesApi } from '../../utils/api';
import PropertyCard from '../property/PropertyCard';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertiesApi.getFeatured()
      .then(res => setProperties(res.data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section" style={{ background: 'var(--cream)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--s-12)', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
          <div>
            <div className="section-label"><span>Featured Residences</span></div>
            <h2 style={{ maxWidth: 480 }}>
              Handpicked For
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}> Discerning</span> Renters
            </h2>
          </div>
          <Link
            to="/apartments"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
              padding: '0.625rem 1.5rem',
              border: '1.5px solid var(--midnight)',
              borderRadius: 'var(--r-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--midnight)',
              transition: 'all var(--t-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--midnight)'; e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--midnight)'; }}
          >
            View All Listings <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--s-6)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '3/2' }} />
                <div style={{ padding: 'var(--s-5)', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                  <div className="skeleton" style={{ height: 24, width: '80%' }} />
                  <div className="skeleton" style={{ height: 14, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--s-16) 0', color: 'var(--gray-500)' }}>
            <p>No featured properties at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--s-6)' }}>
            {properties.map((property, i) => (
              <PropertyCard key={property._id} property={property} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
