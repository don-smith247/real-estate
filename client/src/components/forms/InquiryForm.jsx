import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle } from 'lucide-react';
import { inquiriesApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const INQUIRY_TYPES = [
  { value: 'tour', label: 'Schedule a Tour' },
  { value: 'pricing', label: 'Pricing & Availability' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'application', label: 'Application Help' },
];

export default function InquiryForm({ propertyId, propertyTitle, type = 'general', onSuccess, compact = false }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { type } });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await inquiriesApi.create({ ...data, propertyId });
      setSubmitted(true);
      reset();
      toast('Your inquiry was sent. We\'ll be in touch soon!', 'success');
      if (onSuccess) setTimeout(onSuccess, 2000);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to send inquiry. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: compact ? 'var(--s-6)' : 'var(--s-10)' }}>
        <div style={{ width: 56, height: 56, margin: '0 auto var(--s-4)', borderRadius: '50%', background: '#EBF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22A06B' }}>
          <CheckCircle size={24} />
        </div>
        <h4 style={{ marginBottom: 'var(--s-2)', color: 'var(--midnight)' }}>Message Received!</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>
          We'll reach out within 1 business day.
          {propertyTitle && ` Our team will contact you regarding ${propertyTitle}.`}
        </p>
        <button onClick={() => setSubmitted(false)} style={{ marginTop: 'var(--s-4)', fontSize: '0.8125rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
      {propertyTitle && (
        <div style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderRadius: 'var(--r-lg)', fontSize: '0.8125rem', color: 'var(--gold-dark)', fontWeight: 500 }}>
          Re: {propertyTitle}
        </div>
      )}

      {/* Type Select */}
      {!compact && (
        <div className="form-group">
          <label className="form-label">Inquiry Type</label>
          <select className="form-input" {...register('type', { required: true })}>
            {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      )}

      {/* Name */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
        <div className="form-group">
          <label className="form-label">First Name *</label>
          <input className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Alexandra"
            {...register('name', { required: 'Name is required' })} />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input className="form-input" placeholder="Chen" {...register('lastName')} />
        </div>
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="you@example.com"
          {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
        />
        {errors.email && <span className="form-error">{errors.email.message}</span>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label className="form-label">Phone (Optional)</label>
        <input type="tel" className="form-input" placeholder="(202) 555-0100" {...register('phone')} />
      </div>

      {/* Tour Date (if tour type) */}
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
          <div className="form-group">
            <label className="form-label">Preferred Date</label>
            <input type="date" className="form-input" {...register('preferredDate')} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Time</label>
            <select className="form-input" {...register('preferredTime')}>
              <option value="">Any Time</option>
              <option value="morning">Morning (9am–12pm)</option>
              <option value="afternoon">Afternoon (12pm–5pm)</option>
              <option value="evening">Evening (5pm–7pm)</option>
            </select>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea
          className={`form-input ${errors.message ? 'error' : ''}`}
          placeholder={compact ? "Tell us when you'd like to visit and any questions..." : 'Tell us about your ideal apartment, move-in timeline, and any questions...'}
          style={{ minHeight: compact ? 80 : 120 }}
          {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message too short' } })}
        />
        {errors.message && <span className="form-error">{errors.message.message}</span>}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s-2)',
          padding: 'var(--s-4)',
          background: loading ? 'var(--gray-300)' : 'var(--midnight)',
          color: 'var(--white)',
          border: 'none',
          borderRadius: 'var(--r-xl)',
          fontWeight: 600,
          fontSize: '0.9375rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all var(--t-fast)',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--navy-light)'; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--midnight)'; }}
      >
        {loading ? (
          <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Sending...</>
        ) : (
          <><Send size={15} /> Send Message</>
        )}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'center' }}>
        We respond within 1 business day. No spam, ever.
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
