import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useReveal from '../../hooks/useReveal.js';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero, Empty, money } from '../../components/common/Bits.jsx';
import { CATEGORIES } from '../../data/menu.js';
const FILTERS = ['Vegetarian', 'Gluten-free', 'Spicy', 'Signature'];
export default function Menu() {
  const { menu, addToCart } = useStore();
  const [cat, setCat] = useState('All'); const [q, setQ] = useState(''); const [tag, setTag] = useState(null); const [sort, setSort] = useState('default');
  const list = useMemo(() => {
    let l = menu.filter((m) => m.available && (cat === 'All' || m.category === cat) && (!tag || m.tags.includes(tag)) && (m.name + m.desc).toLowerCase().includes(q.toLowerCase()));
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price); if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price); return l;
  }, [menu, cat, q, tag, sort]);
  const ref = useReveal([list.length, cat]);
  return (
    <div ref={ref}>
      <PageHero eyebrow="The menu" title="Seasonal. Seared. Sublime." sub="Order online for pickup or delivery, or browse before you dine." image="/images/tasting-spread.jpg" />
      <section className="section"><div className="wrap">
        <div className="chips">{['All', ...CATEGORIES].map((c) => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
          <input placeholder="Search dishes…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search menu" />
          <select value={tag || ''} onChange={(e) => setTag(e.target.value || null)} aria-label="Dietary filter"><option value="">All diets</option>{FILTERS.map((f) => <option key={f}>{f}</option>)}</select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="default">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
        </div>
        {list.length === 0 ? <div style={{ marginTop: '2rem' }}><Empty title="No dishes found" text="Try a different filter or search." action={<button className="btn" onClick={() => { setCat('All'); setQ(''); setTag(null); }}>Reset filters</button>} /></div> :
          <div className="grid g3" style={{ marginTop: '2rem' }}>{list.map((d) => (
            <article key={d.id} className="card dish" data-reveal>
              <Link to={`/menu/${d.id}`}><img src={d.image} alt={d.name} loading="lazy" /></Link>
              <div className="pad"><div className="row"><h3 style={{ fontSize: '1.3rem' }}>{d.name}</h3><span className="price">{money(d.price)}</span></div>
                <p className="muted" style={{ margin: '.6rem 0' }}>{d.desc}</p><div>{d.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                <div style={{ display: 'flex', gap: '.6rem', marginTop: '1rem' }}><Link className="btn sm" to={`/menu/${d.id}`}>Details</Link><button className="btn sm solid" onClick={() => addToCart(d.id)}>Add to order</button></div></div>
            </article>))}</div>}
      </div></section>
    </div>
  );
}
