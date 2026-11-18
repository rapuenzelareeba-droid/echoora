import { useMemo } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../components/common/Bits.jsx';
export default function AdminAnalytics() {
  const { orders, reservations, reviews } = useStore();
  const d = useMemo(() => {
    const live = orders.filter((o) => o.status !== 'Cancelled'); const dish = {}; live.forEach((o) => o.lines.forEach((l) => { dish[l.name] = (dish[l.name] || 0) + l.qty; }));
    const top = Object.entries(dish).sort((a, b) => b[1] - a[1]).slice(0, 6); const days = {};
    for (let i = 6; i >= 0; i--) { const k = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10); days[k] = 0; }
    live.forEach((o) => { const k = o.createdAt.slice(0, 10); if (k in days) days[k] += o.total; });
    const rev = reviews.filter((r) => r.status === 'approved'); const avg = rev.length ? rev.reduce((s, r) => s + r.rating, 0) / rev.length : 0;
    return { top, days: Object.entries(days), revenue: live.reduce((s, o) => s + o.total, 0), aov: live.length ? live.reduce((s, o) => s + o.total, 0) / live.length : 0, avg, covers: reservations.filter((r) => r.status !== 'Cancelled').reduce((s, r) => s + r.guests, 0) };
  }, [orders, reservations, reviews]);
  const maxD = Math.max(1, ...d.days.map(([, v]) => v)); const maxT = Math.max(1, ...d.top.map(([, v]) => v));
  return (<div><div className="admin-top"><div><p className="eyebrow">Insights</p><h1 style={{ fontSize: '2.4rem' }}>Analytics</h1></div></div>
    <div className="grid g4">{[['Revenue', money(d.revenue)], ['Avg order', money(d.aov)], ['Avg rating', d.avg.toFixed(1) + ' ★'], ['Booked covers', d.covers]].map(([l, v]) => <div className="card kpi" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
    <div className="grid g2" style={{ marginTop: '1.6rem' }}>
      <div className="panel"><h3>Revenue · last 7 days</h3><div className="bars">{d.days.map(([k, v]) => <div key={k}><span>{v ? '$' + Math.round(v) : ''}</span><i style={{ height: `${v / maxD * 100}%` }} /><span className="muted">{k.slice(5)}</span></div>)}</div></div>
      <div className="panel"><h3>Top dishes</h3>{d.top.length ? d.top.map(([n, c]) => <div key={n} style={{ margin: '.9rem 0' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{n}</span><b>{c}</b></div><div className="meter" style={{ background: '#e4e8e1' }}><i style={{ width: `${c / maxT * 100}%` }} /></div></div>) : <p className="muted" style={{ marginTop: '1rem' }}>No sales data yet.</p>}</div></div></div>);
}
