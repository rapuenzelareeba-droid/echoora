import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero } from '../../components/common/Bits.jsx';
import { TIME_SLOTS } from '../../data/menu.js';
const today = () => new Date().toISOString().slice(0, 10);
export default function Reservations() {
  const { reservations, addReservation } = useStore();
  const [f, setF] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: 2, occasion: '', notes: '' });
  const [errors, setErrors] = useState({}); const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const taken = (t) => reservations.filter((r) => r.date === f.date && r.time === t && r.status !== 'Cancelled').reduce((s, r) => s + Number(r.guests), 0) >= 24;
  const submit = (e) => { e.preventDefault(); const er = {};
    if (f.name.trim().length < 2) er.name = 'Name required'; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Valid email required';
    if (f.phone.replace(/\D/g, '').length < 7) er.phone = 'Valid phone required'; if (!f.date || f.date < today()) er.date = 'Choose today or a future date'; if (!f.time) er.time = 'Select a time';
    setErrors(er); if (Object.keys(er).length) return; setDone(addReservation({ ...f, guests: Number(f.guests) })); };
  if (done) return <section className="section"><div className="wrap" style={{ maxWidth: 640 }}><div className="panel" style={{ textAlign: 'center' }}><p className="eyebrow">Request received</p><h2>See you soon, {done.name.split(' ')[0]}</h2><div className="divider" style={{ margin: '1.2rem auto' }} /><p className="muted">Booking <b className="gold">{done.id}</b> — {done.guests} guests on {done.date} at {done.time}. Status: pending confirmation.</p><p style={{ marginTop: '2rem' }}><Link className="btn solid" to="/my-reservations">View my reservations</Link></p></div></div></section>;
  const E = ({ k }) => errors[k] ? <span className="err">{errors[k]}</span> : null;
  return (
    <div><PageHero eyebrow="Reservations" title="Reserve your table" sub="Tables are held for 15 minutes. Parties of 9+ please call us." image="/images/dining-green.jpg" />
      <section className="section"><div className="wrap split" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={submit} noValidate>
          <div className="field"><label htmlFor="rn">Full name</label><input id="rn" value={f.name} onChange={set('name')} /><E k="name" /></div>
          <div className="form-row"><div className="field"><label htmlFor="re">Email</label><input id="re" type="email" value={f.email} onChange={set('email')} /><E k="email" /></div><div className="field"><label htmlFor="rp">Phone</label><input id="rp" value={f.phone} onChange={set('phone')} /><E k="phone" /></div></div>
          <div className="form-row"><div className="field"><label htmlFor="rd">Date</label><input id="rd" type="date" min={today()} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value, time: '' })} /><E k="date" /></div>
            <div className="field"><label htmlFor="rg">Guests</label><select id="rg" value={f.guests} onChange={set('guests')}>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}</select></div></div>
          <div className="field"><label>Time</label><div className="slots">{TIME_SLOTS.map((t) => <button type="button" key={t} disabled={!f.date || taken(t)} className={`slot ${f.time === t ? 'on' : ''}`} onClick={() => setF({ ...f, time: t })}>{t}</button>)}</div>{!f.date && <span className="muted" style={{ fontSize: '.8rem' }}>Pick a date to see availability.</span>}<E k="time" /></div>
          <div className="field"><label htmlFor="ro">Occasion</label><select id="ro" value={f.occasion} onChange={set('occasion')}><option value="">None</option><option>Birthday</option><option>Anniversary</option><option>Business dinner</option></select></div>
          <div className="field"><label htmlFor="rno">Notes / dietary needs</label><textarea id="rno" rows="3" value={f.notes} onChange={set('notes')} /></div>
          <button className="btn solid">Request reservation</button>
        </form>
        <div><div className="img-frame"><img src="/images/bar-emerald.jpg" alt="Emerald dining room" /></div>
          <div className="panel" style={{ marginTop: '2.5rem' }}><h3>Good to know</h3><ul className="muted" style={{ paddingLeft: '1.2rem', marginTop: '.8rem' }}><li>Dinner service 18:00 – 23:00 daily</li><li>Smart-elegant dress code</li><li>Free cancellation up to 4 hours before</li><li>Manage bookings in <Link className="gold" to="/my-reservations">My Reservations</Link></li></ul></div></div>
      </div></section></div>
  );
}
