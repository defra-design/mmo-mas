// A related Location record's native D365 main form, opened full page from the
// Review public notice evidence subgrid. Edits stay on the form until Save and
// close writes the record; the back arrow leaves without saving them.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { makeStyles, shorthands, tokens, Body1, Card, Title3 } from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import type { PublicNoticeEvidenceLocationReview } from '../../context/TaskContext';
import { useTasks } from '../../context/TaskContext';
import {
  hasResubmittedPublicNoticeEvidence, hasSubmittedPublicNoticeEvidence,
} from '../../utils/publicNoticeEvidence';
import { notificationMessage } from '../../utils/validationMessages';
import PublicNoticeEvidenceLocation from './PublicNoticeEvidenceLocation';
import {
  publicNoticeEvidenceLocations, replacementPublicNoticeEvidence, resubmittedPublicNoticeEvidenceReviews,
} from './publicNoticeEvidenceLocations';

const useStyles = makeStyles({
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  card: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

type Field = keyof PublicNoticeEvidenceLocationReview;
const missingFields = (review: PublicNoticeEvidenceLocationReview): Field[] => [
  ...(!review.decision ? ['decision' as const] : []),
  ...(review.decision === 'No' && !review.rejectionComments.trim() ? ['rejectionComments' as const] : []),
];

type Props = { caseId: string };

export default function PublicNoticeEvidenceLocationTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const context = useTasks();
  const { locationNumber } = useParams<{ locationNumber: string }>();
  const index = Number(locationNumber) - 1;
  const location = publicNoticeEvidenceLocations[index];
  const isResubmission = hasResubmittedPublicNoticeEvidence(caseId);
  const replacement = isResubmission ? replacementPublicNoticeEvidence[index] : undefined;
  // On 10013 the locations without replacement photographs are read-only history.
  const locked = isResubmission && !replacement;
  const [draft, setDraft] = useState<PublicNoticeEvidenceLocationReview>(() =>
    replacement ? context.publicNoticeEvidenceResubmissionMeta.reviews[index]
      : isResubmission ? resubmittedPublicNoticeEvidenceReviews[index]
        : context.publicNoticeEvidenceMeta.locations[index] ?? { decision: '', rejectionComments: '' },
  );
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Field[]>([]);
  const taskUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}/tasks/review-public-notice-evidence`;

  if (!location || !hasSubmittedPublicNoticeEvidence(caseId)) {
    return <div className={styles.page}>
      <FormCommandBar backTo={taskUrl} />
      <Card className={styles.card}><Title3>Location not found</Title3></Card>
    </div>;
  }

  const update = (field: Field, value: string) => {
    const next = { ...draft, [field]: value };
    setDraft(next);
    setDirty(true);
    setErrors(previous => previous.filter(error => missingFields(next).includes(error)));
  };
  const save = () => {
    if (!locked) {
      const missing = missingFields(draft);
      setErrors(missing);
      if (missing.length) return;
      if (replacement) context.setPublicNoticeEvidenceResubmissionReview(index, draft);
      else context.setPublicNoticeEvidenceLocation(index, draft);
    }
    navigate(taskUrl);
  };
  const qualifier = replacement ? 'resubmitted ' : '';
  const errorName = (field: Field) =>
    `Location ${index + 1} ${qualifier}photograph ${field === 'decision' ? 'acceptance' : 'comments'}`;

  return (
    <div className={styles.page}>
      {errors.length > 0 && <FormNotification level="error">{notificationMessage(errors.map(errorName))}</FormNotification>}
      <FormCommandBar backTo={taskUrl} saveLabel="Save and close" onSave={save} />
      <Card className={styles.card}>
        <Title3>{location.name}<span className={styles.savedLabel}>- {dirty ? 'Unsaved' : 'Saved'}</span></Title3>
        <div><Body1>Location</Body1></div>
      </Card>
      <Card className={styles.card}>
        <PublicNoticeEvidenceLocation
          number={index + 1}
          location={location}
          review={replacement ? resubmittedPublicNoticeEvidenceReviews[index] : draft}
          reviewLocked={isResubmission}
          decisionError={!replacement && errors.includes('decision')}
          commentsError={!replacement && errors.includes('rejectionComments')}
          onChange={update}
          replacementEvidence={replacement}
          replacementReview={replacement ? draft : undefined}
          replacementDecisionError={errors.includes('decision')}
          replacementCommentsError={errors.includes('rejectionComments')}
          onReplacementChange={replacement ? update : undefined}
        />
      </Card>
    </div>
  );
}
