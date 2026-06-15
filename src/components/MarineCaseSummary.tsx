// src/components/MarineCaseSummary.tsx
import { useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Avatar,
  Card,
  Text,
  Title3,
  Body1,
  Caption1,
  TabList,
  Tab,
} from '@fluentui/react-components';
import { getAssigneeAvatarColor } from '../utils/avatarColors';
import FormCommandBar from './FormCommandBar';
import TaskList from './TaskList';
import marineCaseDetails from '../mock-data/marine-case-details.json';
import marineCases from '../mock-data/marine-licence-cases.json';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXXL,
    marginBottom: tokens.spacingVerticalL,
  },
  titleGroup: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM },
  metaGroup: { display: 'flex', gap: tokens.spacingHorizontalXXL },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { color: tokens.colorNeutralForeground3 },
  assignedItem: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  layout: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalM, alignItems: 'flex-start' },
  mainCard: { flex: '1 1 320px', minWidth: 0, ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL) },
  tasksCard: { width: '340px', flexShrink: 0, ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL) },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  fieldColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalXXL,
  },
  fieldColumn: {
    flex: '1 1 320px',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  field: { display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', gap: tokens.spacingHorizontalM },
  fieldLabel: {},
  fieldValue: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
});

interface MarineCaseSummaryProps {
  caseId: string;
}

export default function MarineCaseSummary({ caseId }: MarineCaseSummaryProps) {
  const styles = useStyles();

  // Exmouth is fully built; other references fall back to their list row.
  const details = (marineCaseDetails as Record<string, any>)[caseId];
  const row = marineCases.find(c => c.reference === caseId);
  const data = {
    reference: caseId,
    title: details?.title ?? row?.project ?? 'Marine licence case',
    status: details?.status ?? 'Allocated',
    assignedTo: details?.assignedTo ?? row?.caseOfficer ?? 'Unallocated',
    caseAge: details?.caseAge ?? row?.caseAge ?? '—',
    applicationType: details?.applicationType ?? 'Marine licence',
    submitted: details?.submitted ?? '—',
    feeBand: details?.feeBand ?? '—',
    applicant: details?.applicant ?? '—',
    organisation: details?.organisation ?? '—',
    consentToPublish: details?.consentToPublish ?? '—',
  };

  useEffect(() => {
    document.title = `${data.reference} - MMO Marine Applications System`;
  }, [data.reference]);

  const meta = [
    { label: 'Reference', value: data.reference },
    { label: 'Status', value: data.status },
    { label: 'Case age', value: data.caseAge },
    { label: 'Assigned to', value: data.assignedTo },
  ];

  const leftFields = [
    { label: 'Reference', value: data.reference },
    { label: 'Application type', value: data.applicationType },
    { label: 'Submitted', value: data.submitted },
    { label: 'Fee band', value: data.feeBand },
  ];

  const rightFields = [
    { label: 'Applicant', value: data.applicant },
    { label: 'Organisation', value: data.organisation },
    { label: 'Consent to publish', value: data.consentToPublish },
  ];

  return (
    <div className={styles.page}>
      <FormCommandBar saveLabel="Save" showReject />

      <Card className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <Avatar name={data.title} size={48} color="colorful" />
            <div>
              <Title3>{data.title}</Title3>
              <div><Body1>Case</Body1></div>
            </div>
          </div>
          <div className={styles.metaGroup}>
            {meta.map(m =>
              m.label === 'Assigned to' ? (
                <div key={m.label} className={styles.assignedItem}>
                  <Avatar
                    name={m.value}
                    size={32}
                    color="colorful"
                    style={{ backgroundColor: getAssigneeAvatarColor(m.value) }}
                  />
                  <div className={styles.metaItem}>
                    <Body1>{m.value}</Body1>
                    <Caption1 className={styles.metaLabel}>{m.label}</Caption1>
                  </div>
                </div>
              ) : (
                <div key={m.label} className={styles.metaItem}>
                  <Body1>{m.value}</Body1>
                  <Caption1 className={styles.metaLabel}>{m.label}</Caption1>
                </div>
              )
            )}
          </div>
        </div>

        <TabList defaultSelectedValue="summary" size="large">
          <Tab value="summary">Case summary</Tab>
          <Tab value="project">Project details</Tab>
          <Tab value="site">Site and activity</Tab>
          <Tab value="mpp">Marine plan policies</Tab>
          <Tab value="wfd">WFD</Tab>
          <Tab value="other">Other permissions</Tab>
        </TabList>
      </Card>

      <div className={styles.layout}>
        <Card className={styles.mainCard}>
          <Text as="h2" className={styles.sectionHeading}>Case summary</Text>
          <div className={styles.fieldColumns}>
            {[leftFields, rightFields].map((col, i) => (
              <div key={i} className={styles.fieldColumn}>
                {col.map(f => (
                  <div key={f.label} className={styles.field}>
                    <Text className={styles.fieldLabel}>{f.label}</Text>
                    <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.tasksCard}>
          <TaskList caseId={caseId} />
        </Card>
      </div>
    </div>
  );
}
