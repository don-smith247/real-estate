import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
    <div style={{
      minHeight: '100vh',
      background: '#0B1A12',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #059669, #34D399, #059669)' }} />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo + Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src="/logo.PNG"
            alt="Rotex One Realty"
            style={{ height: 110, width: 'auto', objectFit: 'contain', marginBottom: 16 }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>ROTEX ONE REALTY</div>
          <div style={{ fontSize: '0.6875rem', color: '#059669', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginTop: 4 }}>Admin Portal</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 32,
        }}>
          <h2 style={{ color: '#fff', marginBottom: 6, fontSize: '1.375rem', fontWeight: 700 }}>Sign In</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginBottom: 28 }}>
            Enter your credentials to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@rotexone.com"
                style={{
                  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${errors.email ? '#F87171' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 10, color: '#fff',
                  fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#059669'}
                onBlur={e => e.target.style.borderColor = errors.email ? '#F87171' : 'rgba(255,255,255,0.12)'}
                {...register('email', { required: 'Email required' })}
              />
              {errors.email && <span style={{ fontSize: '0.75rem', color: '#F87171', marginTop: 4, display: 'block' }}>{errors.email.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${errors.password ? '#F87171' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 10, color: '#fff',
                    fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#059669'}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#F87171' : 'rgba(255,255,255,0.12)'}
                  {...register('password', { required: 'Password required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '0.75rem', color: '#F87171', marginTop: 4, display: 'block' }}>{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'rgba(5,150,105,0.5)' : '#059669',
                color: '#fff', border: 'none', borderRadius: 10,
                fontWeight: 700, fontSize: '0.9375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#047857'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#059669'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.25)' }}>
          Rotex One Realty &mdash; Admin Portal
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
}
