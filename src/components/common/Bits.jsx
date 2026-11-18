import { Link } from 'react-router-dom';
export const Logo = ({ size = 42, text = true }) => (
  <Link to="/" className="logo" aria-label="ECHOORA home">
    <img src="/images/logo.jpg" width={size} height={size} alt="" style={{ borderRadius: '50%' }} />
    {text && <span>ECHOORA</span>}
  </Link>
);
export const Stars = ({ value, onChange, size = 18 }) => (
  <span className="stars" role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} style={{ fontSize: size }}
        className={n <= value ? 'on' : ''} aria-label={`${n} star${n > 1 ? 's' : ''}`}>★</button>
    ))}
  </span>
);
export const PageHero = ({ eyebrow, title, sub, image }) => (
  <header className="page-hero" style={{ backgroundImage: `linear-gradient(180deg,rgba(4,20,16,.72),rgba(4,20,16,.92)),url(${image})` }}>
    <div className="wrap">
      {eyebrow && <p className="eyebrow" data-hero>{eyebrow}</p>}
      <h1 data-hero>{title}</h1>
      {sub && <p className="lead" data-hero>{sub}</p>}
    </div>
  </header>
);
export const Empty = ({ title, text, action }) => (
  <div className="empty"><h3>{title}</h3><p>{text}</p>{action}</div>
);
export const money = (n) => `$${Number(n).toFixed(2)}`;
