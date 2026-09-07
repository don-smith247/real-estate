import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone, Mail, MapPin, Clock, Instagram, Facebook, Linkedin, Globe, Type, AlertCircle } from 'lucide-react';
import { settingsApi } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const SECTIONS = [
  {
    id: 'contact',
    title: 'Contact Information',
    desc: 'Shown on the Contact page and in the site footer.',
    icon: Phone,
    fields: [
      { key: 'contactPhone',  label: 'Phone Number',    icon: Phone,   placeholder: '(202) 555-0180',               type: 'text' },
      { key: 'contactEmail',  label: 'Email Address',   icon: Mail,    placeholder: 'hello@rotexonerealty.com',      type: 'email' },
      { key: 'officeAddress', label: 'Street Address',  icon: MapPin,  placeholder: '1600 K Street NW',              type: 'text' },
      { key: 'officeCity',    label: 'City / State / Zip', icon: MapPin, placeholder: 'Washington, DC 20006',        type: 'text' },
      { key: 'officeHours',   label: 'Office Hours',    icon: Clock,   placeholder: 'Mon–Fri: 9am–6pm · Sat: 10am–4pm', type: 'text' },
    ],
  },
  {
    id: 'social',
    title: 'Social Media',
    desc: 'Links open when users click social icons in the footer.',
    icon: Globe,
    fields: [
      { key: 'instagramHandle', label: 'Instagram Handle',  icon: Instagram, placeholder: '@rotexonerealty',         type: 'text' },
      { key: 'instagramUrl',    label: 'Instagram URL',     icon: Instagram, placeholder: 'https://instagram.com/rotexonerealty', type: 'url' },
      { key: 'facebookHandle',  label: 'Facebook Name',     icon: Facebook,  placeholder: 'Rotex One Realty',        type: 'text' },
      { key: 'facebookUrl',     label: 'Facebook URL',      icon: Facebook,  placeholder: 'https://facebook.com/rotexonerealty', type: 'url' },
      { key: 'linkedinHandle',  label: 'LinkedIn Name',     icon: Linkedin,  placeholder: 'Rotex One Realty',        type: 'text' },
      { key: 'linkedinUrl',     label: 'LinkedIn URL',      icon: Linkedin,  placeholder: 'https://linkedin.com/company/rotexonerealty', type: 'url' },
    ],
  },
  {
    id: 'content',
    title: 'Page Content',
    desc: 'Edit key headlines and body text shown across the public website.',
    icon: Type,
    fields: [
      { key: 'companyTagline', label: 'Company Tagline (Footer)',      type: 'text',     placeholder: "Washington DC's premier rental service." },
      { key: 'heroHeadline',   label: 'Hero Section Headline',         type: 'text',     placeholder: 'Live Where Excellence Is The Standard' },
      { key: 'heroSubtitle',   label: 'Hero Section Subtitle',         type: 'textarea', placeholder: 'Rotex One Realty brings decades of expertise…' },
      { key: 'aboutHeadline',  label: 'About Page Headline',           type: 'text',     placeholder: 'Redefining What Renting Should Feel Like' },
      { key: 'aboutBody',      label: 'About Page Body Text',          type: 'textarea', placeholder: 'Rotex One Realty was founded on a conviction…' },
    ],
  },
];

export default function SiteSettings() {
  const { toast } = useToast();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    settingsApi.get()
      .then(res => setForm(res.data.data || {}))
      .catch(() => toast('Could not load settings', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(form);
      toast('Settings saved successfully', 'success');
      setDirty(false);
    } catch {
      toast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 820 }}>
        <div style={{ marginBottom: 'var(--s-6)' }}>
          <div className="skeleton" style={{ height: 28, width: 200, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: 320, borderRadius: 4 }} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', padding: 'var(--s-6)', marginBottom: 'var(--s-5)' }}>
            <div className="skeleton" style={{ height: 20, width: 160, borderRadius: 4, marginBottom: 20 }} />
            {[1, 2].map(j => <div key={j} className="skeleton" style={{ height: 40, borderRadius: 8, marginBottom: 12 }} />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--s-6)', flexWrap: 'wrap', gap: 'var(--s-4)' }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Site Settings</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Edit contact details, social links, and page text that appear on the public website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: dirty ? '#059669' : 'var(--gray-200)',
            color: dirty ? 'white' : 'var(--gray-400)',
            border: 'none', borderRadius: 'var(--r-xl)',
            fontWeight: 600, fontSize: '0.875rem',
            cursor: dirty ? 'pointer' : 'not-allowed',
            transition: 'all var(--t-fast)',
          }}
          onMouseEnter={e => { if (dirty) e.currentTarget.style.background = '#047857'; }}
          onMouseLeave={e => { if (dirty) e.currentTarget.style.background = '#059669'; }}
        >
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Unsaved changes banner */}
      {dirty && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 'var(--r-lg)', marginBottom: 'var(--s-5)', fontSize: '0.875rem', color: '#C2410C' }}
        >
          <AlertCircle size={15} />
          You have unsaved changes.
        </motion.div>
      )}

      {/* Sections */}
      {SECTIONS.map((section, si) => {
        const SectionIcon = section.icon;
        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', marginBottom: 'var(--s-5)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}
          >
            {/* Section header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-lg)', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SectionIcon size={16} style={{ color: '#059669' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--midnight)' }}>{section.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: 1 }}>{section.desc}</div>
              </div>
            </div>

            {/* Fields */}
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: section.id === 'social' ? '1fr 1fr' : '1fr', gap: '16px' }} className={`settings-grid-${section.id}`}>
              {section.fields.map(field => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.key} className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {FieldIcon && <FieldIcon size={13} style={{ color: 'var(--gray-400)' }} />}
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={form[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="form-input"
                        rows={3}
                        style={{ resize: 'vertical', minHeight: 80 }}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={form[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="form-input"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Save button at bottom too */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--s-2)' }}>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px',
            background: dirty ? '#059669' : 'var(--gray-200)',
            color: dirty ? 'white' : 'var(--gray-400)',
            border: 'none', borderRadius: 'var(--r-xl)',
            fontWeight: 600, fontSize: '0.875rem',
            cursor: dirty ? 'pointer' : 'not-allowed',
          }}
        >
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .settings-grid-social { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
