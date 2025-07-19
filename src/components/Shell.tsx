// src/components/Shell.tsx
import { PropsWithChildren } from 'react';
import { Nav, getTheme } from '@fluentui/react';          // runtime code only
import type { INavStyles, INavLinkGroup } from '@fluentui/react'; // ← types only
import TopBar from './TopBar';

/* ---------- Styles ----------------------------------------------------- */

const theme = getTheme();

const navStyles: Partial<INavStyles> = {
  root: {
    width: 230,
    height: '100%',
    background: 'linear-gradient(#f5f4f3 0%, #f3f2f1 60%)',
    borderRight: '1px solid #ddd',
    paddingTop: 4,
    selectors: {
      '.ms-Nav-groupHeader': {
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        color: '#616161',
        padding: '12px 16px 4px',
        borderBottom: '1px solid #e1dfdd',
      },
    },
  },
  link: {
    height: 32,
    padding: '0 12px 0 20px',
    fontSize: 14,
    color: '#605E5C',
    selectors: {
      ':hover': {
        color: '#201F1E',
        background: '#edebe9',
        borderLeft: '3px solid #edebe9',
      },
      '.ms-Nav-compositeLink:hover .ms-Nav-icon': { color: '#201F1E' },
    },
  },
  linkIsSelected: {
    background: '#ffffff',
    borderLeft: '3px solid #0078d4',
    color: theme.palette.neutralPrimary,
    selectors: {
      '.ms-Nav-icon': { color: theme.palette.themePrimary },
    },
  },
  chevronButton: {
    selectors: {
      '.ms-Button-icon': { color: '#616161' },
      ':hover .ms-Button-icon': { color: '#201F1E' },
    },
  },
};

/* ---------- Navigation groups ----------------------------------------- */

const groups: INavLinkGroup[] = [
  {
    links: [
      { name: 'Home', key: 'home', url: '#', icon: 'Home' },
      { name: 'Recent', key: 'recent', url: '#', icon: 'Clock' },
      { name: 'Pinned', key: 'pinned', url: '#', icon: 'Pinned' },
    ],
  },
  {
    name: 'My Work',
    collapseByDefault: false,
    links: [
      { name: 'Tier 1 Dashboard', key: 'dashboard', url: '#', icon: 'BIDashboard' },
    ],
  },
  {
    name: 'Customers',
    collapseByDefault: false,
    links: [
      { name: 'Organisations', key: 'orgs', url: '#', icon: 'CompanyDirectory' },
      { name: 'Applicants', key: 'applicants', url: '#', icon: 'Contact' },
    ],
  },
  {
    name: 'Service',
    collapseByDefault: false,
    links: [
      { name: 'Cases', key: 'cases', url: '#', icon: 'CaseWrapped' },
    ],
  },
];

/* ---------- Shell layout ---------------------------------------------- */

export default function Shell({ children }: PropsWithChildren) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Nav
          selectedKey="cases"
          ariaLabel="Main navigation"
          styles={navStyles}
          groups={groups}
        />

        <main style={{ flexGrow: 1, padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}