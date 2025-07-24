// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Shell from './components/Shell';
import IndexPage from './components/IndexPage';
import ListView from './components/ListView';
import CaseView from './components/CaseView';
import caseEntity from './config/entities/case.json';
import caseData from './mock-data/cases.json';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Router>
          <Routes>
            {/* Clean index page without Shell */}
            <Route 
              path="/" 
              element={<IndexPage />} 
            />
            
            {/* D365 prototype pages with Shell */}
            <Route 
              path="/iteration1" 
              element={
                <Shell>
                  <ListView
                    entityConfig={caseEntity}
                    items={caseData}
                    title="Active cases"
                    view="active"
                  />
                </Shell>
              } 
            />
            <Route 
              path="/cases/:caseId" 
              element={
                <Shell>
                  <CaseViewWrapper />
                </Shell>
              } 
            />
          </Routes>
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