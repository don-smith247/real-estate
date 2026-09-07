import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { propertiesApi, applicationsApi } from '../utils/api';
import { formatCurrency, getPrimaryImage } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

const STEPS = ['Personal Info', 'Current Residence', 'Employment', 'References', 'Review'];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState('');

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm({
    defaultValues: { agreeToTerms: 'false', backgroundCheckConsent: false, creditCheckConsent: false, occupants: 1 },
  });

  useEffect(() => {
    propertiesApi.getById(id).then(res => setProperty(res.data.data)).catch(() => navigate('/apartments'));
  }, [id]);

  const nextStep = async () => {
    const fields = getStepFields(step);
    const valid = await trigger(fields);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const getStepFields = (s) => {
    switch (s) {
      case 0: return ['applicant.firstName', 'applicant.lastName', 'applicant.email', 'applicant.phone', 'applicant.dateOfBirth'];
      case 1: return ['currentAddress.street', 'currentAddress.city', 'currentAddress.state', 'currentAddress.zip'];
      case 2: return ['employment.employerName', 'employment.position', 'employment.monthlyIncome'];
      default: return [];
    }
  };

  const onSubmit = async (data) => {
    if (step < STEPS.length - 1) { nextStep(); return; }
    setLoading(true);
    try {
      const res = await applicationsApi.create({ ...data, propertyId: id, agreeToTerms: 'true' });
      setAppNumber(res.data.data?.applicationNumber || '');
      setSubmitted(true);
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s-8)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 560, width: '100%', background: 'var(--white)', borderRadius: 'var(--r-3xl)', padding: 'var(--s-12)', textAlign: 'center', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EBF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22A06B', margin: '0 auto var(--s-6)' }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ marginBottom: 'var(--s-3)' }}>Application Submitted!</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--s-4)', lineHeight: 1.7 }}>
              Thank you for your application. Our team will review it within 2–3 business days.
            </p>
            {appNumber && (
              <div style={{ padding: 'var(--s-4)', background: 'var(--cream)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-lg)', marginBottom: 'var(--s-6)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '4px', fontWeight: 500 }}>Your Application Number</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--midnight)' }}>{appNumber}</div>
              </div>
            )}
            <Link to="/apartments" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'var(--midnight)', color: 'var(--white)', borderRadius: 'var(--r-full)', fontWeight: 600, fontSize: '0.875rem' }}>
              Browse More Properties
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Navbar />

      <div style={{ paddingTop: 'var(--header-h)', background: 'var(--cream)', minHeight: '100vh', paddingBottom: 'var(--s-20)' }}>
        <div className="container" style={{ paddingTop: 'var(--s-8)', maxWidth: 860 }}>

          {/* Property Card */}
          {property && (
            <div style={{ background: 'var(--midnight)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-5) var(--s-6)', marginBottom: 'var(--s-6)', display: 'flex', alignItems: 'center', gap: 'var(--s-4)', flexWrap: 'wrap' }}>
              <img src={getPrimaryImage(property.images)} alt={property.title} style={{ width: 80, height: 60, borderRadius: 'var(--r-lg)', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--white)' }}>{property.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>{property.address?.street}, {property.neighborhood}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--gold)' }}>
                {formatCurrency(property.monthlyRent)}<span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>/mo</span>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--s-8)', background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-4) var(--s-6)', border: '1px solid var(--gray-200)', overflowX: 'auto' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', cursor: i < step ? 'pointer' : 'default' }} onClick={() => i < step && setStep(i)}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < step ? 'var(--success)' : i === step ? 'var(--midnight)' : 'var(--gray-100)',
                    color: i < step ? 'var(--white)' : i === step ? 'var(--white)' : 'var(--gray-400)',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, transition: 'all var(--t-fast)',
                  }}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--midnight)' : i < step ? 'var(--success)' : 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 32, height: 1, background: i < step ? 'var(--success)' : 'var(--gray-200)', margin: '0 var(--s-2)' }} />}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'var(--white)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)', border: '1px solid var(--gray-200)', marginBottom: 'var(--s-5)' }}
            >
              <h3 style={{ marginBottom: 'var(--s-6)' }}>{STEPS[step]}</h3>

              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }} className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input className={`form-input ${errors.applicant?.firstName ? 'error' : ''}`} {...register('applicant.firstName', { required: 'Required' })} />
                      {errors.applicant?.firstName && <span className="form-error">{errors.applicant.firstName.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input className={`form-input ${errors.applicant?.lastName ? 'error' : ''}`} {...register('applicant.lastName', { required: 'Required' })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }} className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className={`form-input ${errors.applicant?.email ? 'error' : ''}`} {...register('applicant.email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone *</label>
                      <input type="tel" className={`form-input ${errors.applicant?.phone ? 'error' : ''}`} {...register('applicant.phone', { required: 'Required' })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }} className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" className={`form-input ${errors.applicant?.dateOfBirth ? 'error' : ''}`} {...register('applicant.dateOfBirth', { required: 'Required' })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ID Type</label>
                      <select className="form-input" {...register('applicant.idType')}>
                        <option value="">Select...</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="passport">Passport</option>
                        <option value="state_id">State ID</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }} className="form-row">
                    <div className="form-group">
                      <label className="form-label">Desired Move-In Date *</label>
                      <input type="date" className="form-input" {...register('moveInDate', { required: true })} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Number of Occupants</label>
                      <input type="number" className="form-input" min={1} max={10} {...register('occupants', { valueAsNumber: true })} />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Current Street Address *</label>
                    <input className={`form-input ${errors.currentAddress?.street ? 'error' : ''}`} {...register('currentAddress.street', { required: 'Required' })} placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--s-4)' }} className="form-row-3">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input className={`form-input ${errors.currentAddress?.city ? 'error' : ''}`} {...register('currentAddress.city', { required: 'Required' })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input className="form-input" {...register('currentAddress.state', { required: true })} placeholder="DC" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">ZIP *</label>
                      <input className="form-input" {...register('currentAddress.zip', { required: true })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Monthly Rent</label>
                      <input type="number" className="form-input" {...register('currentAddress.monthlyRent', { valueAsNumber: true })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reason for Leaving</label>
                      <input className="form-input" {...register('currentAddress.reasonForLeaving')} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Employer Name *</label>
                      <input className={`form-input ${errors.employment?.employerName ? 'error' : ''}`} {...register('employment.employerName', { required: 'Required' })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Position *</label>
                      <input className={`form-input ${errors.employment?.position ? 'error' : ''}`} {...register('employment.position', { required: 'Required' })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Gross Monthly Income *</label>
                      <input type="number" className={`form-input ${errors.employment?.monthlyIncome ? 'error' : ''}`} {...register('employment.monthlyIncome', { required: 'Required', valueAsNumber: true })} placeholder="5000" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Employment Type</label>
                      <select className="form-input" {...register('employment.employmentType')}>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="self_employed">Self Employed</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Supervisor Name</label>
                      <input className="form-input" {...register('employment.supervisorName')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Supervisor Phone</label>
                      <input type="tel" className="form-input" {...register('employment.supervisorPhone')} />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
                  <div>
                    <h4 style={{ marginBottom: 'var(--s-4)' }}>Previous Landlord</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="form-input" {...register('previousLandlord.name')} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-input" {...register('previousLandlord.phone')} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: 'var(--s-4)' }}>Personal Reference</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--s-4)' }} className="form-row-3">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="form-input" {...register('references.0.name')} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" className="form-input" {...register('references.0.phone')} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Relationship</label>
                        <input className="form-input" {...register('references.0.relationship')} />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Information</label>
                    <textarea className="form-input" style={{ minHeight: 100 }} placeholder="Anything else we should know about your application..." {...register('additionalInfo')} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
                  <div style={{ padding: 'var(--s-5)', background: 'var(--gold-pale)', border: '1px solid var(--gold-light)', borderRadius: 'var(--r-xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s-3)' }}>
                      <AlertCircle size={18} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--midnight)', marginBottom: 'var(--s-1)' }}>Review Your Application</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                          Please review all information before submitting. An application fee of {formatCurrency(property?.applicationFee || 50)} will be due after submission.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {(() => {
                    const vals = getValues();
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
                        {[
                          ['Applicant', `${vals.applicant?.firstName || ''} ${vals.applicant?.lastName || ''}`],
                          ['Email', vals.applicant?.email],
                          ['Phone', vals.applicant?.phone],
                          ['Move-in Date', vals.moveInDate],
                          ['Employer', vals.employment?.employerName],
                          ['Monthly Income', vals.employment?.monthlyIncome ? formatCurrency(vals.employment.monthlyIncome) : '—'],
                        ].map(([label, value]) => (
                          <div key={label} style={{ padding: 'var(--s-3) var(--s-4)', border: '1px solid var(--gray-100)', borderRadius: 'var(--r-lg)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 500, marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--midnight)' }}>{value || '—'}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Agreements */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
                    {[
                      { field: 'agreeToTerms', label: 'I agree to the rental terms and conditions and confirm all information is accurate' },
                      { field: 'backgroundCheckConsent', label: 'I consent to a background check being performed as part of the application review' },
                      { field: 'creditCheckConsent', label: 'I consent to a credit check being performed as part of the application review' },
                    ].map(({ field, label }) => (
                      <label key={field} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s-3)', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>
                        <input
                          type="checkbox"
                          {...register(field)}
                          style={{ marginTop: 2, accentColor: 'var(--midnight)', flexShrink: 0 }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: '0.625rem 1.5rem', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--r-full)', background: 'var(--white)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}
              <button
                type={step === STEPS.length - 1 ? 'submit' : 'button'}
                onClick={step < STEPS.length - 1 ? nextStep : undefined}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', padding: '0.75rem 2rem', background: loading ? 'var(--gray-300)' : 'var(--midnight)', color: 'var(--white)', border: 'none', borderRadius: 'var(--r-full)', fontSize: '0.9375rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all var(--t-fast)' }}
              >
                {loading ? 'Submitting...' : step === STEPS.length - 1 ? 'Submit Application' : <>Continue <ChevronRight size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr !important; }
          .form-row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
