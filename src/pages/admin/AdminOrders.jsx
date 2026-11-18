import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../components/common/Bits.jsx';
const STAGES = ['New', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
export default function AdminOrders() {
  const { orders, updateOrder } = useStore(); const [filter, setFilter] = useState('All'); const [open, setOpen] = useState(null);
  const list = orders.filter((o) => filter === 'All' || o.status === filter);
  return (<div><div className="admin-top"><div><p className="eyebrow">Kitchen</p><h1 style={{ fontSize: '2.4rem' }}>Orders</h1></div>
    <select style={{ width: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter orders"><option>All</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></div>
    {list.length === 0 ? <div className="panel"><p className="muted">No orders match. Orders placed at /checkout appear here.</p></div> :
      <div className="panel tbl-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Total</th><th>Placed</th><th>Status</th></tr></thead><tbody>{list.map((o) => <>
        <tr key={o.id} onClick={() => setOpen(open === o.id ? null : o.id)} style={{ cursor: 'pointer' }}><td>{o.id}</td><td>{o.customer}</td><td>{o.type}</td><td>{money(o.total)}</td><td>{new Date(o.createdAt).toLocaleString()}</td>
          <td onClick={(e) => e.stopPropagation()}><select value={o.status} onChange={(e) => updateOrder(o.id, e.target.value)} aria-label={`Status of ${o.id}`}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></td></tr>
        {open === o.id && <tr key={o.id + 'd'}><td colSpan="6" style={{ background: '#f6f8f3' }}>{o.lines.map((l) => <div key={l.id}>{l.qty}× {l.name} — {money(l.price * l.qty)}</div>)}<p className="muted" style={{ marginTop: '.5rem' }}>{o.phone} · {o.email}{o.address && ` · ${o.address}`}{o.notes && ` · Note: ${o.notes}`}</p></td></tr>}</>)}</tbody></table></div>}</div>);
}
