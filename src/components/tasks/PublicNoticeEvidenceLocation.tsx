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
});

const decisionOptions = ['Accept', 'Reject'];

type Props = {
  number: number;
  location: PublicNoticeEvidenceLocation;
  review: PublicNoticeEvidenceLocationReview;
  decisionError: boolean;
  commentsError: boolean;
  onChange: (field: keyof PublicNoticeEvidenceLocationReview, value: string) => void;
};

export default function PublicNoticeEvidenceLocation({
  number,
  location,
  review,
  decisionError,
  commentsError,
  onChange,
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
      <TaskRow label="What is your decision on the photographs for this location?" required top>
        <TaskChoice
          value={review.decision}
          options={decisionOptions}
          onSelect={value => onChange('decision', value)}
          error={decisionError ? requiredMessage(decisionName) : undefined}
        />
      </TaskRow>

      {review.decision === 'Reject' && (
        <TaskRow
          label="Why are you rejecting the photographs for this location? Explain what is wrong and what the applicant needs to provide. Your comments will be sent to the applicant."
          required
          top
        >
          <TaskTextarea
            value={review.rejectionComments}
            onChange={value => onChange('rejectionComments', value)}
            error={commentsError ? requiredMessage(commentsName) : undefined}
          />
        </TaskRow>
      )}
    </div>
  );
}
