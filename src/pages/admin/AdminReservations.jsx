import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
export default function AdminReservations() {
  const { reservations, updateReservation } = useStore(); const [filter, setFilter] = useState('All');
  const list = reservations.filter((r) => filter === 'All' || r.status === filter).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (<div><div className="admin-top"><div><p className="eyebrow">Front of house</p><h1 style={{ fontSize: '2.4rem' }}>Reservations</h1></div>
    <select style={{ width: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter"><option>All</option>{['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}</select></div>
    {list.length === 0 ? <div className="panel"><p className="muted">No reservations found.</p></div> : <div className="panel tbl-wrap"><table><thead><tr><th>Ref</th><th>Guest</th><th>When</th><th>Party</th><th>Notes</th><th>Status</th><th /></tr></thead><tbody>{list.map((r) => <tr key={r.id}>
      <td>{r.id}</td><td>{r.name}<br /><span className="muted">{r.phone}</span></td><td>{r.date}<br />{r.time}</td><td>{r.guests}</td><td className="muted">{[r.occasion, r.notes].filter(Boolean).join(' · ') || '—'}</td><td><span className={`badge b-${r.status}`}>{r.status}</span></td>
      <td style={{ whiteSpace: 'nowrap' }}>{r.status === 'Pending' && <button className="btn sm" onClick={() => updateReservation(r.id, { status: 'Confirmed' })}>Confirm</button>} {r.status === 'Confirmed' && <button className="btn sm" onClick={() => updateReservation(r.id, { status: 'Completed' })}>Complete</button>} {!['Cancelled', 'Completed'].includes(r.status) && <button className="btn sm danger" onClick={() => updateReservation(r.id, { status: 'Cancelled' })}>Cancel</button>}</td></tr>)}</tbody></table></div>}</div>);
}
