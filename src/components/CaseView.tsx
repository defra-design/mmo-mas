// src/components/CaseView.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pivot, PivotItem, Text } from '@fluentui/react';
import caseDetailsData from '../mock-data/case-details.json';

interface CaseViewProps {
  caseId: string;
}

export default function CaseView({ caseId }: CaseViewProps) {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);

  useEffect(() => {
    console.log('CaseView - received caseId:', caseId);
    // Load case data from JSON
    const data = caseDetailsData[caseId as keyof typeof caseDetailsData];
    console.log('CaseView - found data:', data);
    setCaseData(data);
    
    // Set page title
    if (data) {
      document.title = `${data.reference} - Marine Management`;
    }
  }, [caseId]);

  console.log('CaseView - render - caseId:', caseId, 'caseData:', caseData);

  if (!caseData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text variant="large">Case not found: {caseId}</Text>
        <div style={{ marginTop: '10px' }}>
          <Text variant="small">Available case IDs: {Object.keys(caseDetailsData).join(', ')}</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 28px' }}>
      {/* Header section matching D365 style */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '20px',
        borderBottom: '1px solid #edebe9',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <button 
              onClick={() => navigate('/iteration1')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '16px',
                color: '#0078d4',
                padding: '0'
              }}
            >
              ← Cases
            </button>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
            {caseData.reference}
          </h1>
          <Text variant="large" style={{ color: '#605e5c' }}>
            {caseData.title}
          </Text>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ 
            padding: '8px 16px', 
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}>
            Edit
          </button>
          <button style={{ 
            padding: '8px 16px', 
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}>
            Delete
          </button>
          <button style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0078d4', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer'
          }}>
            Save
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <Pivot>
        <PivotItem headerText="General">
          <div style={{ padding: '20px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                  Case Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 500 }}>Case Number:</Text>
                  <Text>{caseData.sections.general.caseNumber}</Text>
                  <Text style={{ fontWeight: 500 }}>Case Type:</Text>
                  <Text>{caseData.sections.general.caseType}</Text>
                  <Text style={{ fontWeight: 500 }}>Priority:</Text>
                  <Text>{caseData.sections.general.priority}</Text>
                  <Text style={{ fontWeight: 500 }}>Status:</Text>
                  <span className={`tag tag-status-${caseData.status.toLowerCase()}`}>
                    {caseData.status}
                  </span>
                  <Text style={{ fontWeight: 500 }}>Source:</Text>
                  <Text>{caseData.sections.general.source}</Text>
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                  Assignment
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 500 }}>Assigned to:</Text>
                  <Text>{caseData.assignedTo}</Text>
                  <Text style={{ fontWeight: 500 }}>Applicant:</Text>
                  <Text>{caseData.applicant}</Text>
                  <Text style={{ fontWeight: 500 }}>Submitted:</Text>
                  <Text>{caseData.submitted}</Text>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                Description
              </h3>
              <Text>{caseData.sections.general.description}</Text>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
                Summary
              </h3>
              <Text>{caseData.summary}</Text>
            </div>
          </div>
        </PivotItem>
        
        <PivotItem headerText="Timeline">
          <div style={{ padding: '20px 0' }}>
            {caseData.sections.timeline?.map((item: any, index: number) => (
              <div key={index} style={{ 
                padding: '16px 0', 
                borderBottom: index < caseData.sections.timeline.length - 1 ? '1px solid #edebe9' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <Text style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    {item.action}
                  </Text>
                  <Text variant="small" style={{ color: '#605e5c' }}>
                    by {item.user}
                  </Text>
                </div>
                <Text variant="small" style={{ color: '#605e5c' }}>
                  {item.date}
                </Text>
              </div>
            ))}
          </div>
        </PivotItem>
        
        <PivotItem headerText="Notes">
          <div style={{ padding: '20px 0' }}>
            {caseData.sections.notes?.map((note: any, index: number) => (
              <div key={index} style={{ 
                padding: '16px 0', 
                borderBottom: index < caseData.sections.notes.length - 1 ? '1px solid #edebe9' : 'none'
              }}>
                <Text style={{ display: 'block', marginBottom: '8px' }}>
                  {note.note}
                </Text>
                <Text variant="small" style={{ color: '#605e5c' }}>
                  by {note.author} on {note.date}
                </Text>
              </div>
            ))}
            
            {/* Add new note section */}
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              border: '1px solid #edebe9',
              borderRadius: '4px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Add Note</h4>
              <textarea 
                placeholder="Enter your note here..."
                style={{ 
                  width: '100%', 
                  minHeight: '80px', 
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <button style={{ 
                  padding: '6px 16px', 
                  backgroundColor: '#0078d4', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
}
