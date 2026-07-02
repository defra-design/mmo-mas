// src/components/Shell.tsx
import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import Nav from './Nav';
import '../App.css';

/* ---------- Navigation types ------------------------------------------ */

interface ShellNavItem {
  name: string;
  key: string;
  url?: string;
  icon?: string;
  children?: ShellNavItem[];
}
interface ShellNavGroup {
  name?: string;
  items: ShellNavItem[];
}

/* ---------- Navigation groups ----------------------------------------- */

const navGroups: ShellNavGroup[] = [
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

/* ---------- Receive and assess journey navigation ---------------------- */

export const reviewAssessNavGroups: ShellNavGroup[] = [
  {
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
    name: 'My work',
    items: [
      { name: 'Applications dashboard', key: 'dashboard', url: '#', icon: 'BIDashboard' },
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
      { name: 'Marine licence cases', key: 'marine-licence-cases', url: '#', icon: 'Repair' },
      { name: 'Exemption cases', key: 'exemption-cases', url: '#', icon: 'Documentation' },
      { name: 'Case Coastal Operations Areas', key: 'coastal-ops', url: '#', icon: 'MapPin' },
      { name: 'Case Marine Plan Areas', key: 'marine-plan-areas', url: '#', icon: 'MapPin' },
    ],
  },
];

/* ---------- Shell layout ---------------------------------------------- */

interface ShellProps {
  navGroups?: ShellNavGroup[];
  selectedKey?: string;
}

// Nav keys that map to a real route; everything else is a dead link.
const navRoutes: Record<string, string> = {
  cases: '/proof-of-concept',
  'marine-licence-cases': '/receive-assess',
};

export default function Shell({
  children,
  navGroups: groups = navGroups,
  selectedKey = 'cases',
}: PropsWithChildren<ShellProps>) {
  const navigate = useNavigate();
  // Home links to the section's case list: the Marine licence cases list in
  // Receive and assess, the Active cases list in the Proof of concept.
  const homeRoute = groups === reviewAssessNavGroups ? '/receive-assess' : '/proof-of-concept';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Nav
          groups={groups}
          selectedKey={selectedKey}
          onLinkClick={(key: string) => {
            if (key === 'home') navigate(homeRoute);
            else if (navRoutes[key]) navigate(navRoutes[key]);
          }}
        />

        <main style={{ 
          flexGrow: 1, 
          backgroundColor: '#fafafa',
          overflow: 'auto',
          minHeight: 0,
          paddingLeft: '20px',
          paddingRight: '20px'
        }}>
          {children}
        </main>

        {/* Right sidebar panel matching D365 */}
        <aside style={{
          width: '30px',
          backgroundColor: '#f3f2f1',
          borderLeft: '1px solid #e1e1e1',
          flexShrink: 0
        }}>
          {/* Right panel content could go here */}
        </aside>
      </div>
    </div>
  );
}