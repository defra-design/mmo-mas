import {
  makeStyles,
  shorthands,
  tokens,
  Link,
  Text,
} from '@fluentui/react-components';
import { ImageRegular } from '@fluentui/react-icons';
import type { PublicNoticeEvidenceLocationReview } from '../../context/TaskContext';
import PublicNoticeEvidenceDecision from './PublicNoticeEvidenceDecision';
import TaskRow from './TaskRow';
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
  replacementReview?: PublicNoticeEvidenceLocationReview;
  replacementDecisionError?: boolean;
  replacementCommentsError?: boolean;
  onReplacementChange?: (
    field: keyof PublicNoticeEvidenceLocationReview,
    value: string,
  ) => void;
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
  replacementReview,
  replacementDecisionError = false,
  replacementCommentsError = false,
  onReplacementChange,
}: Props) {
  const styles = useStyles();

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
      <PublicNoticeEvidenceDecision
        number={number}
        review={review}
        decisionError={decisionError}
        commentsError={commentsError}
        onChange={onChange}
        locked={reviewLocked}
      />

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
          {replacementReview && onReplacementChange && (
            <PublicNoticeEvidenceDecision
              number={number}
              review={replacementReview}
              decisionError={replacementDecisionError}
              commentsError={replacementCommentsError}
              onChange={onReplacementChange}
              resubmitted
            />
          )}
        </div>
      )}
    </div>
  );
}
