import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      const role = data.user?.role;
      if (role === 'admin' || role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F7F5', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ borderBottom: '1px solid #E8EEE9', padding: '16px 24px', background: '#fff' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/logo.PNG"
            alt="Rotex One Realty"
            style={{ height: 36, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0B1A12', letterSpacing: '0.02em', lineHeight: 1.2 }}>ROTEX ONE</div>
            <div style={{ fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#059669' }}>Realty</div>
          </div>
        </Link>
      </header>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ border: '1px solid #D0DBD3', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', background: '#fff' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0B1A12', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p style={{ color: '#6B8872', fontSize: '0.9375rem', marginBottom: '28px' }}>
              Sign in to your Rotex One Realty account
            </p>

            {error && (
              <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#C62828', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#0B1A12', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: '1px solid #D0DBD3', borderRadius: '8px',
                    fontSize: '0.9375rem', fontFamily: 'inherit', color: '#0B1A12',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#059669'}
                  onBlur={e => e.target.style.borderColor = '#D0DBD3'}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#0B1A12', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '12px 44px 12px 14px',
                      border: '1px solid #D0DBD3', borderRadius: '8px',
                      fontSize: '0.9375rem', fontFamily: 'inherit', color: '#0B1A12',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#059669'}
                    onBlur={e => e.target.style.borderColor = '#D0DBD3'}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B8872', display: 'flex' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#6ee7b7' : '#059669',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#047857'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#059669'; }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E8EEE9' }} />
              <span style={{ fontSize: '0.8125rem', color: '#6B8872' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#E8EEE9' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9375rem', color: '#0B1A12' }}>
              Don't have an account?{' '}
              <Link to="/register" state={{ from }} style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
