import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, Save, Star } from 'lucide-react';
import { propertiesApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const AMENITY_OPTIONS = [
  'In-Unit Washer/Dryer', 'Dishwasher', 'Air Conditioning', 'Central Heat', 'Hardwood Floors',
  'Carpet', 'Stainless Appliances', 'Granite Countertops', 'Quartz Countertops',
  'Walk-In Closet', 'Private Balcony', 'Private Terrace', 'City Views', 'Smart Home System',
  'Fireplace', 'High Ceilings', 'Exposed Brick', 'Chef\'s Kitchen', 'Wine Cooler', 'Soaking Tub',
];

const BUILDING_AMENITY_OPTIONS = [
  '24/7 Concierge', 'Doorman', 'Rooftop Pool', 'Fitness Center', 'Business Center',
  'Resident Lounge', 'Rooftop Terrace', 'Bike Storage', 'Package Room', 'Dry Cleaning',
  'Valet Parking', 'EV Charging', 'Dog Wash Station', 'Elevator', 'Secure Entry',
];

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      isAvailable: true, isFeatured: false, leaseTerm: 12, applicationFee: 50, parkingAvailable: false, bedrooms: 1, bathrooms: 1,
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedBuildingAmenities, setSelectedBuildingAmenities] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    propertiesApi.getById(id)
      .then(res => {
        const p = res.data.data;
        reset({ ...p, availableDate: p.availableDate?.split('T')[0] });
        setExistingImages(p.images || []);
        setSelectedAmenities(p.amenities || []);
        setSelectedBuildingAmenities(p.buildingAmenities || []);
      })
      .catch(() => navigate('/admin/properties'))
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const removeExistingImage = (i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  const toggleAmenity = (a, list, setList) => {
    setList(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      const fields = ['title', 'description', 'type', 'bedrooms', 'bathrooms', 'sqft', 'floor', 'totalFloors',
        'monthlyRent', 'deposit', 'applicationFee', 'leaseTerm', 'availableDate', 'neighborhood',
        'isAvailable', 'isFeatured', 'parkingAvailable', 'parkingFee', 'virtualTourUrl'];

      fields.forEach(f => { if (data[f] !== undefined) formData.append(f, data[f]); });

      if (data.address) {
        Object.entries(data.address).forEach(([k, v]) => { if (v) formData.append(`address[${k}]`, v); });
      }

      formData.append('amenities', JSON.stringify(selectedAmenities));
      formData.append('buildingAmenities', JSON.stringify(selectedBuildingAmenities));

      const petPolicy = {
        allowed: data.petAllowed || false,
        deposit: data.petDeposit || 0,
        monthlyFee: data.petMonthlyFee || 0,
        restrictions: data.petRestrictions || '',
      };
      formData.append('petPolicy', JSON.stringify(petPolicy));

      if (isEdit) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      images.forEach(file => formData.append('images', file));

      if (isEdit) {
        await propertiesApi.update(id, formData);
        toast('Property updated successfully', 'success');
      } else {
        await propertiesApi.create(formData);
        toast('Property created successfully', 'success');
      }

      navigate('/admin/properties');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to save property', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
        {[300, 200, 250, 200].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 'var(--r-2xl)' }} />)}
      </div>
    );
  }

  const isFeatured = watch('isFeatured');
  const isAvailable = watch('isAvailable');

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', marginBottom: 'var(--s-6)' }}>
        <button onClick={() => navigate('/admin/properties')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', background: 'var(--white)', cursor: 'pointer', color: 'var(--gray-600)' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ marginBottom: 0 }}>{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>

        {/* Basic Info */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: 'var(--s-5)', paddingBottom: 'var(--s-3)', borderBottom: '1px solid var(--gray-100)' }}>Basic Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input className={`form-input ${errors.title ? 'error' : ''}`} placeholder="e.g. The Hamilton — Two Bedroom" {...register('title', { required: 'Title required' })} />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input" style={{ minHeight: 140 }} placeholder="Detailed description of the property..." {...register('description', { required: 'Description required' })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-4)' }} className="form-row-3">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-input" {...register('type', { required: true })}>
                  <option value="">Select type...</option>
                  {['studio', '1br', '2br', '3br', 'penthouse', 'loft', 'townhouse'].map(t => (
                    <option key={t} value={t}>{t === 'studio' ? 'Studio' : t === '1br' ? '1 Bedroom' : t === '2br' ? '2 Bedrooms' : t === '3br' ? '3 Bedrooms' : t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bedrooms *</label>
                <input type="number" min={0} max={10} className="form-input" {...register('bedrooms', { required: true, valueAsNumber: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms *</label>
                <input type="number" min={1} max={10} step={0.5} className="form-input" {...register('bathrooms', { required: true, valueAsNumber: true })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-4)' }} className="form-row-3">
              <div className="form-group">
                <label className="form-label">Square Feet *</label>
                <input type="number" className="form-input" placeholder="1250" {...register('sqft', { required: true, valueAsNumber: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Floor</label>
                <input type="number" className="form-input" {...register('floor', { valueAsNumber: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Floors</label>
                <input type="number" className="form-input" {...register('totalFloors', { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: 'var(--s-5)', paddingBottom: 'var(--s-3)', borderBottom: '1px solid var(--gray-100)' }}>Pricing & Availability</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-4)' }} className="form-row-3">
            <div className="form-group">
              <label className="form-label">Monthly Rent ($) *</label>
              <input type="number" className="form-input" placeholder="3200" {...register('monthlyRent', { required: true, valueAsNumber: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit ($)</label>
              <input type="number" className="form-input" {...register('deposit', { valueAsNumber: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Application Fee ($)</label>
              <input type="number" className="form-input" {...register('applicationFee', { valueAsNumber: true })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-4)', marginTop: 'var(--s-4)' }} className="form-row-3">
            <div className="form-group">
              <label className="form-label">Available Date *</label>
              <input type="date" className="form-input" {...register('availableDate', { required: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Lease Term (months)</label>
              <input type="number" className="form-input" {...register('leaseTerm', { valueAsNumber: true })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', paddingTop: 'var(--s-2)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" {...register('isAvailable')} style={{ accentColor: 'var(--success)' }} />
                  Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" {...register('isFeatured')} style={{ accentColor: 'var(--gold)' }} />
                  <Star size={14} fill={isFeatured ? '#C9A84C' : 'none'} stroke="#C9A84C" />
                  Featured
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: 'var(--s-5)', paddingBottom: 'var(--s-3)', borderBottom: '1px solid var(--gray-100)' }}>Address & Location</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--s-4)' }}>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input className="form-input" placeholder="1100 Connecticut Ave NW" {...register('address.street', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <input className="form-input" placeholder="Apt 4B" {...register('address.unit')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--s-4)' }} className="form-row-4">
              <div className="form-group">
                <label className="form-label">Neighborhood *</label>
                <input className="form-input" placeholder="Dupont Circle" {...register('neighborhood', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" {...register('address.city', { required: true })} defaultValue="Washington" />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input className="form-input" {...register('address.state', { required: true })} defaultValue="DC" />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP *</label>
                <input className="form-input" {...register('address.zip', { required: true })} />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: 'var(--s-5)', paddingBottom: 'var(--s-3)', borderBottom: '1px solid var(--gray-100)' }}>Amenities</h4>
          <div style={{ marginBottom: 'var(--s-5)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: 'var(--s-3)' }}>Unit Amenities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
              {AMENITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a, selectedAmenities, setSelectedAmenities)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--r-full)', fontSize: '0.8125rem', fontWeight: 500, border: '1.5px solid', borderColor: selectedAmenities.includes(a) ? 'var(--gold)' : 'var(--gray-200)', background: selectedAmenities.includes(a) ? 'var(--gold-pale)' : 'var(--white)', color: selectedAmenities.includes(a) ? 'var(--gold-dark)' : 'var(--gray-600)', cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: 'var(--s-3)' }}>Building Amenities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
              {BUILDING_AMENITY_OPTIONS.map(a => (
                <button key={a} type="button" onClick={() => toggleAmenity(a, selectedBuildingAmenities, setSelectedBuildingAmenities)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--r-full)', fontSize: '0.8125rem', fontWeight: 500, border: '1.5px solid', borderColor: selectedBuildingAmenities.includes(a) ? 'var(--navy)' : 'var(--gray-200)', background: selectedBuildingAmenities.includes(a) ? 'rgba(21,34,56,0.08)' : 'var(--white)', color: selectedBuildingAmenities.includes(a) ? 'var(--navy)' : 'var(--gray-600)', cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-6)', border: '1px solid var(--gray-200)' }}>
          <h4 style={{ marginBottom: 'var(--s-5)', paddingBottom: 'var(--s-3)', borderBottom: '1px solid var(--gray-100)' }}>Property Images</h4>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: 'var(--s-4)' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: 'var(--s-3)' }}>Existing Images</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
                {existingImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: 100, height: 72, borderRadius: 'var(--r-md)', overflow: 'hidden', border: `2px solid ${img.isPrimary ? 'var(--gold)' : 'var(--gray-200)'}` }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeExistingImage(i)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload */}
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--s-8)', border: '2px dashed var(--gray-200)', borderRadius: 'var(--r-xl)', cursor: 'pointer', background: 'var(--gray-50)', transition: 'all var(--t-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-pale)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'var(--gray-50)'; }}>
            <Upload size={24} style={{ color: 'var(--gold)', marginBottom: 'var(--s-2)' }} />
            <div style={{ fontWeight: 600, color: 'var(--midnight)', marginBottom: 4 }}>Click to upload images</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>JPG, PNG, WebP — up to 10MB each</div>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </label>

          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-3)', marginTop: 'var(--s-4)' }}>
              {images.map((file, i) => (
                <div key={i} style={{ position: 'relative', width: 100, height: 72, borderRadius: 'var(--r-md)', overflow: 'hidden', border: '2px solid var(--gray-200)' }}>
                  <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeNewImage(i)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={10} />
                  </button>
                  {i === 0 && existingImages.length === 0 && <div style={{ position: 'absolute', bottom: 2, left: 2, fontSize: '0.5rem', fontWeight: 700, color: 'white', background: 'var(--gold)', padding: '0 4px', borderRadius: 2 }}>PRIMARY</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: 'var(--s-3)', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/admin/properties')} style={{ padding: '0.75rem 2rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--r-full)', background: 'var(--white)', fontWeight: 500, fontSize: '0.9375rem', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: '0.75rem 2rem', background: loading ? 'var(--gray-300)' : 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontWeight: 700, fontSize: '0.9375rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all var(--t-fast)' }}
          >
            {loading ? 'Saving...' : <><Save size={16} /> {isEdit ? 'Update Property' : 'Create Property'}</>}
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 640px) {
          .form-row-3 { grid-template-columns: 1fr !important; }
          .form-row-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
