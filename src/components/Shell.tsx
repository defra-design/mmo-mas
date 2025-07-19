// src/components/Shell.tsx
import { PropsWithChildren } from 'react';
import { Nav } from '@fluentui/react';

/* Simple styling for a Dynamics-style chrome */
const navStyles = {
  root: {
    width: 220,
    height: '100vh',
    boxSizing: 'border-box',
    borderRight: '1px solid #eee',
    padding: '8px 0',
  },
};

const linkGroups = [
  {
    links: [
      { name: 'Cases', key: 'cases', url: '#' },
      { name: 'Applicants', key: 'applicants', url: '#' },
      // add more links later as needed
    ],
  },
];

export default function Shell({ children }: PropsWithChildren) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Nav
        ariaLabel="Main navigation"
        selectedKey="cases"
        styles={navStyles}
        groups={linkGroups}
      />
      <main style={{ flexGrow: 1, padding: 24 }}>{children}</main>
    </div>
  );
}