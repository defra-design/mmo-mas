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
        Get permission for marine work prototype
      </h1>
      
      <div>
        <Link 
          to="/iteration1" 
          style={{
            fontSize: '18px',
            color: '#0078d4',
            textDecoration: 'none',
            fontWeight: 400
          }}
          onMouseOver={(e) => {
            (e.target as HTMLElement).style.textDecoration = 'underline';
          }}
          onMouseOut={(e) => {
            (e.target as HTMLElement).style.textDecoration = 'none';
          }}
        >
          Iteration 1
        </Link>
      </div>
    </div>
  );
}
