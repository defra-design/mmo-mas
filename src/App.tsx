// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Shell from './components/Shell';
import ListView from './components/ListView';
import caseEntity from './config/entities/case.json';
import caseData from './mock-data/cases.json';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Shell>
          <div style={{ maxWidth: 1280 }}>
            <ListView
              entityConfig={caseEntity}
              items={caseData}
              title="Active cases"
              view="active"
            />
          </div>
        </Shell>
      </div>
    </FluentProvider>
  );
}

export default App;