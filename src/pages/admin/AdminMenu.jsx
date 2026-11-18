import { useState } from 'react';
import { useStore } from '../../context/StoreContext.jsx';
import { money } from '../../components/common/Bits.jsx';
import { CATEGORIES } from '../../data/menu.js';
const blank = { name: '', category: 'Mains', price: '', desc: '', image: '/images/tasting-spread.jpg', tags: [], spice: 0, time: '15 min', ingredients: [], calories: 0, available: true, featured: false };
export default function AdminMenu() {
  const { menu, saveItem, deleteItem, notify, uid } = useStore(); const [ed, setEd] = useState(null); const [err, setErr] = useState('');
  const save = (e) => { e.preventDefault(); if (ed.name.trim().length < 3 || !(Number(ed.price) > 0)) return setErr('Name (3+ chars) and a positive price are required.');
    const id = ed.id || ed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || uid('m');
    saveItem({ ...ed, id, price: Number(ed.price), tags: typeof ed.tags === 'string' ? ed.tags.split(',').map((s) => s.trim()).filter(Boolean) : ed.tags, ingredients: typeof ed.ingredients === 'string' ? ed.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : ed.ingredients });
    setEd(null); setErr(''); notify('Menu item saved'); };
  const f = (k) => (e) => setEd({ ...ed, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (<div><div className="admin-top"><div><p className="eyebrow">Catalogue</p><h1 style={{ fontSize: '2.4rem' }}>Menu manager</h1></div><button className="btn solid" onClick={() => setEd({ ...blank })}>+ New dish</button></div>
    {ed && <form className="panel" onSubmit={save} style={{ marginBottom: '1.6rem' }}><h3>{ed.id ? 'Edit dish' : 'New dish'}</h3><div className="divider" />
      <div className="form-row"><div className="field"><label htmlFor="mn">Name</label><input id="mn" value={ed.name} onChange={f('name')} /></div><div className="field"><label htmlFor="mp">Price ($)</label><input id="mp" type="number" step="0.5" value={ed.price} onChange={f('price')} /></div></div>
      <div className="form-row"><div className="field"><label htmlFor="mc">Category</label><select id="mc" value={ed.category} onChange={f('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div><div className="field"><label htmlFor="mi">Image path</label><input id="mi" value={ed.image} onChange={f('image')} /></div></div>
      <div className="field"><label htmlFor="md">Description</label><textarea id="md" rows="2" value={ed.desc} onChange={f('desc')} /></div>
      <div className="form-row"><div className="field"><label htmlFor="mt">Tags (comma separated)</label><input id="mt" value={Array.isArray(ed.tags) ? ed.tags.join(', ') : ed.tags} onChange={f('tags')} /></div><div className="field"><label htmlFor="mg">Ingredients (comma separated)</label><input id="mg" value={Array.isArray(ed.ingredients) ? ed.ingredients.join(', ') : ed.ingredients} onChange={f('ingredients')} /></div></div>
      <p style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}><label><input type="checkbox" style={{ width: 'auto', marginRight: 8 }} checked={ed.available} onChange={f('available')} />Available</label><label><input type="checkbox" style={{ width: 'auto', marginRight: 8 }} checked={ed.featured} onChange={f('featured')} />Featured on home</label></p>
      {err && <p className="err">{err}</p>}<button className="btn solid">Save</button> <button type="button" className="btn" onClick={() => setEd(null)}>Cancel</button></form>}
    <div className="panel tbl-wrap"><table><thead><tr><th /><th>Dish</th><th>Category</th><th>Price</th><th>Status</th><th /></tr></thead><tbody>{menu.map((m) => <tr key={m.id}>
      <td><img src={m.image} alt="" width="52" height="52" style={{ objectFit: 'cover' }} /></td><td>{m.name}{m.featured && <span className="badge" style={{ marginLeft: 8, color: '#9a7a30' }}>Featured</span>}</td><td>{m.category}</td><td>{money(m.price)}</td>
      <td><button className="btn sm" onClick={() => saveItem({ ...m, available: !m.available })}>{m.available ? 'Available' : 'Hidden'}</button></td>
      <td style={{ whiteSpace: 'nowrap' }}><button className="btn sm" onClick={() => setEd({ ...m })}>Edit</button> <button className="btn sm danger" onClick={() => window.confirm(`Delete “${m.name}”?`) && deleteItem(m.id)}>Delete</button></td></tr>)}</tbody></table></div></div>);
}
