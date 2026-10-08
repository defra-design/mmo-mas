// The Organisation (Account) main form, opened full page from an Organisation
// lookup link: the case's applicant organisation on the Case summary, or a
// consultee in the Prep for consultee subgrid. Account information and
// Registered address sections plus the Timeline; the Companies House section and
// the related-records column on the real form are left out for now. Values are
// shown read-only: the prototype has nothing to save them to. Back returns to
// the page that opened the record (passed as router state), else the case.
import type { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { makeStyles, mergeClasses, shorthands, tokens, Avatar, Body1, Card, Tab, TabList, Text, Title3 } from '@fluentui/react-components';
import { GlobeRegular } from '@fluentui/react-icons';
import FormCommandBar from './FormCommandBar';
import OrganisationTimeline from './OrganisationTimeline';
import FieldDecorations from './tasks/FieldDecorations';
import TaskFieldLabel from './tasks/TaskFieldLabel';
import { organisationById } from '../utils/organisations';

const useStyles = makeStyles({
  page: { backgroundColor: tokens.colorNeutralBackground2, display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL, 0) },
  header: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
  entity: { fontWeight: tokens.fontWeightSemibold },
  columns: {
    display: 'grid',
    gap: tokens.spacingHorizontalM,
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    alignItems: 'start',
  },
  column: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  card: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL), gap: tokens.spacingVerticalM },
  heading: { fontSize: tokens.fontSizeBase400, fontWeight: tokens.fontWeightSemibold },
  // Narrower than TaskRow so labels stay beside values in a half-width column.
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', rowGap: tokens.spacingVerticalXS },
  label: { flexBasis: '140px', flexShrink: 0, paddingTop: tokens.spacingVerticalXS },
  value: {
    flexGrow: 1,
    flexBasis: '180px',
    minWidth: 0,
    marginLeft: tokens.spacingHorizontalS,
    minHeight: '20px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    ...shorthands.padding(tokens.spacingVerticalSNudge, tokens.spacingHorizontalM),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lookup: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS, color: '#0078d4' },
  lookupText: { overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: 'underline' },
});

type Props = { caseId: string };

export default function OrganisationForm({ caseId }: Props) {
  const styles = useStyles();
  const { organisationId = '' } = useParams<{ organisationId: string }>();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const backTo = from ?? `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  const organisation = organisationById(organisationId);

  if (!organisation) {
    return <div className={styles.page}>
      <FormCommandBar backTo={backTo} />
      <Card className={styles.headerCard}><Title3>Organisation not found</Title3></Card>
    </div>;
  }

  const field = (label: string, value: ReactNode, required = false) => (
    <div className={styles.row}>
      <TaskFieldLabel className={styles.label}>{label}</TaskFieldLabel>
      <FieldDecorations required={required} />
      {value}
    </div>
  );
  const row = (label: string, value: string, required = false) =>
    field(label, <Body1 className={styles.value} title={value}>{value || '---'}</Body1>, required);

  return (
    <div className={styles.page}>
      <FormCommandBar backTo={backTo} />
      <Card className={styles.headerCard}>
        <div className={styles.header}>
          <Avatar name={organisation.name} size={40} color="neutral" />
          <div>
            <Title3>{organisation.name}<span className={styles.savedLabel}>- Saved</span></Title3>
            <Text block className={styles.entity}>Organisation</Text>
          </div>
        </div>
        <TabList selectedValue="summary"><Tab value="summary">Summary</Tab></TabList>
      </Card>
      <div className={styles.columns}>
        <div className={styles.column}>
          <Card className={styles.card}>
            <Text className={styles.heading}>Account information</Text>
            {row('Account name', organisation.name, true)}
            {row('Phone', organisation.phone)}
          </Card>
          <Card className={styles.card}>
            <Text className={styles.heading}>Registered address</Text>
            {row('Type', organisation.type)}
            {row('Building number', organisation.buildingNumber)}
            {row('Building name', organisation.buildingName)}
            {row('Street', organisation.street)}
            {row('Town', organisation.town)}
            {row('County', organisation.county)}
            {row('Postcode', organisation.postcode)}
            {field('Country', (
              <Body1 className={mergeClasses(styles.value, styles.lookup)} title={organisation.country}>
                <GlobeRegular />
                <span className={styles.lookupText}>{organisation.country}</span>
              </Body1>
            ))}
          </Card>
        </div>
        <OrganisationTimeline name={organisation.name} createdOn={organisation.createdOn} />
      </div>
    </div>
  );
}
