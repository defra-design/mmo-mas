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
  commentsLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

const decisionOptions = ['Yes', 'No'];

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
  const decisionName = `Location ${number} photograph acceptance`;
  const commentsName = `Location ${number} photograph comments`;

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
        label="Do you accept the photographs for this location?"
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

      {review.decision === 'No' && (
        <TaskRow
          label={
            <span className={styles.commentsLabel}>
              <span>What is wrong with the photographs for this location?</span>
              <span>
                Say which photograph is affected - the close-up, the one showing the notice in
                its surroundings or both. Tell the applicant what they need to provide instead.
                This will be sent to the applicant, so keep it factual and clear.
              </span>
            </span>
          }
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
            <Text block className={styles.heading}>
              Resubmitted photographs for location {number}
            </Text>
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
