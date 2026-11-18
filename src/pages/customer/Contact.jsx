import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero } from '../../components/common/Bits.jsx';
export default function Contact() {
  const { notify } = useStore(); const [f, setF] = useState({ name: '', email: '', subject: 'General enquiry', message: '' }); const [err, setErr] = useState({}); const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); const x = {}; if (f.name.trim().length < 2) x.name = 'Required'; if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Valid email required'; if (f.message.trim().length < 10) x.message = 'Message is too short';
    setErr(x); if (Object.keys(x).length) return; setSent(true); notify('Message sent'); };
  const hours = [['Mon – Thu', '18:00 – 22:30'], ['Fri – Sat', '18:00 – 23:30'], ['Sunday', '17:00 – 22:00']];
  return (
    <div><PageHero eyebrow="Contact" title="We’d love to hear from you" image="/images/bar-emerald.jpg" />
      <section className="section"><div className="wrap split" style={{ alignItems: 'start' }}>
        {sent ? <div className="panel" style={{ textAlign: 'center' }}><h2>Thank you</h2><p className="muted" style={{ margin: '1rem 0' }}>Our team replies within one business day.</p><button className="btn" onClick={() => { setSent(false); setF({ ...f, message: '' }); }}>Send another</button></div> :
          <form className="panel" onSubmit={submit} noValidate>
            <div className="form-row"><div className="field"><label htmlFor="cn">Name</label><input id="cn" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />{err.name && <span className="err">{err.name}</span>}</div><div className="field"><label htmlFor="ce">Email</label><input id="ce" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />{err.email && <span className="err">{err.email}</span>}</div></div>
            <div className="field"><label htmlFor="cs">Subject</label><select id="cs" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>{['General enquiry', 'Private events', 'Press', 'Careers'].map((s) => <option key={s}>{s}</option>)}</select></div>
            <div className="field"><label htmlFor="cm">Message</label><textarea id="cm" rows="6" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />{err.message && <span className="err">{err.message}</span>}</div>
            <button className="btn solid">Send message</button></form>}
        <div className="grid"><div className="panel"><h3>Find us</h3><div className="divider" /><p className="muted">12 Gilded Avenue, Old Town<br />reservations@echoora.com<br />+1 (555) 014-2026</p></div>
          <div className="panel"><h3>Opening hours</h3><div className="divider" />{hours.map(([d, h]) => <p key={d} style={{ display: 'flex', justifyContent: 'space-between', margin: '.4rem 0' }}><span className="muted">{d}</span><span>{h}</span></p>)}</div>
          <div className="img-frame" style={{ maxWidth: 420 }}><img src="/images/interior-emerald.jpg" alt="Interior" style={{ aspectRatio: '16/10' }} /></div></div>
      </div></section></div>
  );
}
