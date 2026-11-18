import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import gsap from 'gsap';
import { Logo } from '../components/common/Bits.jsx';
import { useStore } from '../context/StoreContext.jsx';
import ChatWidget from '../components/customer/ChatWidget.jsx';

const links = [['/', 'Home'], ['/our-story', 'Our Story'], ['/menu', 'Menu'], ['/reservations', 'Reserve'], ['/reviews', 'Reviews'], ['/ai-feedback', 'AI Feedback'], ['/contact', 'Contact']];

export default function CustomerLayout() {
  const { pathname } = useLocation();
  const { cartCount, toast } = useStore();
  const [open, setOpen] = useState(false);
  const main = useRef(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0); setOpen(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(main.current, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' });
      gsap.from('[data-hero]', { opacity: 0, y: 30, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="site">
      <nav className="nav">
        <div className="wrap nav-in">
          <Logo />
          <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">{open ? '✕' : '☰'}</button>
          <ul className={open ? 'open' : ''}>
            {links.map(([to, label]) => <li key={to}><NavLink to={to} end={to === '/'}>{label}</NavLink></li>)}
            <li><NavLink to="/my-reservations">My Bookings</NavLink></li>
          </ul>
          <Link to="/cart" className="cart-btn" aria-label={`Cart, ${cartCount} items`}>Order <b>{cartCount}</b></Link>
        </div>
      </nav>
      <main ref={main}><Outlet /></main>
      <footer className="footer">
        <div className="wrap foot-grid">
          <div><Logo /><p className="muted">Modern European fine dining in an emerald-lit room. Open daily 18:00 – 23:00.</p></div>
          <div><h4>Explore</h4>{links.slice(1, 5).map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</div>
          <div><h4>Guests</h4><Link to="/my-reservations">My Reservations</Link><Link to="/cart">Cart</Link><Link to="/admin/login">Staff Login</Link></div>
          <div><h4>Visit</h4><p className="muted">12 Gilded Avenue<br/>reservations@echoora.com<br/>+1 (555) 014-2026</p></div>
        </div>
        <p className="copy">© 2026 ECHOORA. All rights reserved.</p>
      </footer>
      <ChatWidget />
      {toast && <div className="toast" role="status" key={toast.k}>{toast.msg}</div>}
    </div>
  );
}
