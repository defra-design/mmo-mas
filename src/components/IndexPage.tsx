// src/components/IndexPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowClockwiseRegular } from '@fluentui/react-icons';
import { useTasks } from '../context/TaskContext';
import { asset } from '../utils/asset';

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
      height: '100vh',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif'
    }}>
      <img
        src={asset('images/Marine_Management_Organisation_logo.svg')}
        alt="Marine Management Organisation"
        style={{ height: '100px', width: 'auto', alignSelf: 'flex-start', marginBottom: '32px' }}
      />
      <h1 style={{
        fontSize: '32px',
        fontWeight: 600,
        marginBottom: '40px',
        color: '#323130',
        lineHeight: 1.2
      }}>
        Marine Applications System prototype
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#323130',
            margin: 0,
          }}>
            Receive and assess
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            {/* The current, in-progress iteration lives at the domain root. */}
            <Link
              to="/receive-assess"
              style={{ fontSize: '16px', color: '#0078d4', textDecoration: 'none', fontWeight: 400 }}
              onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { (e.target as HTMLElement).style.textDecoration = 'none'; }}
            >
              Iteration 2 (in progress)
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            {/* Frozen snapshot — a separate build served under /iteration-1/, so
                this is a plain full-page link, not a react-router route. */}
            <a
              href="/iteration-1/receive-assess"
              style={{ fontSize: '16px', color: '#0078d4', textDecoration: 'none', fontWeight: 400 }}
              onMouseOver={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { (e.target as HTMLElement).style.textDecoration = 'none'; }}
            >
              Iteration 1 (as usability-tested)
            </a>
          </div>
          <p style={{
            margin: '12px 0 0',
            fontSize: '14px',
            color: '#323130',
            lineHeight: 1.5,
            maxWidth: '640px',
          }}>
            MLA/2026/1002 is the active case.<br />
            After completing the tasks click ‘Clear saved data’ below to clear the saved data.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleReset}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#deecf9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6fc'; }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#eff6fc',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              fontSize: '16px',
              color: '#0078d4',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <ArrowClockwiseRegular fontSize={18} />
            Clear saved data
          </button>
          {justReset && (
            <span style={{ fontSize: '14px', color: '#107c10' }}>✓ Prototype data cleared</span>
          )}
        </div>
      </div>

      <div style={{
        marginTop: 'auto',
        marginBottom: '-20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* External link to the project documentation on GitHub (renders the
            markdown formatted); plain <a> since it's not an in-app route. */}
        <a
          href="https://github.com/defra-design/mmo-mas/blob/main/docs/design-and-development-guide.md"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '14px',
            color: '#323130',
            textDecoration: 'underline',
            fontWeight: 400,
          }}
        >
          Design and development guide
        </a>
        <Link
          to="/proof-of-concept"
          style={{
            fontSize: '14px',
            color: '#323130',
            textDecoration: 'underline',
            fontWeight: 400,
          }}
        >
          Proof of concept
        </Link>
      </div>
    </div>
  );
}
