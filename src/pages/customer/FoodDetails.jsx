import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useReveal from '../../hooks/useReveal.js';
import { useStore } from '../../context/StoreContext.jsx';
import { Empty, money } from '../../components/common/Bits.jsx';
export default function FoodDetails() {
  const { id } = useParams(); const { menu, addToCart } = useStore(); const [qty, setQty] = useState(1); const [note, setNote] = useState('');
  const ref = useReveal([id]); const d = menu.find((m) => m.id === id);
  if (!d) return <div className="section wrap"><Empty title="Dish not found" text="This dish is no longer on our menu." action={<Link className="btn" to="/menu">Back to menu</Link>} /></div>;
  const related = menu.filter((m) => m.category === d.category && m.id !== d.id && m.available).slice(0, 3);
  return (
    <div ref={ref}>
      <section className="section"><div className="wrap">
        <p className="muted" style={{ marginBottom: '2rem' }}><Link to="/menu" className="gold">Menu</Link> / {d.category} / {d.name}</p>
        <div className="split">
          <div className="img-frame" data-hero><img src={d.image} alt={d.name} /></div>
          <div>
            <p className="eyebrow" data-hero>{d.category}</p><h1 style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }} data-hero>{d.name}</h1>
            <p className="price" style={{ fontSize: '2.2rem', margin: '1rem 0' }} data-hero>{money(d.price)}</p>
            <p className="muted" data-hero>{d.desc}</p>
            <div style={{ margin: '1rem 0' }}>{d.tags.map((t) => <span className="tag" key={t}>{t}</span>)}<span className="tag">⏱ {d.time}</span><span className="tag">{d.calories} kcal</span>{d.spice > 0 && <span className="tag">Spice {'🌶'.repeat(d.spice)}</span>}</div>
            <h4 className="gold" style={{ fontSize: '1.2rem', margin: '1.5rem 0 .5rem' }}>Ingredients</h4>
            <ul className="muted" style={{ columns: 2, paddingLeft: '1.2rem' }}>{d.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
            <div className="field" style={{ marginTop: '1.5rem' }}><label htmlFor="note">Special requests</label><input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Allergies, cooking preference…" /></div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(qty + 1)} aria-label="Increase">+</button></div>
              <button className="btn solid" onClick={() => addToCart(d.id, qty)}>Add to order · {money(d.price * qty)}</button><Link to="/cart" className="btn">View cart</Link>
            </div>
          </div>
        </div>
      </div></section>
      {related.length > 0 && <section className="section alt"><div className="wrap"><h2>Pairs well with</h2><div className="grid g3" style={{ marginTop: '2rem' }}>{related.map((r) => <Link key={r.id} to={`/menu/${r.id}`} className="card dish"><img src={r.image} alt={r.name} loading="lazy" /><div className="pad"><div className="row"><h3 style={{ fontSize: '1.2rem' }}>{r.name}</h3><span className="price">{money(r.price)}</span></div></div></Link>)}</div></div></section>}
    </div>
  );
}
