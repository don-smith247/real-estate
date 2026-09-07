import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bed, Bath, Maximize2, MapPin, Calendar, DollarSign,
  CheckCircle, ArrowLeft, Phone, Mail, ChevronRight, Car,
  Shield, Star, Clock, Tag,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ImageGallery from '../components/property/ImageGallery';
import PropertyCard from '../components/property/PropertyCard';
import InquiryForm from '../components/forms/InquiryForm';
import { propertiesApi } from '../utils/api';
import { formatCurrency, formatDate, formatAvailability, propertyTypeLabel } from '../utils/helpers';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    propertiesApi.getById(id)
      .then(res => {
        setProperty(res.data.data);
        setSimilar(res.data.similar || []);
      })
      .catch(() => navigate('/apartments'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh', background: 'var(--cream)' }}>
          <div className="container" style={{ paddingTop: 'var(--s-8)' }}>
            <div className="skeleton" style={{ height: 480, borderRadius: 'var(--r-2xl)', marginBottom: 'var(--s-8)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--s-8)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                {[200, 100, 150, 300].map((h, i) => (
                  <div key={i} className="skeleton" style={{ height: h, borderRadius: 'var(--r-xl)' }} />
                ))}
              </div>
              <div className="skeleton" style={{ height: 400, borderRadius: 'var(--r-xl)' }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!property) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />

      <div style={{ paddingTop: 'var(--header-h)', background: 'var(--cream)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingTop: 'var(--s-6)', paddingBottom: 'var(--s-20)' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', marginBottom: 'var(--s-5)', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
            <Link to="/" style={{ color: 'var(--gray-500)' }}>Home</Link>
            <ChevronRight size={12} />
            <Link to="/apartments" style={{ color: 'var(--gray-500)' }}>Apartments</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--midnight)', fontWeight: 500 }}>{property.title}</span>
          </nav>

          {/* Gallery */}
          <div style={{ marginBottom: 'var(--s-8)' }}>
            <ImageGallery images={property.images} title={property.title} />
          </div>

          {/* Main Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--s-8)', alignItems: 'start' }}
            className="detail-layout">

            {/* LEFT COLUMN */}
            <div>
              {/* Title Area */}
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', marginBottom: 'var(--s-5)', border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', marginBottom: 'var(--s-3)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', padding: '0.25rem 0.625rem', background: 'var(--gold-pale)', borderRadius: 'var(--r-full)' }}>
                    {propertyTypeLabel(property.type)}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: property.isAvailable ? 'var(--success)' : 'var(--gray-500)', padding: '0.25rem 0.625rem', background: property.isAvailable ? '#EBF8F0' : 'var(--gray-100)', borderRadius: 'var(--r-full)' }}>
                    {property.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  {property.isFeatured && (
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gold)', padding: '0.25rem 0.625rem', background: 'var(--gold-pale)', borderRadius: 'var(--r-full)', border: '1px solid var(--gold-light)' }}>
                      Featured
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: 'var(--s-2)' }}>{property.title}</h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 'var(--s-5)' }}>
                  <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  {property.address?.street}{property.address?.unit ? `, ${property.address.unit}` : ''}, {property.address?.city}, {property.address?.state} {property.address?.zip}
                </div>

                {/* Stats Strip */}
                <div style={{ display: 'flex', gap: 'var(--s-6)', padding: 'var(--s-4) 0', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', flexWrap: 'wrap' }}>
                  {[
                    { icon: Bed, label: property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bedroom${property.bedrooms > 1 ? 's' : ''}` },
                    { icon: Bath, label: `${property.bathrooms} Bathroom${property.bathrooms > 1 ? 's' : ''}` },
                    { icon: Maximize2, label: `${property.sqft?.toLocaleString()} sq ft` },
                    ...(property.floor ? [{ icon: Star, label: `Floor ${property.floor} of ${property.totalFloors || '?'}` }] : []),
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--midnight)' }}>
                      <Icon size={16} style={{ color: 'var(--gold)' }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', marginBottom: 'var(--s-5)', border: '1px solid var(--gray-200)' }}>
                <h3 style={{ marginBottom: 'var(--s-4)' }}>About This Residence</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', lineHeight: 1.8 }}>{property.description}</p>
              </div>

              {/* Unit Amenities */}
              {property.amenities?.length > 0 && (
                <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', marginBottom: 'var(--s-5)', border: '1px solid var(--gray-200)' }}>
                  <h3 style={{ marginBottom: 'var(--s-5)' }}>Unit Amenities</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--s-3)' }}>
                    {property.amenities.map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                        <CheckCircle size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Building Amenities */}
              {property.buildingAmenities?.length > 0 && (
                <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', marginBottom: 'var(--s-5)', border: '1px solid var(--gray-200)' }}>
                  <h3 style={{ marginBottom: 'var(--s-5)' }}>Building Amenities</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--s-3)' }}>
                    {property.buildingAmenities.map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                        <Shield size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rental Details */}
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', marginBottom: 'var(--s-5)', border: '1px solid var(--gray-200)' }}>
                <h3 style={{ marginBottom: 'var(--s-5)' }}>Rental Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--s-4)' }}>
                  {[
                    { label: 'Monthly Rent', value: formatCurrency(property.monthlyRent) },
                    { label: 'Security Deposit', value: property.deposit ? formatCurrency(property.deposit) : 'Contact Us' },
                    { label: 'Application Fee', value: formatCurrency(property.applicationFee || 50) },
                    { label: 'Lease Term', value: `${property.leaseTerm || 12} months` },
                    { label: 'Available', value: formatAvailability(property.availableDate) },
                    { label: 'Neighborhood', value: property.neighborhood },
                    ...(property.parkingAvailable ? [{ label: 'Parking', value: property.parkingFee ? `${formatCurrency(property.parkingFee)}/mo` : 'Available' }] : []),
                    ...(property.utilitiesIncluded?.length > 0 ? [{ label: 'Utilities Included', value: property.utilitiesIncluded.join(', ') }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--cream)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-100)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--s-1)' }}>{label}</div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--midnight)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pet Policy */}
              <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', border: '1px solid var(--gray-200)' }}>
                <h3 style={{ marginBottom: 'var(--s-4)' }}>Pet Policy</h3>
                {property.petPolicy?.allowed ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', marginBottom: 'var(--s-4)', color: 'var(--success)', fontWeight: 600 }}>
                      <CheckCircle size={16} />
                      Pets Welcome
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {property.petPolicy.types?.length > 0 && <p>Allowed: {property.petPolicy.types.join(', ')}</p>}
                      {property.petPolicy.deposit && <p>Pet Deposit: {formatCurrency(property.petPolicy.deposit)}</p>}
                      {property.petPolicy.monthlyFee && <p>Monthly Pet Fee: {formatCurrency(property.petPolicy.monthlyFee)}</p>}
                      {property.petPolicy.restrictions && <p>Restrictions: {property.petPolicy.restrictions}</p>}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>No pets allowed in this unit. Contact us to inquire about alternatives.</p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN — Sticky Sidebar */}
            <div style={{ position: 'sticky', top: 'calc(var(--header-h) + var(--s-6))' }}>
              {/* Price Card */}
              <div style={{
                background: 'var(--midnight)',
                borderRadius: 'var(--r-2xl)',
                padding: 'var(--s-8)',
                marginBottom: 'var(--s-4)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ marginBottom: 'var(--s-5)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--white)', lineHeight: 1 }}>
                    {formatCurrency(property.monthlyRent)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginTop: 'var(--s-1)' }}>per month</div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--s-3)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--s-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} style={{ color: 'var(--gold)' }} />
                    {formatAvailability(property.availableDate)}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
                  <Link
                    to={`/apply/${property._id}`}
                    style={{
                      display: 'block', textAlign: 'center',
                      padding: 'var(--s-4)',
                      background: 'var(--gold)',
                      color: 'var(--midnight)',
                      borderRadius: 'var(--r-xl)',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      letterSpacing: '0.02em',
                      transition: 'all var(--t-fast)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.transform = ''; }}
                  >
                    Apply Now
                  </Link>
                  <button
                    onClick={() => setShowInquiry(true)}
                    style={{
                      padding: 'var(--s-4)',
                      background: 'transparent',
                      color: 'var(--white)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      borderRadius: 'var(--r-xl)',
                      fontWeight: 500,
                      fontSize: '0.9375rem',
                      cursor: 'pointer',
                      transition: 'all var(--t-fast)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--white)'; }}
                  >
                    Schedule a Tour
                  </button>
                </div>

                <div style={{ marginTop: 'var(--s-5)', paddingTop: 'var(--s-5)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a href="tel:+12025550100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s-2)', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Phone size={14} /> (202) 555-0100
                  </a>
                </div>
              </div>

              {/* Inquiry Form Inline */}
              {showInquiry && (
                <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
                  <div style={{ padding: 'var(--s-5) var(--s-6)', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Schedule a Tour</h4>
                    <button onClick={() => setShowInquiry(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: 'var(--s-6)' }}>
                    <InquiryForm propertyId={property._id} propertyTitle={property.title} type="tour" onSuccess={() => setShowInquiry(false)} compact />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div style={{ marginTop: 'var(--s-16)' }}>
              <div style={{ marginBottom: 'var(--s-8)' }}>
                <div className="section-label"><span>More Like This</span></div>
                <h2>Similar Properties</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--s-6)' }}>
                {similar.map((p, i) => (
                  <PropertyCard key={p._id} property={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 1024px) {
          .detail-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
