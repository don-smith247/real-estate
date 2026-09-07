import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { usersApi, authApi } from '../utils/api';

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #DDDDDD', borderRadius: '8px',
  fontSize: '0.9375rem', fontFamily: 'inherit', color: '#222',
  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
};

export default function UserProfile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const res = await usersApi.updateProfile({ name: profile.name, email: profile.email, phone: profile.phone, bio: profile.bio });
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPw !== pw.confirm) { setPwMsg({ type: 'error', text: 'New passwords do not match' }); return; }
    if (pw.newPw.length < 6) { setPwMsg({ type: 'error', text: 'Password must be at least 6 characters' }); return; }
    setSavingPw(true);
    try {
      await authApi.changePassword({ currentPassword: pw.current, newPassword: pw.newPw });
      setPwMsg({ type: 'success', text: 'Password changed successfully' });
      setPw({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  const Msg = ({ msg }) => msg ? (
    <div style={{
      padding: '10px 14px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '16px',
      background: msg.type === 'success' ? '#F0FFF4' : '#FFF0F0',
      border: `1px solid ${msg.type === 'success' ? '#C6F6D5' : '#FFCDD2'}`,
      color: msg.type === 'success' ? '#276749' : '#C62828',
    }}>
      {msg.text}
    </div>
  ) : null;

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ paddingTop: 'var(--header-h)' }}>
        <div style={{ borderBottom: '1px solid #EEEEEE', padding: '24px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => navigate('/dashboard')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.9375rem', fontWeight: 500, color: '#222',
            }}>
              <ChevronLeft size={18} /> Dashboard
            </button>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', color: '#717171',
            }}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        <div className="container" style={{ padding: '40px var(--s-6) 80px', maxWidth: 720 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: '#FF385C', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: 700, flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                {user?.name}
              </h1>
              <p style={{ color: '#717171', fontSize: '0.9375rem' }}>Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Profile form */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ border: '1px solid #EEEEEE', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#222', marginBottom: '24px', letterSpacing: '-0.015em' }}>
              Personal information
            </h2>
            <Msg msg={profileMsg} />
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="profile-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>Full name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#222'} onBlur={e => e.target.style.borderColor = '#DDDDDD'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>Email address</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#222'} onBlur={e => e.target.style.borderColor = '#DDDDDD'} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>Phone number</label>
                <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="(202) 555-0100" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#222'} onBlur={e => e.target.style.borderColor = '#DDDDDD'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>Bio <span style={{ color: '#717171', fontWeight: 400 }}>(optional)</span></label>
                <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                  onFocus={e => e.target.style.borderColor = '#222'} onBlur={e => e.target.style.borderColor = '#DDDDDD'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={savingProfile} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '11px 24px', background: savingProfile ? '#ccc' : '#222',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '0.9375rem', fontWeight: 600, cursor: savingProfile ? 'not-allowed' : 'pointer',
                }}>
                  <Save size={15} /> {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </form>
          </motion.section>

          {/* Password form */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ border: '1px solid #EEEEEE', borderRadius: '16px', padding: '32px' }}
          >
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#222', marginBottom: '24px', letterSpacing: '-0.015em' }}>
              Change password
            </h2>
            <Msg msg={pwMsg} />
            <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Current password', key: 'current' },
                { label: 'New password', key: 'newPw' },
                { label: 'Confirm new password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#222', marginBottom: '6px' }}>{label}</label>
                  <input type="password" value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="••••••••" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#222'} onBlur={e => e.target.style.borderColor = '#DDDDDD'} />
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={savingPw} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '11px 24px', background: savingPw ? '#ccc' : '#222',
                  color: '#fff', border: 'none', borderRadius: '8px',
                  fontSize: '0.9375rem', fontWeight: 600, cursor: savingPw ? 'not-allowed' : 'pointer',
                }}>
                  <Lock size={15} /> {savingPw ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>

      <Footer />
      <style>{`.profile-grid { @media (max-width: 600px) { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
