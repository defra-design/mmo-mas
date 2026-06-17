// src/components/IndexPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';

export default function IndexPage() {
  const { resetAll } = useTasks();
  const [justReset, setJustReset] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all prototype data and start afresh? This clears the Site check answers and task statuses.')) {
      resetAll();
      setJustReset(true);
      setTimeout(() => setJustReset(false), 3000);
    }
  };

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <Link
            to="/review-assess"
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
            Review and assess
          </Link>
          <p style={{
            margin: '12px 0 0',
            fontSize: '14px',
            color: '#323130',
            lineHeight: 1.5,
            maxWidth: '640px',
          }}>
            MLA/2026/1002 is the active case.<br />
            After completing the tasks click ‘Reset prototype data’ below to clear the saved data.
          </p>
        </div>

        <Link
          to="/iteration1"
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
          Proof of concept
        </Link>
      </div>

      <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '14px',
            color: '#605e5c',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontFamily: 'inherit',
          }}
        >
          Reset prototype data
        </button>
        {justReset && (
          <span style={{ fontSize: '14px', color: '#107c10' }}>✓ Prototype data cleared</span>
        )}
      </div>
    </div>
  );
}
