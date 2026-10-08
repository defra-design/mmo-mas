// Native D365 task form for reviewing evidence submitted by the applicant. The
// locations are related records listed in a read-only subgrid; each opens its
// own form (PublicNoticeEvidenceLocationTask). A Two Options checkbox marks the
// task complete: ticked -> Done or Awaiting applicant on save, unticked -> In
// progress, as on Public register.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, shorthands, tokens, Body1, Card, Checkbox, Text, Title3,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import { useTasks } from '../../context/TaskContext';
import {
  hasResubmittedPublicNoticeEvidence, hasSubmittedPublicNoticeEvidence, locationStatus,
} from '../../utils/publicNoticeEvidence';
import PublicNoticeEvidenceGrid from './PublicNoticeEvidenceGrid';
import type { LocationRow } from './PublicNoticeEvidenceGrid';
import TaskRow from './TaskRow';
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
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

// The locations are related records, so OOB required-field validation can't see
// them. In D365 this is a small OnSave script that checks the related locations,
// sets an error form notification and cancels the save.
const decisionMessage = (missing: number[]) =>
  `Decide whether you accept the photographs for every location before you complete the task. No decision: ${missing.map(index => `Location ${index + 1}`).join(', ')}.`;
const completeLabel = 'Select to mark the task as complete';

type Props = { caseId: string };

export default function ReviewPublicNoticeEvidenceTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const context = useTasks();
  const [missing, setMissing] = useState<number[]>([]);
  const available = hasSubmittedPublicNoticeEvidence(caseId);
  const isResubmission = hasResubmittedPublicNoticeEvidence(caseId);
  const meta = isResubmission ? context.publicNoticeEvidenceResubmissionMeta : context.publicNoticeEvidenceMeta;
  const savedKey = isResubmission ? 'publicNoticeEvidenceResubmission' : 'publicNoticeEvidence';
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

  const setCompleted = (completed: boolean) => {
    if (isResubmission) context.setPublicNoticeEvidenceResubmissionCompleted(completed);
    else context.setPublicNoticeEvidenceCompleted(completed);
    if (!completed) setMissing([]);
    context.markUnsaved(savedKey);
  };

  const handleSave = () => {
    if (!available) return navigate(caseUrl);
    const undecided = meta.completed ? rows.filter(row => row.accepted === '---').map(row => row.index) : [];
    setMissing(undecided);
    if (undecided.length) return;
    if (isResubmission) context.savePublicNoticeEvidenceResubmission();
    else context.savePublicNoticeEvidence();
    navigate(caseUrl);
  };

  return (
    <div className={styles.page}>
      {!available && (
        <FormNotification level="read-only">
          This task is only available after the applicant submits public notice evidence.
        </FormNotification>
      )}
      {missing.length > 0 && <FormNotification level="error">{decisionMessage(missing)}</FormNotification>}

      <FormCommandBar saveLabel="Save and close" onSave={handleSave} backTo={caseUrl} />

      <Card className={styles.headerCard}>
        <Title3>
          Review public notice evidence
          <span className={styles.savedLabel}>- {context.saved[savedKey] ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      {available && (
        <>
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

          <Card className={styles.sectionCard}>
            <Text block className={styles.sectionHeading}>Complete task</Text>
            <div className={styles.answers}>
              <Body1>Any information for the applicant will be sent when the task is complete.</Body1>
              <TaskRow label={completeLabel}>
                <Checkbox
                  aria-label={completeLabel}
                  checked={meta.completed}
                  onChange={(_, data) => setCompleted(Boolean(data.checked))}
                />
              </TaskRow>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
