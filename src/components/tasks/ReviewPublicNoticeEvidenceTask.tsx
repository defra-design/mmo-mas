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
  sectionCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  intro: {
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
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
    ? `Location ${index + 1} photograph acceptance`
    : `Location ${index + 1} photograph comments`;

type Props = { caseId: string };

export default function ReviewPublicNoticeEvidenceTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    publicNoticeEvidenceMeta,
    publicNoticeEvidenceResubmissionMeta,
    saved,
    setPublicNoticeEvidenceResubmissionField,
    setPublicNoticeEvidenceLocationField,
    markUnsaved,
    savePublicNoticeEvidence,
    savePublicNoticeEvidenceResubmission,
  } = useTasks();
  const [errors, setErrors] = useState<ReviewError[]>([]);
  const [resubmissionErrors, setResubmissionErrors] = useState<ReviewField[]>([]);
  const available = hasSubmittedPublicNoticeEvidence(caseId);
  const isResubmission = hasResubmittedPublicNoticeEvidence(caseId);
  const reviews = isResubmission
    ? resubmittedPublicNoticeEvidenceReviews
    : publicNoticeEvidenceMeta.locations;
  const isSaved = isResubmission
    ? saved.publicNoticeEvidenceResubmission
    : saved.publicNoticeEvidence;
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;

  const handleSave = () => {
    if (isResubmission) {
      const review = publicNoticeEvidenceResubmissionMeta.review;
      const missing: ReviewField[] = [];
      if (!review.decision.trim()) missing.push('decision');
      if (review.decision === 'No' && !review.rejectionComments.trim()) {
        missing.push('rejectionComments');
      }
      setResubmissionErrors(missing);
      if (missing.length) return;
      savePublicNoticeEvidenceResubmission();
      navigate(caseUrl);
      return;
    }
    const missing = publicNoticeEvidenceMeta.locations.flatMap((review, index) => {
      const locationErrors: ReviewError[] = [];
      if (!review.decision.trim()) locationErrors.push({ index, field: 'decision' });
      if (review.decision === 'No' && !review.rejectionComments.trim()) {
        locationErrors.push({ index, field: 'rejectionComments' });
      }
      return locationErrors;
    });
    setErrors(missing);
    if (missing.length) return;
    savePublicNoticeEvidence();
    navigate(caseUrl);
  };

  const updateResubmission = (field: ReviewField, value: string) => {
    setPublicNoticeEvidenceResubmissionField(field, value);
    setResubmissionErrors(previous =>
      previous.filter(error => {
        if (error === field) return false;
        return !(field === 'decision' && value !== 'No' && error === 'rejectionComments');
      }),
    );
    markUnsaved('publicNoticeEvidenceResubmission');
  };

  const updateLocation = (index: number, field: ReviewField, value: string) => {
    setPublicNoticeEvidenceLocationField(index, field, value);
    setErrors(previous =>
      previous.filter(error => {
        if (error.index !== index) return true;
        if (error.field === field) return false;
        return !(field === 'decision' && value !== 'No' && error.field === 'rejectionComments');
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

      {(errors.length > 0 || resubmissionErrors.length > 0) && (
        <FormNotification level="error">
          {notificationMessage([
            ...errors.map(errorName),
            ...resubmissionErrors.map(field =>
              field === 'decision'
                ? 'Location 1 resubmitted photograph acceptance'
                : 'Location 1 resubmitted photograph comments',
            ),
          ])}
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
        <>
          <Card className={styles.sectionCard}>
            <Text block className={styles.sectionHeading}>Site notice evidence</Text>
            <div className={styles.intro}>
              <Body1>The applicant submitted evidence on 20 August 2026.</Body1>
              {isResubmission && (
                <Body1>The applicant resubmitted evidence on 27 August 2026.</Body1>
              )}
            </div>
          </Card>

          {publicNoticeEvidenceLocations.map((location, index) => (
            <Card className={styles.sectionCard} key={location.name}>
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
                replacementReview={
                  isResubmission && index === 0
                    ? publicNoticeEvidenceResubmissionMeta.review
                    : undefined
                }
                replacementDecisionError={resubmissionErrors.includes('decision')}
                replacementCommentsError={resubmissionErrors.includes('rejectionComments')}
                onReplacementChange={
                  isResubmission && index === 0 ? updateResubmission : undefined
                }
              />
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
