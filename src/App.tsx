// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Shell from './components/Shell';
import ListView from './components/ListView';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Shell>
        <h1 style={{ marginTop: 0 }}>Active cases</h1>
        <ListView />
      </Shell>
    </FluentProvider>
  );
}