// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ListView from './components/ListView';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ padding: 24 }}>
        <h1 style={{ marginTop: 0 }}>Active Exempt-Activity Cases</h1>
        <ListView />
      </div>
    </FluentProvider>
  );
}