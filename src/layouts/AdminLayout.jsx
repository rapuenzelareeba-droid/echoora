import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext.jsx';
const nav = [['dashboard', 'Dashboard'], ['menu', 'Menu Manager'], ['orders', 'Orders'], ['reservations', 'Reservations'], ['reviews', 'Reviews'], ['analytics', 'Analytics']];
export default function AdminLayout() {
  const { admin, logout, toast } = useStore(); const go = useNavigate();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin">
      <aside className="side">
        <div className="logo" style={{ padding: '0 1rem 1.5rem', fontSize: '1.2rem' }}><img src="/images/logo.jpg" width="34" height="34" alt="" style={{ borderRadius: '50%' }} /><span>ECHOORA</span></div>
        <p className="eyebrow" style={{ padding: '0 1rem', fontSize: '.65rem' }}>Back office</p>
        {nav.map(([to, l]) => <NavLink key={to} to={`/admin/${to}`}>{l}</NavLink>)}
        <div style={{ marginTop: 'auto', display: 'grid', gap: '.5rem' }}>
          <NavLink to="/" >← Guest website</NavLink>
          <button className="btn sm" style={{ color: 'var(--gold-lt)' }} onClick={() => { logout(); go('/admin/login'); }}>Sign out</button>
        </div>
      </aside>
      <section className="admin-main"><Outlet /></section>
      {toast && <div className="toast">{toast.msg}</div>}
    </div>
  );
}
