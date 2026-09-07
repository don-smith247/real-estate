import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--midnight)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s-6)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--s-8)' }}>
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto var(--s-3)' }}>
            <path d="M16 50L32 18L48 50" stroke="#C9A84C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 38H42" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="32" cy="18" r="3.5" fill="#C9A84C" />
          </svg>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--white)' }}>Arcadia</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginTop: 2 }}>Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-2xl)', padding: 'var(--s-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--s-2)', fontSize: '1.5rem' }}>Sign In</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginBottom: 'var(--s-8)' }}>Enter your credentials to access the admin dashboard.</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@arcadia.com"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--white)' }}
                {...register('email', { required: 'Email required' })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--white)', paddingRight: 'var(--s-10)' }}
                  {...register('password', { required: 'Password required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 'var(--s-4)', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 'var(--s-4)',
                background: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)',
                color: 'var(--midnight)',
                border: 'none',
                borderRadius: 'var(--r-xl)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--t-fast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--s-2)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--gold-dark)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--gold)'; }}
            >
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid var(--midnight)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing In...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--s-5)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.3)' }}>
          Arcadia Properties &mdash; Admin Portal
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important; -webkit-text-fill-color: white !important; }
      `}</style>
    </div>
  );
}
