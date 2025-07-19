// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ padding: '16px', fontSize: 14 }}>
        <h1 style={{ marginTop: 0 }}>D365 Prototype Shell</h1>
        <p>Fluent UI is wired up. Next we’ll add navigation, list view, and form layout.</p>
      </div>
    </FluentProvider>
  );
}