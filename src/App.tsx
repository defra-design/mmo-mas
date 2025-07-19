// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Shell from './components/Shell';
import HeaderRow from './components/HeaderRow';
import CommandBar from './components/CommandBar';
import ListView from './components/ListView';
import './App.css';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Shell>

        {/* NEW: title and command bar share one flex row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="pageTitle">Active cases</h1>
          <CommandBar />
        </div>

        <HeaderRow />
        <ListView />
      </Shell>
    </FluentProvider>
  );
}