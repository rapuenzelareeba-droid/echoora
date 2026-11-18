import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { Stars } from '../../components/common/Bits.jsx';
export default function AdminReviews() {
  const { reviews, updateReview, deleteReview } = useStore(); const [filter, setFilter] = useState('pending');
  const list = reviews.filter((r) => filter === 'all' || r.status === filter);
  return (<div><div className="admin-top"><div><p className="eyebrow">Reputation</p><h1 style={{ fontSize: '2.4rem' }}>Review moderation</h1></div>
    <select style={{ width: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter reviews"><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="all">All</option></select></div>
    {list.length === 0 ? <div className="panel"><p className="muted">Nothing in this queue.</p></div> : <div className="grid">{list.map((r) => <div className="panel" key={r.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><b>{r.name}</b> <Stars value={r.rating} size={15} /></div><span className={`badge b-${r.status}`}>{r.status}</span></div><p style={{ margin: '.8rem 0' }}>{r.text}</p>
      <button className="btn sm" onClick={() => updateReview(r.id, { status: 'approved' })}>Approve</button> <button className="btn sm" onClick={() => updateReview(r.id, { status: 'rejected' })}>Reject</button> <button className="btn sm danger" onClick={() => window.confirm('Delete this review?') && deleteReview(r.id)}>Delete</button></div>)}</div>}</div>);
}
