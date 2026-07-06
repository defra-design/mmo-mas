// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Shell, { reviewAssessNavGroups } from './components/Shell';
import IndexPage from './components/IndexPage';
import ListView from './components/ListView';
import CaseView from './components/CaseView';
import MarineLicenceListView from './components/MarineLicenceListView';
import MarineCaseSummary from './components/MarineCaseSummary';
import SiteCheckTask from './components/tasks/SiteCheckTask';
import WfdTask from './components/tasks/WfdTask';
import MarinePlanPolicyTask from './components/tasks/MarinePlanPolicyTask';
import { TaskProvider } from './context/TaskContext';
import caseEntity from './config/entities/case.json';
import caseData from './mock-data/cases.json';
import marineLicenceEntity from './config/entities/marine-licence-case.json';
import marineLicenceData from './mock-data/marine-licence-cases.json';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
          <TaskProvider>
            <Routes>
              {/* Clean index page without Shell */}
              <Route path="/" element={<IndexPage />} />

              {/* Proof of concept journey */}
              <Route
                path="/proof-of-concept"
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

              {/* Receive and assess journey */}
              <Route
                path="/receive-assess"
                element={
                  <Shell navGroups={reviewAssessNavGroups} selectedKey="marine-licence-cases">
                    <MarineLicenceListView
                      entityConfig={marineLicenceEntity}
                      items={marineLicenceData}
                      title="Marine licence cases"
                    />
                  </Shell>
                }
              />
              <Route
                path="/receive-assess/cases/:caseId"
                element={
                  <Shell navGroups={reviewAssessNavGroups} selectedKey="marine-licence-cases">
                    <MarineCaseWrapper render={(id) => <MarineCaseSummary caseId={id} />} />
                  </Shell>
                }
              />
              <Route
                path="/receive-assess/cases/:caseId/tasks/site-check"
                element={
                  <Shell navGroups={reviewAssessNavGroups} selectedKey="marine-licence-cases">
                    <MarineCaseWrapper render={(id) => <SiteCheckTask caseId={id} />} />
                  </Shell>
                }
              />
              <Route
                path="/receive-assess/cases/:caseId/tasks/wfd"
                element={
                  <Shell navGroups={reviewAssessNavGroups} selectedKey="marine-licence-cases">
                    <MarineCaseWrapper render={(id) => <WfdTask caseId={id} />} />
                  </Shell>
                }
              />
              <Route
                path="/receive-assess/cases/:caseId/tasks/marine-plan-policies/:policyCode"
                element={
                  <Shell navGroups={reviewAssessNavGroups} selectedKey="marine-licence-cases">
                    <MarineCaseWrapper render={(id) => <MarinePlanPolicyTask caseId={id} />} />
                  </Shell>
                }
              />
            </Routes>
          </TaskProvider>
        </Router>
      </div>
    </FluentProvider>
  );
}

// Wrapper component to extract the caseId from URL params
function CaseViewWrapper() {
  const { caseId } = useParams<{ caseId: string }>();
  const decodedCaseId = caseId ? decodeURIComponent(caseId) : '';
  return <CaseView caseId={decodedCaseId} />;
}

// Shared wrapper that decodes the caseId for review-and-assess pages.
function MarineCaseWrapper({ render }: { render: (caseId: string) => JSX.Element }) {
  const { caseId } = useParams<{ caseId: string }>();
  const decodedCaseId = caseId ? decodeURIComponent(caseId) : '';
  return render(decodedCaseId);
}

export default App;