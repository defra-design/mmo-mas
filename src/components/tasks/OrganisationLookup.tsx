// src/components/tasks/OrganisationLookup.tsx
// Simulates the OOB D365 Lookup control (lookup to Organisation / Account).
// Built from Fluent Input + a results flyout — NOT a Combobox, and NOT a PCF.
// In the real build this is the native model-driven Lookup; no custom control needed.
//
// The results flyout is portalled to document.body with fixed positioning so it
// isn't clipped by parent overflow. Colours are hardcoded (not Fluent tokens)
// because body sits outside FluentProvider — tokens would fall through to the
// Vite :root light-on-dark defaults and make the list unreadable.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  mergeClasses,
} from '@fluentui/react-components';
import {
  SearchRegular,
  DismissRegular,
  DocumentRegular,
} from '@fluentui/react-icons';
// Seed Organisation (Account) records a real lookup view would return.
// Kept in mock-data (not exported from this component file) so the module only
// exports the component — fast refresh / react-refresh lint requires that.
import organisationOptions from '../../mock-data/organisations.json';

// D365 colour tokens (same as CLAUDE.md) — used on the portalled flyout only.
const D365 = {
  text: '#323130',
  textSecondary: '#605e5c',
  brand: '#0078d4',
  border: '#e1dfdd',
  hover: '#edebe9',
  white: '#ffffff',
};

type FlyoutPos = { top: number; left: number; width: number };

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '100%',
    minWidth: 0,
  },
  field: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    minHeight: '32px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding('0', tokens.spacingHorizontalS),
    ...shorthands.borderBottom('2px', 'solid', 'transparent'),
    boxSizing: 'border-box',
  },
  fieldOpen: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('2px', 'solid', '#0078d4'),
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    maxWidth: '70%',
    flexShrink: 0,
    ...shorthands.padding('2px', tokens.spacingHorizontalXS),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    borderRadius: tokens.borderRadiusSmall,
  },
  pillLink: {
    color: '#0078d4',
    fontSize: tokens.fontSizeBase300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textDecoration: 'none',
    ':hover': { textDecoration: 'underline' },
  },
  clearBtn: {
    minWidth: '20px',
    width: '20px',
    height: '20px',
    color: tokens.colorNeutralForeground3,
  },
  input: {
    flexGrow: 1,
    minWidth: 0,
    height: '28px',
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: tokens.fontSizeBase300,
    fontFamily: 'inherit',
    color: tokens.colorNeutralForeground1,
    '::placeholder': { color: tokens.colorNeutralForeground3 },
  },
  searchBtn: {
    minWidth: '28px',
    width: '28px',
    height: '28px',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
});

interface OrganisationLookupProps {
  value: string;
  onSelect: (value: string) => void;
}

export default function OrganisationLookup({ value, onSelect }: OrganisationLookupProps) {
  const styles = useStyles();
  const rootRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [pos, setPos] = useState<FlyoutPos | null>(null);
  // Empty lookup reads "---" at rest; "Look for Organisations" only on hover or
  // while open — same placeholder swap OutcomeDropdown uses for "--Select--".
  const placeholder = hover || open ? 'Look for Organisations' : '---';

  const updatePos = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      top: rect.bottom + 2,
      left: rect.left,
      width: Math.max(rect.width, 340),
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    updatePos();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setShowAll(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onMove = () => updatePos();
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || flyoutRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const filtered = organisationOptions.filter(org =>
    org.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const recent = filtered.slice(0, 3);
  const results = showAll || query.trim() ? filtered : recent;

  const pick = (org: string) => {
    onSelect(org);
    setOpen(false);
    setQuery('');
  };

  const clear = () => {
    onSelect('');
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Inline styles on the portalled flyout so Vite's :root / button defaults
  // (white text, dark buttons) cannot wash out the D365 lookup look.
  const flyout =
    open &&
    pos &&
    createPortal(
      <div
        ref={flyoutRef}
        role="listbox"
        aria-label="Organisations"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: 10000,
          minWidth: 340,
          maxHeight: 320,
          overflowY: 'auto',
          backgroundColor: D365.white,
          border: `1px solid ${D365.border}`,
          borderRadius: 4,
          boxShadow: '0 6.4px 14.4px rgba(0,0,0,0.13), 0 1.2px 3.6px rgba(0,0,0,0.11)',
          padding: '4px 0',
          color: D365.text,
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize: 14,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 12px',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: D365.textSecondary }}>
            {showAll || query.trim() ? 'Organisations' : 'Recent Organisations'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              disabled
              title="New record — OOB Lookup action (not wired in this prototype)"
              style={{
                height: 24,
                padding: '0 8px',
                fontSize: 12,
                fontFamily: 'inherit',
                color: D365.textSecondary,
                backgroundColor: D365.white,
                border: `1px solid ${D365.border}`,
                borderRadius: 2,
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              New record
            </button>
            <button
              type="button"
              onClick={() => setShowAll(true)}
              style={{
                height: 24,
                padding: '0 8px',
                fontSize: 12,
                fontFamily: 'inherit',
                color: D365.text,
                backgroundColor: D365.white,
                border: `1px solid ${D365.border}`,
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              All records
            </button>
          </div>
        </div>
        {results.length === 0 ? (
          <div style={{ padding: '12px', color: D365.textSecondary }}>No records found.</div>
        ) : (
          results.map(org => (
            <button
              key={org}
              type="button"
              role="option"
              onClick={() => pick(org)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = D365.hover;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderRadius: 0,
                backgroundColor: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: 14,
                fontFamily: 'inherit',
                fontWeight: 400,
                color: D365.text,
              }}
            >
              <DocumentRegular style={{ color: D365.textSecondary, fontSize: 16, flexShrink: 0 }} />
              {org}
            </button>
          ))
        )}
      </div>,
      document.body,
    );

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        className={mergeClasses(styles.field, open && styles.fieldOpen)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => {
          if (!open) {
            setOpen(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }
        }}
      >
        {value && !open && (
          <span className={styles.pill}>
            <DocumentRegular style={{ color: D365.textSecondary, fontSize: 16 }} />
            <a
              className={styles.pillLink}
              href="#"
              onClick={e => e.preventDefault()}
              title={value}
            >
              {value}
            </a>
            <Button
              className={styles.clearBtn}
              appearance="transparent"
              icon={<DismissRegular />}
              aria-label="Remove Organisation"
              onClick={e => {
                e.stopPropagation();
                clear();
              }}
            />
          </span>
        )}
        {(open || !value) && (
          <input
            ref={inputRef}
            className={styles.input}
            placeholder={placeholder}
            value={query}
            aria-label="Look for Organisations"
            onFocus={() => setOpen(true)}
            onChange={e => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Escape') setOpen(false);
              if (e.key === 'Enter' && results[0]) {
                e.preventDefault();
                pick(results[0]);
              }
            }}
          />
        )}
        <Button
          className={styles.searchBtn}
          appearance="transparent"
          icon={<SearchRegular />}
          aria-label="Search Organisations"
          onClick={e => {
            e.stopPropagation();
            setOpen(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        />
      </div>
      {flyout}
    </div>
  );
}
