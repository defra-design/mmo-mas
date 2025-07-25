// src/components/CaseView.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  makeStyles,
  shorthands,
  tokens,
  Avatar,
  Card,
  CardHeader,
  Button,
  Link,
  Body1,
  Body2,
  Caption1,
  Title3,
  Subtitle2,
  TabList,
  Tab
} from '@fluentui/react-components';
import { getAssigneeAvatarColor } from '../utils/avatarColors';
import { ArrowLeftRegular, GlobeRegular, PersonRegular, ShareRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import caseDetailsData from '../mock-data/case-details.json';

const useStyles = makeStyles({
  pageContainer: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: `${tokens.spacingHorizontalXL} ${tokens.spacingHorizontalXS}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: {
    ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingVerticalL),
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
  },
  headerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  statusInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXXL,
    marginTop: tokens.spacingVerticalM,
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr',
    gap: tokens.spacingVerticalM,
    alignItems: 'center',
  },
  fieldRow: {
    display: 'contents',
  },
  fieldLabel: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    display: 'flex',
    alignItems: 'center',
  },
  fieldValue: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  fieldValueWithIcon: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  dateTimeRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
  dateTimeField: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    flex: 1,
  },
  descriptionContent: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalXL,
    borderRadius: tokens.borderRadiusSmall,
    margin: tokens.spacingHorizontalS,
    minHeight: '200px',
  },
  truncatedText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '300px',
  },
  tabList: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  boldText: {
    fontWeight: tokens.fontWeightSemibold,
  },
  navPanel: {
    ...shorthands.padding(tokens.spacingHorizontalL, tokens.spacingVerticalL),
  },
  navPanelContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  navLeftGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  verticalDivider: {
    width: '1px',
    height: '20px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: `0 ${tokens.spacingHorizontalXS}`,
  },
  avatarDivider: {
    width: '1px',
    height: '48px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginRight: tokens.spacingHorizontalM,
  },
});

// CaseHeader component
function CaseHeader({ caseData }: { caseData: any }) {
  const navigate = useNavigate();
  const styles = useStyles();

  return (
    <>
      {/* Navigation panel */}
      <Card className={styles.navPanel}>
        <div className={styles.navPanelContent}>
          <div className={styles.navLeftGroup}>
            <Button 
              appearance="subtle"
              icon={<ArrowLeftRegular />}
              onClick={() => navigate('/iteration1')}
            />
            <div className={styles.verticalDivider}></div>
            <Button 
              appearance="subtle"
              icon={<ArrowClockwiseRegular />}
            >
              Refresh
            </Button>
          </div>
          <Button
            appearance="subtle"
            icon={<ShareRegular />}
          >
            Share
          </Button>
        </div>
      </Card>
      
      <Card className={styles.headerCard}>
        <div className={styles.headerContent}>
          
          <Avatar 
            name={caseData.title} 
            size={48}
            color="colorful"
          />
          <div className={styles.headerInfo}>
            <Title3>{caseData.title}</Title3>
            <Body1>Case</Body1>
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusItem}>
              <Body2 className={styles.boldText}>Completed</Body2>
              <Body1>Status</Body1>
            </div>
            <div className={styles.avatarDivider}></div>
            <Avatar 
              name={caseData.assignedTo} 
              size={32}
              color="colorful"
              style={{ backgroundColor: getAssigneeAvatarColor(caseData.assignedTo) }}
            />
            <div className={styles.statusItem}>
              <Body2>{caseData.assignedTo}</Body2>
              <Body1>Assigned to</Body1>
            </div>
          </div>
        </div>
        
        {/* Tab navigation */}
        <TabList defaultSelectedValue="summary" className={styles.tabList}>
          <Tab value="summary">Summary</Tab>
          <Tab value="related">Related</Tab>
        </TabList>
      </Card>
    </>
  );
}

// CaseDetails component
function CaseDetails({ caseData }: { caseData: any }) {
  const styles = useStyles();

  return (
    <Card>
      <CardHeader header={<Subtitle2>CASE DETAILS</Subtitle2>} />
      
      <div className={styles.detailsGrid}>
        <div>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Reference</Body1>
              </div>
              <div className={styles.fieldValue}>
                <Body1>{caseData.reference}</Body1>
              </div>
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Type</Body1>
              </div>
              <div className={styles.fieldValue}>
                <Body1>Exempt activity</Body1>
              </div>
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Assigned to</Body1>
              </div>
              <div className={styles.fieldValue}>
                <Avatar 
                  name={caseData.assignedTo} 
                  size={20}
                  color="colorful"
                />
                <Link href="#" style={{ fontSize: tokens.fontSizeBase300 }}>{caseData.assignedTo}</Link>
              </div>
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Application URL</Body1>
              </div>
              <div className={styles.fieldValueWithIcon}>
                <Link href="#" className={styles.truncatedText} style={{ fontSize: tokens.fontSizeBase300 }}>
                  https://marine-licensing-prototype-5b7b33ca29e1.herokuapp.com/versions/multiple...
                </Link>
                <GlobeRegular fontSize={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className={styles.fieldGrid}>
                        <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Project name</Body1>
              </div>
              <div className={styles.fieldValue}>
                <Body1>{caseData.title}</Body1>
              </div>
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Applicant</Body1>
              </div>
              <div className={styles.fieldValue}>
                <PersonRegular fontSize={20} />
                <Link href="#" style={{ fontSize: tokens.fontSizeBase300 }}>{caseData.applicant}</Link>
              </div>
            </div>
            
            <div className={styles.fieldRow}>
              <div className={styles.fieldLabel}>
                <Body1>Submitted date</Body1>
              </div>
              <div className={styles.dateTimeRow}>
                <div className={styles.dateTimeField}>
                  <Body1>{new Date(caseData.submitted).toLocaleDateString('en-GB')}</Body1>
                </div>
                <div className={styles.dateTimeField}>
                  <Body1>{new Date(caseData.submitted).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Body1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Description component
function Description() {
  const styles = useStyles();
  
  return (
    <Card>
      <CardHeader header={<Subtitle2>DESCRIPTION</Subtitle2>} />
      <div className={styles.descriptionContent}>
        {/* Empty content area with grey background matching case details */}
      </div>
    </Card>
  );
}

interface CaseViewProps {
  caseId: string;
}

export default function CaseView({ caseId }: CaseViewProps) {
  const [caseData, setCaseData] = useState<any>(null);
  const styles = useStyles();

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
      <div className={styles.pageContainer}>
        <Card style={{ textAlign: 'center' }}>
          <Body1>Case not found: {caseId}</Body1>
          <Caption1>
            Available case IDs: {Object.keys(caseDetailsData).join(', ')}
          </Caption1>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <CaseHeader caseData={caseData} />
      <CaseDetails caseData={caseData} />
      <Description />
    </div>
  );
}
