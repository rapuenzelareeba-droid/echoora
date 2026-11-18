import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
export default function AdminLogin() {
  const { admin, login } = useStore(); const go = useNavigate(); const [f, setF] = useState({ email: '', pass: '' }); const [err, setErr] = useState('');
  if (admin) return <Navigate to="/admin/dashboard" replace />;
  const submit = (e) => { e.preventDefault(); if (login(f.email, f.pass)) go('/admin/dashboard'); else setErr('Invalid credentials.'); };
  return (
    <div className="login"><div className="art" style={{ backgroundImage: 'linear-gradient(rgba(4,20,16,.4),rgba(4,20,16,.7)),url(/images/bar-emerald.jpg)' }} />
      <div className="form"><form onSubmit={submit} style={{ width: 'min(400px,100%)' }}>
        <img src="/images/logo.jpg" width="72" height="72" alt="" style={{ borderRadius: '50%', marginBottom: '1.2rem' }} /><p className="eyebrow">Staff portal</p><h2>Sign in</h2><div className="divider" />
        <div className="field"><label htmlFor="ae">Email</label><input id="ae" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="username" /></div>
        <div className="field"><label htmlFor="ap">Password</label><input id="ap" type="password" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} autoComplete="current-password" /></div>
        {err && <p className="err" style={{ marginBottom: '1rem' }}>{err}</p>}<button className="btn solid" style={{ width: '100%', justifyContent: 'center' }}>Sign in</button>
        <p className="muted" style={{ marginTop: '1.2rem', fontSize: '.8rem' }}>Demo: admin@echoora.com / echoora2026 (client-side demo auth — replace with a real backend before production).</p>
        <p style={{ marginTop: '1rem' }}><Link className="gold" to="/">← Back to website</Link></p></form></div></div>
  );
}
