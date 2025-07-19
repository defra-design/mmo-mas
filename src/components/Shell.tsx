// src/components/Shell.tsx
import type { PropsWithChildren } from 'react';
import TopBar from './TopBar';
import Nav from './Nav';
import '../App.css';

/* ---------- Navigation groups ----------------------------------------- */

const navGroups = [
  {
    // First group - no header
    items: [
      { name: 'Home', key: 'home', url: '#', icon: 'Home' },
      {
        name: 'Recent',
        key: 'recent',
        icon: 'Clock',
        children: [
          { name: 'Recent Item 1', key: 'recent1', url: '#' },
          { name: 'Recent Item 2', key: 'recent2', url: '#' },
        ],
      },
      {
        name: 'Pinned',
        key: 'pinned',
        icon: 'Pinned',
        children: [
          { name: 'Pinned Item 1', key: 'pinned1', url: '#' },
          { name: 'Pinned Item 2', key: 'pinned2', url: '#' },
        ],
      },
    ],
  },
  {
    name: 'My Work',
    items: [
      { name: 'Tier 1 Dashboard', key: 'dashboard', url: '#', icon: 'BIDashboard' },
    ],
  },
  {
    name: 'Customers',
    items: [
      { name: 'Organisations', key: 'orgs', url: '#', icon: 'CompanyDirectory' },
      { name: 'Applicants', key: 'applicants', url: '#', icon: 'Contact' },
    ],
  },
  {
    name: 'Service',
    items: [
      { name: 'Cases', key: 'cases', url: '#', icon: 'Repair' },
    ],
  },
];

/* ---------- Shell layout ---------------------------------------------- */

export default function Shell({ children }: PropsWithChildren) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Nav
          groups={navGroups}
          selectedKey="cases"
          onLinkClick={(key: string) => console.log('Clicked:', key)}
        />

        <main style={{ 
          flexGrow: 1, 
          padding: '0 28px', 
          backgroundColor: '#fff',
          overflow: 'auto',
          minHeight: 0
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}