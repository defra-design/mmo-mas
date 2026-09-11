// Native D365 task form for reviewing evidence submitted by the applicant.
// Location/date and review fields are native columns. Photograph links are the
// agreed injected-HTML exception, matching WFD's "Assessment provided" field.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Title3,
  Body1,
  Checkbox,
  Text,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import type { PublicNoticeEvidenceLocationReview } from '../../context/TaskContext';
import { useTasks } from '../../context/TaskContext';
import {
  hasResubmittedPublicNoticeEvidence,
  hasSubmittedPublicNoticeEvidence,
} from '../../utils/publicNoticeEvidence';
import { notificationMessage } from '../../utils/validationMessages';
import PublicNoticeEvidenceLocation from './PublicNoticeEvidenceLocation';
import {
  publicNoticeEvidenceLocations,
  replacementPublicNoticeEvidence,
  resubmittedPublicNoticeEvidenceReviews,
} from './publicNoticeEvidenceLocations';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  bodyCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  intro: { color: tokens.colorNeutralForeground2 },
  locationGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXL,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  completeRow: { display: 'flex', alignItems: 'flex-start' },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

type ReviewField = keyof PublicNoticeEvidenceLocationReview;
type ReviewError = { index: number; field: ReviewField };

const errorName = ({ index, field }: ReviewError) =>
  field === 'decision'
    ? `Location ${index + 1} photograph decision`
    : `Location ${index + 1} rejection comments`;

type Props = { caseId: string };

export default function ReviewPublicNoticeEvidenceTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    publicNoticeEvidenceMeta,
    publicNoticeEvidenceResubmissionMeta,
    saved,
    setPublicNoticeEvidenceCompleted,
    setPublicNoticeEvidenceResubmissionCompleted,
    setPublicNoticeEvidenceLocationField,
    markUnsaved,
    savePublicNoticeEvidence,
    savePublicNoticeEvidenceResubmission,
  } = useTasks();
  const [errors, setErrors] = useState<ReviewError[]>([]);
  const available = hasSubmittedPublicNoticeEvidence(caseId);
  const isResubmission = hasResubmittedPublicNoticeEvidence(caseId);
  const reviews = isResubmission
    ? resubmittedPublicNoticeEvidenceReviews
    : publicNoticeEvidenceMeta.locations;
  const completed = isResubmission
    ? publicNoticeEvidenceResubmissionMeta.completed
    : publicNoticeEvidenceMeta.completed;
  const isSaved = isResubmission
    ? saved.publicNoticeEvidenceResubmission
    : saved.publicNoticeEvidence;
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;

  const handleSave = () => {
    if (isResubmission) {
      savePublicNoticeEvidenceResubmission();
      navigate(caseUrl);
      return;
    }
    if (publicNoticeEvidenceMeta.completed) {
      const missing = publicNoticeEvidenceMeta.locations.flatMap((review, index) => {
        const locationErrors: ReviewError[] = [];
        if (!review.decision.trim()) locationErrors.push({ index, field: 'decision' });
        if (review.decision === 'Reject' && !review.rejectionComments.trim()) {
          locationErrors.push({ index, field: 'rejectionComments' });
        }
        return locationErrors;
      });
      setErrors(missing);
      if (missing.length) return;
    }
    savePublicNoticeEvidence();
    navigate(caseUrl);
  };

  const updateLocation = (index: number, field: ReviewField, value: string) => {
    setPublicNoticeEvidenceLocationField(index, field, value);
    setErrors(previous =>
      previous.filter(error => {
        if (error.index !== index) return true;
        if (error.field === field) return false;
        return !(field === 'decision' && value !== 'Reject' && error.field === 'rejectionComments');
      }),
    );
    markUnsaved('publicNoticeEvidence');
  };

  return (
    <div className={styles.page}>
      {!available && (
        <FormNotification level="read-only">
          This task is only available after the applicant submits public notice evidence.
        </FormNotification>
      )}

      {errors.length > 0 && (
        <FormNotification level="error">
          {notificationMessage(errors.map(errorName))}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={available ? 'Save and close' : undefined}
        onSave={available ? handleSave : undefined}
        backTo={caseUrl}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Review public notice evidence
          <span className={styles.savedLabel}>
            - {isSaved ? 'Saved' : 'Unsaved'}
          </span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      {available && (
        <Card className={styles.bodyCard}>
          <div>
            <Text block className={styles.sectionHeading}>Site notice evidence</Text>
            <Body1 className={styles.intro}>
              The applicant submitted evidence for 3 locations on 20 August 2026.
            </Body1>
          </div>

          {publicNoticeEvidenceLocations.map((location, index) => (
            <div className={styles.locationGroup} key={location.name}>
              {index > 0 && <div className={styles.divider} />}
              <PublicNoticeEvidenceLocation
                number={index + 1}
                location={location}
                review={reviews[index]}
                decisionError={errors.some(
                  error => error.index === index && error.field === 'decision',
                )}
                commentsError={errors.some(
                  error => error.index === index && error.field === 'rejectionComments',
                )}
                onChange={(field, value) => updateLocation(index, field, value)}
                reviewLocked={isResubmission}
                replacementEvidence={
                  isResubmission && index === 0 ? replacementPublicNoticeEvidence : undefined
                }
              />
            </div>
          ))}

          <div className={styles.divider} />
          <div className={styles.completeRow}>
            <Checkbox
              label="Select to mark the task as complete"
              checked={completed}
              onChange={(_, data) => {
                if (isResubmission) {
                  setPublicNoticeEvidenceResubmissionCompleted(Boolean(data.checked));
                  markUnsaved('publicNoticeEvidenceResubmission');
                } else {
                  setPublicNoticeEvidenceCompleted(Boolean(data.checked));
                  markUnsaved('publicNoticeEvidence');
                }
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
