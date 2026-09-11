import {
  makeStyles,
  shorthands,
  tokens,
  Link,
  Text,
} from '@fluentui/react-components';
import { ImageRegular } from '@fluentui/react-icons';
import type { PublicNoticeEvidenceLocationReview } from '../../context/TaskContext';
import { requiredMessage } from '../../utils/validationMessages';
import TaskChoice from './TaskChoice';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';
import TaskValue from './TaskValue';
import type { PublicNoticeEvidenceLocation } from './publicNoticeEvidenceLocations';

const useStyles = makeStyles({
  location: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  heading: { fontSize: tokens.fontSizeBase300, fontWeight: tokens.fontWeightSemibold },
  imageLinkValue: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  imageLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  imageIcon: { flexShrink: 0 },
  replacement: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalS,
  },
  replacementIntro: { color: tokens.colorNeutralForeground2 },
});

const decisionOptions = ['Accept', 'Reject'];

type Props = {
  number: number;
  location: PublicNoticeEvidenceLocation;
  review: PublicNoticeEvidenceLocationReview;
  decisionError: boolean;
  commentsError: boolean;
  onChange: (field: keyof PublicNoticeEvidenceLocationReview, value: string) => void;
  reviewLocked?: boolean;
  replacementEvidence?: {
    submittedDate: string;
    closeUpHref: string;
    surroundingsHref: string;
  };
};

export default function PublicNoticeEvidenceLocation({
  number,
  location,
  review,
  decisionError,
  commentsError,
  onChange,
  reviewLocked = false,
  replacementEvidence,
}: Props) {
  const styles = useStyles();
  const decisionName = `Location ${number} photograph decision`;
  const commentsName = `Location ${number} rejection comments`;

  return (
    <div className={styles.location}>
      <Text block className={styles.heading}>Location {number}</Text>
      <TaskRow label="Location name" locked>
        <TaskValue>{location.name}</TaskValue>
      </TaskRow>
      <TaskRow label="Date displayed" locked>
        <TaskValue>{location.date}</TaskValue>
      </TaskRow>
      <TaskRow label="Close-up photograph of the notice">
        <div className={styles.imageLinkValue}>
          <Link className={styles.imageLink} href={location.closeUpHref} target="_blank" rel="noopener noreferrer">
            <ImageRegular className={styles.imageIcon} aria-hidden />
            View close-up photograph of the notice (opens in new tab)
          </Link>
        </div>
      </TaskRow>
      <TaskRow label="Photograph showing the notice in its surroundings" top>
        <div className={styles.imageLinkValue}>
          <Link className={styles.imageLink} href={location.surroundingsHref} target="_blank" rel="noopener noreferrer">
            <ImageRegular className={styles.imageIcon} aria-hidden />
            View photograph of the notice in its surroundings (opens in new tab)
          </Link>
        </div>
      </TaskRow>
      <TaskRow
        label="What is your decision on the photographs for this location?"
        required
        locked={reviewLocked}
        top
      >
        <TaskChoice
          value={review.decision}
          options={decisionOptions}
          onSelect={value => onChange('decision', value)}
          locked={reviewLocked}
          error={decisionError ? requiredMessage(decisionName) : undefined}
        />
      </TaskRow>

      {review.decision === 'Reject' && (
        <TaskRow
          label="Why are you rejecting the photographs for this location? Explain what is wrong and what the applicant needs to provide. Your comments will be sent to the applicant."
          required
          locked={reviewLocked}
          top
        >
          <TaskTextarea
            value={review.rejectionComments}
            onChange={value => onChange('rejectionComments', value)}
            locked={reviewLocked}
            error={commentsError ? requiredMessage(commentsName) : undefined}
          />
        </TaskRow>
      )}

      {replacementEvidence && (
        <div className={styles.replacement}>
          <div>
            <Text block className={styles.heading}>Replacement photographs</Text>
            <Text block className={styles.replacementIntro}>
              The applicant submitted replacement photographs for this location on{' '}
              {replacementEvidence.submittedDate}.
            </Text>
          </div>
          <TaskRow label="Replacement close-up photograph of the notice">
            <div className={styles.imageLinkValue}>
              <Link
                className={styles.imageLink}
                href={replacementEvidence.closeUpHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ImageRegular className={styles.imageIcon} aria-hidden />
                View replacement close-up photograph of the notice (opens in new tab)
              </Link>
            </div>
          </TaskRow>
          <TaskRow label="Replacement photograph showing the notice in its surroundings" top>
            <div className={styles.imageLinkValue}>
              <Link
                className={styles.imageLink}
                href={replacementEvidence.surroundingsHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ImageRegular className={styles.imageIcon} aria-hidden />
                View replacement photograph of the notice in its surroundings (opens in new tab)
              </Link>
            </div>
          </TaskRow>
        </div>
      )}
    </div>
  );
}
