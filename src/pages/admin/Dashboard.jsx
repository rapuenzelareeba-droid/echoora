import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../components/common/Bits.jsx';
export default function Dashboard() {
  const { orders, reservations, reviews, menu } = useStore();
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const pendingRes = reservations.filter((r) => r.status === 'Pending').length; const pendingRev = reviews.filter((r) => r.status === 'pending').length;
  const kpis = [['Revenue', money(revenue)], ['Orders', orders.length], ['Pending bookings', pendingRes], ['Reviews to moderate', pendingRev], ['Menu items', menu.length]];
  return (<div><div className="admin-top"><div><p className="eyebrow">Overview</p><h1 style={{ fontSize: '2.4rem' }}>Dashboard</h1></div></div>
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>{kpis.map(([l, v]) => <div className="card kpi" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
    <div className="grid g2" style={{ marginTop: '1.6rem' }}>
      <div className="panel"><div className="admin-top" style={{ marginBottom: '1rem' }}><h3>Recent orders</h3><Link className="btn sm" to="/admin/orders">All</Link></div>
        {orders.length ? <table><tbody>{orders.slice(0, 5).map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.customer}</td><td>{money(o.total)}</td><td><span className={`badge b-${o.status}`}>{o.status}</span></td></tr>)}</tbody></table> : <p className="muted">No orders yet — place one from the guest site.</p>}</div>
      <div className="panel"><div className="admin-top" style={{ marginBottom: '1rem' }}><h3>Upcoming reservations</h3><Link className="btn sm" to="/admin/reservations">All</Link></div>
        {reservations.length ? <table><tbody>{reservations.slice(0, 5).map((r) => <tr key={r.id}><td>{r.name}</td><td>{r.date} {r.time}</td><td>{r.guests}p</td><td><span className={`badge b-${r.status}`}>{r.status}</span></td></tr>)}</tbody></table> : <p className="muted">No reservations yet.</p>}</div></div></div>);
}
