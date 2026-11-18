import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero } from '../../components/common/Bits.jsx';
import { analyzeLocal } from '../../lib/analyze.js';
import { API } from '../../lib/api.js';
export default function AiFeedback() {
  const { reviews } = useStore(); const pub = reviews.filter((r) => r.status === 'approved');
  const [custom, setCustom] = useState(''); const [res, setRes] = useState(null); const [loading, setLoading] = useState(false);
  const run = async (texts) => {
    if (!texts.length) return; setLoading(true); setRes(null);
    try { const r = await fetch(`${API}/api/analyze-feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviews: texts }) });
      if (!r.ok) throw new Error(); setRes(await r.json());
    } catch { setRes({ ...analyzeLocal(texts), note: 'API server not reachable — showing built-in offline analysis. Start it with `npm run api`.' }); }
    setLoading(false); };
  const lines = custom.split('\n').map((s) => s.trim()).filter(Boolean);
  return (
    <div><PageHero eyebrow="AI insights" title="Feedback analysis" sub="Sentiment, themes and recommended actions from guest reviews." image="/images/chef-wok.jpg" />
      <section className="section"><div className="wrap grid" style={{ gridTemplateColumns: '1fr 1.3fr', alignItems: 'start' }}>
        <div className="panel"><h3>Choose input</h3><div className="divider" />
          <button className="btn solid" disabled={loading || !pub.length} onClick={() => run(pub.map((r) => r.text))}>Analyse {pub.length} published reviews</button>
          <p className="muted" style={{ margin: '1.5rem 0 .5rem' }}>or paste your own feedback (one per line):</p>
          <textarea rows="6" value={custom} onChange={(e) => setCustom(e.target.value)} aria-label="Custom feedback" placeholder="The service was slow but the pasta was perfect…" />
          <button className="btn" style={{ marginTop: '1rem' }} disabled={loading || !lines.length} onClick={() => run(lines)}>Analyse pasted text</button></div>
        <div>{loading && <div className="panel" style={{ textAlign: 'center' }}><span className="spinner" /><p className="muted" style={{ marginTop: '1rem' }}>Analysing feedback…</p></div>}
          {!loading && !res && <div className="empty"><h3>No analysis yet</h3><p>Run an analysis to see sentiment and themes.</p></div>}
          {res && <div className="grid">
            <div className="panel"><p className="eyebrow">Summary · {res.source === 'claude' ? 'Claude AI' : 'built-in analyser'}</p><p style={{ fontSize: '1.15rem' }}>{res.summary}</p>{res.note && <p className="err" style={{ marginTop: '.6rem' }}>{res.note}</p>}</div>
            <div className="grid g3">{[['Positive', res.positive], ['Neutral', res.neutral], ['Negative', res.negative]].map(([l, v]) => <div className="stat" key={l}><b>{v}%</b><span className="muted">{l}</span><div className="meter"><i style={{ width: `${v}%` }} /></div></div>)}</div>
            <div className="panel"><h3>Themes</h3><div className="divider" />{res.themes?.map((t) => <p key={t.topic} style={{ display: 'flex', justifyContent: 'space-between', margin: '.5rem 0' }}><b>{t.topic}</b><span className="muted">{t.positive} positive · {t.negative} negative · {t.mentions} mentions</span></p>)}</div>
            <div className="panel"><h3>Recommended actions</h3><div className="divider" /><ul style={{ paddingLeft: '1.2rem' }}>{res.actions?.map((a) => <li key={a} style={{ margin: '.4rem 0' }}>{a}</li>)}</ul></div></div>}</div>
      </div></section></div>
  );
}
