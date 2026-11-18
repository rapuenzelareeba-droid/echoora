import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { PageHero, Empty, money } from '../../components/common/Bits.jsx';
export default function Cart() {
  const { cartLines, setQty, subtotal, clearCart } = useStore();
  const tax = subtotal * 0.08;
  return (
    <div>
      <PageHero eyebrow="Your order" title="Shopping cart" image="/images/table-setting.jpg" />
      <section className="section"><div className="wrap">
        {cartLines.length === 0 ? <Empty title="Your cart is empty" text="Add a few dishes to begin your order." action={<Link className="btn solid" to="/menu">Browse the menu</Link>} /> :
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
            <div className="panel tbl-wrap"><table><thead><tr><th>Dish</th><th>Price</th><th>Qty</th><th>Total</th><th /></tr></thead><tbody>
              {cartLines.map(({ id, item, qty }) => <tr key={id}><td style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><img src={item.image} alt="" width="64" height="64" style={{ objectFit: 'cover' }} /><Link to={`/menu/${id}`}>{item.name}</Link></td><td>{money(item.price)}</td>
                <td><div className="qty"><button onClick={() => setQty(id, qty - 1)} aria-label="Decrease">−</button><span>{qty}</span><button onClick={() => setQty(id, qty + 1)} aria-label="Increase">+</button></div></td><td className="gold">{money(item.price * qty)}</td><td><button className="btn sm danger" onClick={() => setQty(id, 0)}>Remove</button></td></tr>)}
            </tbody></table><p style={{ marginTop: '1rem' }}><button className="btn sm" onClick={clearCart}>Clear cart</button></p></div>
            <aside className="panel"><h3>Summary</h3><div className="divider" />
              {[['Subtotal', subtotal], ['Service tax (8%)', tax]].map(([l, v]) => <p key={l} style={{ display: 'flex', justifyContent: 'space-between', margin: '.5rem 0' }}><span className="muted">{l}</span><span>{money(v)}</span></p>)}
              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', margin: '1rem 0' }} className="gold"><span>Total</span><b>{money(subtotal + tax)}</b></p>
              <Link className="btn solid" to="/checkout" style={{ width: '100%', justifyContent: 'center' }}>Proceed to checkout</Link></aside>
          </div>}
      </div></section>
    </div>
  );
}
