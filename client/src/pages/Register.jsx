import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '', extra = {}) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 14px',
          border: '1px solid #DDDDDD', borderRadius: '8px',
          fontSize: '0.9375rem', fontFamily: 'inherit', color: '#222',
          outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
          ...extra,
        }}
        onFocus={e => e.target.style.borderColor = '#222'}
        onBlur={e => e.target.style.borderColor = '#DDDDDD'}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid #EEEEEE', padding: '16px 24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C9 9 3 14.5 3 20.5C3 25.2 8.9 29 16 29C23.1 29 29 25.2 29 20.5C29 14.5 23 9 16 2Z" fill="#FF385C" />
            <path d="M12 22L16 14L20 22" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 19.5H18.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#FF385C', letterSpacing: '-0.02em' }}>arcadia</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ border: '1px solid #DDDDDD', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Create your account
            </h1>
            <p style={{ color: '#717171', fontSize: '0.9375rem', marginBottom: '28px' }}>
              Join Arcadia to save homes and schedule tours
            </p>

            {error && (
              <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#C62828', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {field('Full name', 'name', 'text', 'John Smith')}
              {field('Email address', 'email', 'email', 'you@example.com')}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    style={{
                      width: '100%', padding: '12px 44px 12px 14px',
                      border: '1px solid #DDDDDD', borderRadius: '8px',
                      fontSize: '0.9375rem', fontFamily: 'inherit', color: '#222',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#222'}
                    onBlur={e => e.target.style.borderColor = '#DDDDDD'}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#717171', display: 'flex' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {field('Confirm password', 'confirm', 'password', 'Repeat your password')}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#ffb3c0' : '#FF385C',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '8px', transition: 'background 0.15s',
                }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <p style={{ fontSize: '0.8125rem', color: '#717171', textAlign: 'center', lineHeight: 1.5 }}>
                By signing up, you agree to our{' '}
                <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#222', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>
            </form>

            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#EEEEEE' }} />
              <span style={{ fontSize: '0.8125rem', color: '#717171' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#EEEEEE' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9375rem', color: '#222' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#FF385C', fontWeight: 600, textDecoration: 'none' }}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
