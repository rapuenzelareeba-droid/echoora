import { useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../../hooks/useReveal.js';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero, Stars } from '../../components/common/Bits.jsx';
export default function Reviews() {
  const { reviews, addReview, notify } = useStore(); const [f, setF] = useState({ name: '', rating: 5, text: '' }); const [err, setErr] = useState('');
  const [filter, setFilter] = useState(0);
  const pub = reviews.filter((r) => r.status === 'approved'); const shown = pub.filter((r) => !filter || r.rating === filter);
  const avg = pub.length ? (pub.reduce((s, r) => s + r.rating, 0) / pub.length).toFixed(1) : '–'; const ref = useReveal([shown.length]);
  const submit = (e) => { e.preventDefault(); if (f.name.trim().length < 2 || f.text.trim().length < 15) return setErr('Please add your name and at least 15 characters of feedback.');
    addReview(f); setF({ name: '', rating: 5, text: '' }); setErr(''); notify('Thank you — your review awaits moderation'); };
  return (
    <div ref={ref}><PageHero eyebrow="Guest reviews" title="What our guests say" image="/images/hall-chandelier.jpg" />
      <section className="section"><div className="wrap grid" style={{ gridTemplateColumns: '1fr 1.8fr', alignItems: 'start' }}>
        <div><div className="panel" style={{ textAlign: 'center' }}><b className="gold" style={{ fontFamily: 'var(--serif)', fontSize: '4rem' }}>{avg}</b><div><Stars value={Math.round(avg) || 0} /></div><p className="muted">{pub.length} published reviews</p>
          {[5, 4, 3, 2, 1].map((n) => { const c = pub.filter((r) => r.rating === n).length; return <div key={n} style={{ display: 'flex', gap: '.6rem', alignItems: 'center', marginTop: '.5rem' }}><span style={{ width: 20 }}>{n}★</span><div className="meter" style={{ flex: 1, marginTop: 0 }}><i style={{ width: `${pub.length ? c / pub.length * 100 : 0}%` }} /></div><span className="muted" style={{ width: 20 }}>{c}</span></div>; })}</div>
          <form className="panel" style={{ marginTop: '1.5rem' }} onSubmit={submit}><h3>Write a review</h3><div className="divider" />
            <div className="field"><label htmlFor="vn">Your name</label><input id="vn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div className="field"><label>Rating</label><Stars value={f.rating} onChange={(n) => setF({ ...f, rating: n })} size={28} /></div>
            <div className="field"><label htmlFor="vt">Your experience</label><textarea id="vt" rows="4" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} /></div>
            {err && <p className="err" style={{ marginBottom: '1rem' }}>{err}</p>}<button className="btn solid">Submit review</button></form></div>
        <div><div className="chips" style={{ marginTop: 0 }}>{[0, 5, 4, 3, 2, 1].map((n) => <button key={n} className={`chip ${filter === n ? 'on' : ''}`} onClick={() => setFilter(n)}>{n ? `${n} ★` : 'All'}</button>)}</div>
          <div className="grid">{shown.map((r) => <article className="panel" key={r.id} data-reveal><div style={{ display: 'flex', justifyContent: 'space-between' }}><Stars value={r.rating} /><span className="muted">{r.date}</span></div><p style={{ margin: '.8rem 0' }}>{r.text}</p><span className="gold">— {r.name}</span></article>)}</div>
          <p style={{ marginTop: '2rem' }} className="muted">Curious what the reviews reveal? <Link className="gold" to="/ai-feedback">Run the AI feedback analysis →</Link></p></div>
      </div></section></div>
  );
}
