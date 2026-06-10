// src/components/IndexPage.tsx
import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div style={{ 
      padding: '60px 40px',
      backgroundColor: 'white',
      minHeight: '100vh',
      fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 600,
        marginBottom: '40px',
        color: '#323130',
        lineHeight: 1.2
      }}>
        MMO Marine Applications System prototype
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[
          { to: '/iteration1', label: 'Proof of concept' },
          { to: '/review-assess', label: 'Review and assess' },
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontSize: '18px',
              color: '#0078d4',
              textDecoration: 'none',
              fontWeight: 400,
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.textDecoration = 'none';
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
