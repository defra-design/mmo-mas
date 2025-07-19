// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Shell from './components/Shell';
import HeaderRow from './components/HeaderRow';      // ← new
import CommandBar from './components/CommandBar';
import ListView from './components/ListView';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Shell>
        <h1 style={{ marginTop: 0 }}>Active cases</h1>
        <HeaderRow />                                 {/* ← new */}
        <CommandBar />
        <ListView />
      </Shell>
    </FluentProvider>
  );
}