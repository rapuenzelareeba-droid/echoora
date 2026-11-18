import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero, Empty } from '../../components/common/Bits.jsx';
import { TIME_SLOTS } from '../../data/menu.js';
export default function MyReservations() {
  const { reservations, updateReservation, notify } = useStore();
  const [email, setEmail] = useState(''); const [edit, setEdit] = useState(null);
  const mine = reservations.filter((r) => !email || r.email.toLowerCase() === email.toLowerCase());
  const save = () => { updateReservation(edit.id, { date: edit.date, time: edit.time, guests: Number(edit.guests), status: 'Pending' }); setEdit(null); notify('Reservation updated'); };
  return (
    <div><PageHero eyebrow="Your bookings" title="My reservations" image="/images/table-setting.jpg" />
      <section className="section"><div className="wrap">
        <div className="field" style={{ maxWidth: 420 }}><label htmlFor="fe">Filter by email</label><input id="fe" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        {mine.length === 0 ? <Empty title="No reservations yet" text="Book a table for an unforgettable evening." action={<Link to="/reservations" className="btn solid">Reserve a table</Link>} /> :
          <div className="grid g2" style={{ marginTop: '1.5rem' }}>{mine.map((r) => (
            <div className="panel" key={r.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>{r.id}</h3><span className={`badge b-${r.status}`}>{r.status}</span></div>
              {edit?.id === r.id ? <div style={{ marginTop: '1rem' }}>
                <div className="form-row"><input type="date" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} aria-label="Date" /><select value={edit.time} onChange={(e) => setEdit({ ...edit, time: e.target.value })} aria-label="Time">{TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}</select></div>
                <select style={{ margin: '1rem 0' }} value={edit.guests} onChange={(e) => setEdit({ ...edit, guests: e.target.value })} aria-label="Guests">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n}</option>)}</select>
                <button className="btn sm solid" onClick={save}>Save</button> <button className="btn sm" onClick={() => setEdit(null)}>Cancel</button></div> :
                <><p className="muted" style={{ margin: '.8rem 0' }}>{r.name} · {r.guests} guests<br />{r.date} at {r.time}{r.occasion && <><br />Occasion: {r.occasion}</>}</p>
                  {r.status !== 'Cancelled' && r.status !== 'Completed' && <div style={{ display: 'flex', gap: '.6rem' }}><button className="btn sm" onClick={() => setEdit({ ...r })}>Modify</button><button className="btn sm danger" onClick={() => { updateReservation(r.id, { status: 'Cancelled' }); notify('Reservation cancelled'); }}>Cancel</button></div>}</>}
            </div>))}</div>}
      </div></section></div>
  );
}
