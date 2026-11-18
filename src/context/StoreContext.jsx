import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { seedMenu, seedReviews } from '../data/menu.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

function usePersisted(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [key, v]);
  return [v, setV];
}
const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export function StoreProvider({ children }) {
  const [menu, setMenu] = usePersisted('echoora.menu', seedMenu);
  const [cart, setCart] = usePersisted('echoora.cart', []);
  const [orders, setOrders] = usePersisted('echoora.orders', []);
  const [reservations, setReservations] = usePersisted('echoora.reservations', []);
  const [reviews, setReviews] = usePersisted('echoora.reviews', seedReviews);
  const [admin, setAdmin] = usePersisted('echoora.admin', false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg) => { setToast({ msg, k: Date.now() }); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const addToCart = (id, qty = 1) => {
    setCart((c) => c.some((i) => i.id === id) ? c.map((i) => i.id === id ? { ...i, qty: i.qty + qty } : i) : [...c, { id, qty }]);
    notify('Added to your order');
  };
  const setQty = (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => i.id === id ? { ...i, qty } : i));
  const clearCart = () => setCart([]);

  const cartLines = useMemo(() => cart.map((i) => ({ ...i, item: menu.find((m) => m.id === i.id) })).filter((l) => l.item), [cart, menu]);
  const subtotal = cartLines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const placeOrder = (details) => {
    const order = { id: 'ORD-' + Math.floor(1000 + Math.random() * 9000), createdAt: new Date().toISOString(), status: 'New',
      lines: cartLines.map((l) => ({ id: l.id, name: l.item.name, price: l.item.price, qty: l.qty })), subtotal, ...details };
    order.total = +(subtotal * 1.08 + (details.type === 'delivery' ? 6 : 0) + (details.tip || 0)).toFixed(2);
    setOrders((o) => [order, ...o]); clearCart(); return order;
  };
  const updateOrder = (id, status) => setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));

  const addReservation = (r) => { const res = { id: 'RSV-' + Math.floor(1000 + Math.random() * 9000), status: 'Pending', createdAt: new Date().toISOString(), ...r }; setReservations((x) => [res, ...x]); return res; };
  const updateReservation = (id, patch) => setReservations((x) => x.map((r) => r.id === id ? { ...r, ...patch } : r));

  const addReview = (r) => setReviews((x) => [{ id: uid('r'), date: new Date().toISOString().slice(0, 10), status: 'pending', ...r }, ...x]);
  const updateReview = (id, patch) => setReviews((x) => x.map((r) => r.id === id ? { ...r, ...patch } : r));
  const deleteReview = (id) => setReviews((x) => x.filter((r) => r.id !== id));

  const saveItem = (item) => setMenu((m) => m.some((x) => x.id === item.id) ? m.map((x) => x.id === item.id ? item : x) : [...m, item]);
  const deleteItem = (id) => setMenu((m) => m.filter((x) => x.id !== id));

  const login = (email, pass) => { const ok = email.trim().toLowerCase() === 'admin@echoora.com' && pass === 'echoora2026'; setAdmin(ok); return ok; };
  const logout = () => setAdmin(false);

  const value = { menu, cart, cartLines, subtotal, cartCount, addToCart, setQty, clearCart, orders, placeOrder, updateOrder,
    reservations, addReservation, updateReservation, reviews, addReview, updateReview, deleteReview, saveItem, deleteItem,
    admin, login, logout, toast, notify, uid };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
