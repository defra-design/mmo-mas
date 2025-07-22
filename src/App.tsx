// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Shell from './components/Shell';
import ListView from './components/ListView';
import CaseView from './components/CaseView';
import caseEntity from './config/entities/case.json';
import caseData from './mock-data/cases.json';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Router>
          <Shell>
            <div style={{ maxWidth: 1280 }}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <ListView
                      entityConfig={caseEntity}
                      items={caseData}
                      title="Active cases"
                      view="active"
                    />
                  } 
                />
                <Route 
                  path="/cases/:caseId" 
                  element={<CaseViewWrapper />} 
                />
              </Routes>
            </div>
          </Shell>
        </Router>
      </div>
    </FluentProvider>
  );
}

// Wrapper component to extract the caseId from URL params
function CaseViewWrapper() {
  const { caseId } = useParams<{ caseId: string }>();
  // Decode the URL-encoded case ID
  const decodedCaseId = caseId ? decodeURIComponent(caseId) : '';
  console.log('CaseViewWrapper - caseId from URL:', caseId);
  console.log('CaseViewWrapper - decoded caseId:', decodedCaseId);
  return <CaseView caseId={decodedCaseId} />;
}

export default App;