import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useStore } from '../../context/StoreContext.jsx';
import { API } from '../../lib/api.js';

const GREETING = { role: 'assistant', content: 'Welcome to ECHOORA ✦ I’m your digital concierge. Ask me about the menu, prices, dietary needs, reservations or opening hours.', links: [] };
const QUICK = ['What do you recommend?', 'Vegetarian options', 'Opening hours', 'How do I book a table?'];

export default function ChatWidget() {
  const { menu } = useStore();
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const [text, setText] = useState('');
  const [msgs, setMsgs] = useState(() => { try { return JSON.parse(sessionStorage.getItem('echoora.chat')) || [GREETING]; } catch { return [GREETING]; } });
  const panel = useRef(null); const end = useRef(null); const input = useRef(null);

  useEffect(() => { try { sessionStorage.setItem('echoora.chat', JSON.stringify(msgs.slice(-30))); } catch { /* ignore */ } end.current?.scrollIntoView({ block: 'end' }); }, [msgs, busy, open]);
  useLayoutEffect(() => { if (open && panel.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.from(panel.current, { y: 30, opacity: 0, scale: .96, duration: .35, ease: 'power3.out' }); if (open) input.current?.focus(); }, [open]);
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);

  const send = async (raw) => {
    const content = (raw ?? text).trim(); if (!content || busy) return;
    const next = [...msgs, { role: 'user', content }]; setMsgs(next); setText(''); setBusy(true);
    try {
      const r = await fetch(`${API}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), menu: menu.map(({ id, name, category, price, tags, desc, spice, available }) => ({ id, name, category, price, tags, desc, spice, available })) }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Request failed');
      if (d.aiError) console.warn('ECHOORA chat is in offline mode:', d.aiError);
      setMsgs((m) => [...m, { role: 'assistant', content: d.reply, links: d.links || [], offline: d.source === 'local' }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Sorry — I can’t reach our concierge service right now. Please call +1 (555) 014-2026 or try again shortly.', links: [{ to: '/contact', label: 'Contact us' }] }]);
    }
    setBusy(false);
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close chat' : 'Chat with our concierge'}>{open ? '✕' : '✦'}<span>{open ? '' : 'Ask us'}</span></button>
      {open && (
        <section className="chat" ref={panel} role="dialog" aria-label="ECHOORA concierge chat">
          <header><div><b>ECHOORA Concierge</b><small>AI assistant · replies instantly</small></div><button onClick={() => { setMsgs([GREETING]); }} aria-label="Clear conversation" title="New chat">↺</button></header>
          <div className="chat-body" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>{m.content}
                {m.offline && <small className="chat-note">Offline mode — limited answers</small>}
                {m.links?.length > 0 && <div className="chat-links">{m.links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label} →</Link>)}</div>}</div>))}
            {busy && <div className="bubble assistant typing"><i /><i /><i /></div>}
            {msgs.length <= 1 && !busy && <div className="chat-quick">{QUICK.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" maxLength={500} aria-label="Message" />
            <button disabled={busy || !text.trim()} aria-label="Send">➤</button>
          </form>
        </section>)}
    </>
  );
}
