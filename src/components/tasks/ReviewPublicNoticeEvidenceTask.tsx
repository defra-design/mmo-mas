// Native D365 task form for reviewing evidence submitted by the applicant. The
// locations are related records listed in a read-only subgrid; each opens its
// own form (PublicNoticeEvidenceLocationTask), which validates its own fields.
// The task has nothing of its own to edit: its status follows the locations,
// Done or Awaiting applicant once every location has been reviewed.
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, shorthands, tokens, Body1, Card, Text, Title3,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import { useTasks } from '../../context/TaskContext';
import {
  hasResubmittedPublicNoticeEvidence, hasSubmittedPublicNoticeEvidence, locationStatus,
} from '../../utils/publicNoticeEvidence';
import PublicNoticeEvidenceGrid from './PublicNoticeEvidenceGrid';
import type { LocationRow } from './PublicNoticeEvidenceGrid';
import {
  publicNoticeEvidenceLocations, resubmittedLocationIndexes, resubmittedPublicNoticeEvidenceReviews,
} from './publicNoticeEvidenceLocations';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  intro: { color: tokens.colorNeutralForeground2, marginBottom: tokens.spacingVerticalM },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

type Props = { caseId: string };

export default function ReviewPublicNoticeEvidenceTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const context = useTasks();
  const available = hasSubmittedPublicNoticeEvidence(caseId);
  const isResubmission = hasResubmittedPublicNoticeEvidence(caseId);
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;

  // On 10013 only the resubmitted locations have a review to do; the rest show
  // their earlier, accepted decision.
  const reviewFor = (index: number) => {
    if (!isResubmission) return context.publicNoticeEvidenceMeta.locations[index];
    return resubmittedLocationIndexes.includes(index)
      ? context.publicNoticeEvidenceResubmissionMeta.reviews[index]
      : resubmittedPublicNoticeEvidenceReviews[index];
  };
  const rows: LocationRow[] = publicNoticeEvidenceLocations.map((location, index) => {
    const review = reviewFor(index);
    return {
      index,
      location: `Location ${index + 1}`,
      name: location.name,
      date: location.date,
      status: locationStatus(review, isResubmission && resubmittedLocationIndexes.includes(index)),
      accepted: review.decision || '---',
    };
  });

  return (
    <div className={styles.page}>
      {!available && (
        <FormNotification level="read-only">
          This task is only available after the applicant submits public notice evidence.
        </FormNotification>
      )}
      <FormCommandBar saveLabel="Save and close" onSave={() => navigate(caseUrl)} backTo={caseUrl} />

      <Card className={styles.headerCard}>
        <Title3>
          Review public notice evidence
          {/* Nothing on the task itself is edited, so it is always Saved. */}
          <span className={styles.savedLabel}>- Saved</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      {available && (
        <Card className={styles.sectionCard}>
          <Text block className={styles.sectionHeading}>Site notice evidence</Text>
          <div className={styles.intro}>
            <Body1 block>The applicant submitted evidence on 20 August 2026.</Body1>
            {isResubmission && <Body1 block>The applicant resubmitted evidence on 27 August 2026.</Body1>}
          </div>
          <PublicNoticeEvidenceGrid
            caseId={caseId}
            rows={rows}
            onOpen={index => navigate(`${caseUrl}/tasks/review-public-notice-evidence/locations/${index + 1}`)}
          />
        </Card>
      )}
    </div>
  );
}
