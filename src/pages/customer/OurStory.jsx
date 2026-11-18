import { Link } from 'react-router-dom';
import useReveal from '../../hooks/useReveal.js';
import { PageHero } from '../../components/common/Bits.jsx';
const timeline = [['2019', 'The first fire', 'Chef Elena Marchetti opens ECHOORA with twelve tables and a wood oven imported from Naples.'], ['2021', 'The emerald room', 'The dining room is reimagined in deep emerald velvet and antique brass.'], ['2023', 'Open kitchen', 'Guests gain a front-row view of the pass, the flame and the craft.'], ['2026', 'A new chapter', 'A seasonal tasting programme and a digital concierge for every guest.']];
export default function OurStory() {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <PageHero eyebrow="Our story" title="Born from fire & patience" sub="ECHOORA means the resonance a meal leaves behind — long after the last course." image="/images/interior-emerald.jpg" />
      <section className="section"><div className="wrap split">
        <div data-reveal><h2>The philosophy</h2><div className="divider" /><p className="muted">We cook with a small circle of farmers, fishers and foragers, and we let ingredients lead. Nothing is rushed: our dough rests 72 hours, our steaks age 45 days, our sauces simmer overnight.</p><p className="muted" style={{ marginTop: '1rem' }}>Hospitality is the other half of the recipe. We remember your name, your anniversary and how you like your table.</p></div>
        <div className="img-frame" data-reveal><img src="/images/chef-flame.jpg" alt="Chef working with open flame" loading="lazy" /></div>
      </div></section>
      <section className="section alt"><div className="wrap"><p className="eyebrow" data-reveal>Milestones</p><h2 data-reveal>Seven years of echoes</h2>
        <div className="grid g4" style={{ marginTop: '2.5rem' }}>{timeline.map(([y, t, d]) => <div className="panel" key={y} data-reveal><b className="gold" style={{ fontFamily: 'var(--serif)', fontSize: '2.4rem' }}>{y}</b><h3 style={{ margin: '.5rem 0' }}>{t}</h3><p className="muted">{d}</p></div>)}</div></div></section>
      <section className="section"><div className="wrap"><p className="eyebrow" data-reveal>The team</p><h2 data-reveal>Hands behind the pass</h2>
        <div className="grid g3" style={{ marginTop: '2.5rem' }}>
          {[['Elena Marchetti', 'Executive Chef', '/images/chef-steak.jpg'], ['Kenji Aoki', 'Head of Fire & Wok', '/images/chef-wok.jpg'], ['Lucia Bianchi', 'Pastry & Desserts', '/images/dessert-pour.jpg']].map(([n, r, i]) => <div className="card dish" key={n} data-reveal><img src={i} alt={n} loading="lazy" /><div className="pad"><h3>{n}</h3><p className="gold">{r}</p></div></div>)}
        </div>
        <p style={{ textAlign: 'center', marginTop: '3rem' }}><Link className="btn solid" to="/reservations">Join us for dinner</Link></p></div></section>
    </div>
  );
}
