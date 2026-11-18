import { Link } from 'react-router-dom';
import useReveal from '../../hooks/useReveal.js';
import { useStore } from '../../context/StoreContext.jsx';
import { Stars, money } from '../../components/common/Bits.jsx';

export default function Home() {
  const { menu, reviews, addToCart } = useStore();
  const root = useReveal();
  const featured = menu.filter((m) => m.featured && m.available).slice(0, 4);
  const top = reviews.filter((r) => r.status === 'approved' && r.rating >= 4).slice(0, 3);
  return (
    <div ref={root}>
      <section className="hero">
        <video autoPlay muted loop playsInline poster="/images/chef-steak.jpg"><source src="/video/chef.mp4" type="video/mp4" /></video>
        <div className="wrap">
          <p className="eyebrow" data-hero>Modern European · Est. 2019</p>
          <h1 data-hero>Where every plate<br /><em>echoes</em> a story.</h1>
          <p className="lead" data-hero>Fire, patience and seasonal produce, served beneath chandeliers in our emerald dining room.</p>
          <div className="cta" data-hero><Link className="btn solid" to="/reservations">Reserve a table</Link><Link className="btn" to="/menu">Explore the menu</Link></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <p className="eyebrow" data-reveal>Signature dishes</p><h2 data-reveal>Chef’s selection</h2><div className="divider" />
          <div className="grid g4" style={{ marginTop: '2rem' }}>
            {featured.map((d, i) => (
              <article key={d.id} className="card dish" data-reveal data-delay={i * 0.08}>
                <Link to={`/menu/${d.id}`}><img src={d.image} alt={d.name} loading="lazy" /></Link>
                <div className="pad"><h3 style={{ fontSize: '1.25rem' }}>{d.name}</h3>
                  <div className="row" style={{ marginTop: '.8rem' }}><span className="price">{money(d.price)}</span><button className="btn sm" onClick={() => addToCart(d.id)}>Add</button></div></div>
              </article>))}
          </div>
          <p style={{ marginTop: '2.5rem', textAlign: 'center' }}><Link className="btn" to="/menu">View full menu</Link></p>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div className="img-frame" data-reveal><img src="/images/hall-chandelier.jpg" alt="ECHOORA dining room" loading="lazy" /></div>
          <div data-reveal><p className="eyebrow">The experience</p><h2>An evening, composed.</h2><div className="divider" />
            <p className="muted">From the first amuse-bouche to the tableside sauce pour, every moment is choreographed by our open kitchen and a sommelier team of five.</p>
            <div className="grid g3" style={{ marginTop: '2rem' }}>
              {[['7', 'Years'], ['62', 'Wines by glass'], ['4.8', 'Guest rating']].map(([n, l]) => <div className="stat" key={l}><b>{n}</b><span className="muted">{l}</span></div>)}
            </div>
            <p style={{ marginTop: '2rem' }}><Link className="btn" to="/our-story">Our story</Link></p></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap"><p className="eyebrow" data-reveal>Guest voices</p><h2 data-reveal>Words from our table</h2>
          <div className="grid g3" style={{ marginTop: '2.5rem' }}>
            {top.map((r) => <blockquote key={r.id} className="panel" data-reveal><Stars value={r.rating} /><p className="quote" style={{ margin: '1rem 0' }}>“{r.text}”</p><span className="gold">— {r.name}</span></blockquote>)}
          </div>
          <p style={{ marginTop: '2rem', textAlign: 'center' }}><Link className="btn" to="/reviews">Read all reviews</Link></p></div>
      </section>
    </div>
  );
}
