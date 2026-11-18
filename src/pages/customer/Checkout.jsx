import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero, Empty, money } from '../../components/common/Bits.jsx';
export default function Checkout() {
  const { cartLines, subtotal, placeOrder } = useStore();
  const [f, setF] = useState({ name: '', email: '', phone: '', type: 'pickup', address: '', pay: 'card', card: '', tip: 0, notes: '' });
  const [errors, setErrors] = useState({}); const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const validate = () => { const e = {};
    if (f.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    if (f.type === 'delivery' && f.address.trim().length < 6) e.address = 'Delivery address required';
    if (f.pay === 'card' && f.card.replace(/\s/g, '').length < 12) e.card = 'Enter card number (demo: any 12+ digits)';
    setErrors(e); return !Object.keys(e).length; };
  const submit = (e) => { e.preventDefault(); if (!validate()) return;
    setDone(placeOrder({ customer: f.name, email: f.email, phone: f.phone, type: f.type, address: f.address, payment: f.pay, tip: Number(f.tip), notes: f.notes })); };
  if (done) return <section className="section"><div className="wrap" style={{ maxWidth: 640 }}><div className="panel" style={{ textAlign: 'center' }}><p className="eyebrow">Order confirmed</p><h2>Thank you, {done.customer.split(' ')[0]}</h2><div className="divider" style={{ margin: '1.2rem auto' }} /><p className="muted">Order <b className="gold">{done.id}</b> is with our kitchen. Total {money(done.total)}. A confirmation will be sent to {done.email}.</p><p style={{ marginTop: '2rem' }}><Link className="btn solid" to="/menu">Order more</Link></p></div></div></section>;
  if (!cartLines.length) return <section className="section"><div className="wrap"><Empty title="Nothing to check out" text="Your cart is empty." action={<Link className="btn solid" to="/menu">Browse menu</Link>} /></div></section>;
  const delivery = f.type === 'delivery' ? 6 : 0; const total = subtotal * 1.08 + delivery + Number(f.tip);
  const Err = ({ k }) => errors[k] ? <span className="err">{errors[k]}</span> : null;
  return (
    <div><PageHero eyebrow="Secure checkout" title="Complete your order" image="/images/dessert-dome.jpg" />
      <section className="section"><div className="wrap"><form onSubmit={submit} noValidate className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div className="panel">
          <h3>Your details</h3><div className="divider" />
          <div className="field"><label htmlFor="n">Full name</label><input id="n" value={f.name} onChange={set('name')} /><Err k="name" /></div>
          <div className="form-row"><div className="field"><label htmlFor="e">Email</label><input id="e" type="email" value={f.email} onChange={set('email')} /><Err k="email" /></div><div className="field"><label htmlFor="p">Phone</label><input id="p" value={f.phone} onChange={set('phone')} /><Err k="phone" /></div></div>
          <div className="field"><label>Service</label><div className="chips" style={{ margin: 0 }}>{['pickup', 'delivery'].map((t) => <button type="button" key={t} className={`chip ${f.type === t ? 'on' : ''}`} onClick={() => setF({ ...f, type: t })}>{t}</button>)}</div></div>
          {f.type === 'delivery' && <div className="field"><label htmlFor="a">Delivery address</label><input id="a" value={f.address} onChange={set('address')} /><Err k="address" /></div>}
          <div className="form-row"><div className="field"><label htmlFor="pay">Payment</label><select id="pay" value={f.pay} onChange={set('pay')}><option value="card">Card</option><option value="cash">Pay on arrival</option></select></div>
            <div className="field"><label htmlFor="tip">Tip</label><select id="tip" value={f.tip} onChange={set('tip')}>{[0, 2, 5, 10].map((t) => <option key={t} value={t}>{t ? money(t) : 'No tip'}</option>)}</select></div></div>
          {f.pay === 'card' && <div className="field"><label htmlFor="c">Card number (demo only, not stored)</label><input id="c" inputMode="numeric" value={f.card} onChange={set('card')} placeholder="4242 4242 4242 4242" /><Err k="card" /></div>}
          <div className="field"><label htmlFor="no">Order notes</label><textarea id="no" rows="3" value={f.notes} onChange={set('notes')} /></div>
        </div>
        <aside className="panel"><h3>Order summary</h3><div className="divider" />
          {cartLines.map((l) => <p key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', margin: '.4rem 0' }}><span className="muted">{l.qty}× {l.item.name}</span><span>{money(l.item.price * l.qty)}</span></p>)}
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '1rem 0' }} />
          <p style={{ display: 'flex', justifyContent: 'space-between' }}><span className="muted">Tax 8%</span><span>{money(subtotal * .08)}</span></p>
          {delivery > 0 && <p style={{ display: 'flex', justifyContent: 'space-between' }}><span className="muted">Delivery</span><span>{money(delivery)}</span></p>}
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', margin: '1rem 0' }} className="gold"><span>Total</span><b>{money(total)}</b></p>
          <button className="btn solid" style={{ width: '100%', justifyContent: 'center' }}>Place order</button></aside>
      </form></div></section></div>
  );
}
