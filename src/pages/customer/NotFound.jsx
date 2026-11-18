import { Link } from 'react-router-dom';
export default function NotFound() {
  return <section className="section"><div className="wrap" style={{ textAlign: 'center' }}><p className="eyebrow">404</p><h1>This table is not set</h1><p className="lead" style={{ margin: '1rem auto 2rem' }}>The page you’re looking for doesn’t exist.</p><Link className="btn solid" to="/">Return home</Link></div></section>;
}
