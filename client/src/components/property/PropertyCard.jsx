import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { formatCurrency, propertyTypeLabel } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function PropertyCard({ property, index = 0 }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated, isSaved, saveProperty, unsaveProperty } = useAuth();
  const navigate = useNavigate();

  const images = property.images || [];
  const primaryImg = images.find(i => i.isPrimary)?.url || images[0]?.url;
  const bedsLabel = property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed${property.bedrooms > 1 ? 's' : ''}`;
  const saved = isSaved(property._id);

  const handleHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (saving) return;
    setSaving(true);
    try {
      if (saved) {
        await unsaveProperty(property._id);
      } else {
        await saveProperty(property._id);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to={`/apartments/${property._id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '1 / 1',
          background: '#F0F0F0',
          marginBottom: '12px',
        }}>
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
          {primaryImg && (
            <img
              src={primaryImg}
              alt={property.title}
              loading="lazy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.4s ease',
                opacity: imgLoaded ? 1 : 0,
              }}
              onLoad={() => setImgLoaded(true)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            />
          )}

          {/* Heart wishlist */}
          <button
            onClick={handleHeart}
            disabled={saving}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'none', border: 'none', cursor: saving ? 'default' : 'pointer',
              padding: '4px', lineHeight: 0,
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))',
              opacity: saving ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
            aria-label={saved ? 'Remove from saved' : 'Save to wishlist'}
          >
            <Heart
              size={22}
              fill={saved ? '#FF385C' : 'rgba(0,0,0,0.4)'}
              stroke={saved ? '#FF385C' : 'white'}
              strokeWidth={1.5}
            />
          </button>

          {/* Featured badge */}
          {property.isFeatured && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'white', borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.6875rem', fontWeight: 700, color: '#222',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}>
              Guest favorite
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '2px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#222', lineHeight: 1.3, flex: 1 }}>
              {property.neighborhood ? `${property.neighborhood}, Washington DC` : property.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
              <Star size={12} fill="#222" stroke="none" />
              <span style={{ fontSize: '0.875rem', color: '#222', fontWeight: 500 }}>4.9</span>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#717171', marginBottom: '2px' }}>
            {propertyTypeLabel(property.type)} · {bedsLabel} · {property.bathrooms} bath
          </div>

          <div style={{ fontSize: '0.875rem', color: '#717171', marginBottom: '6px' }}>
            {property.isAvailable ? 'Available now' : 'Check availability'}
          </div>

          <div style={{ fontSize: '0.9375rem', color: '#222' }}>
            <span style={{ fontWeight: 600 }}>{formatCurrency(property.monthlyRent)}</span>
            <span style={{ color: '#717171', fontWeight: 400 }}> / month</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
