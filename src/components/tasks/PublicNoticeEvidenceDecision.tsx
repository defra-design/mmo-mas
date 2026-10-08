import type { PublicNoticeEvidenceLocationReview } from '../../context/TaskContext';
import { NOT_ACCEPTED } from '../../utils/publicNoticeEvidence';
import { requiredMessage } from '../../utils/validationMessages';
import TaskChoice from './TaskChoice';
import TaskHint from './TaskHint';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';

const decisionOptions = ['Yes', NOT_ACCEPTED];

type Props = {
  number: number;
  review: PublicNoticeEvidenceLocationReview;
  decisionError: boolean;
  commentsError: boolean;
  onChange: (field: keyof PublicNoticeEvidenceLocationReview, value: string) => void;
  locked?: boolean;
  resubmitted?: boolean;
};

export default function PublicNoticeEvidenceDecision({
  number,
  review,
  decisionError,
  commentsError,
  onChange,
  locked = false,
  resubmitted = false,
}: Props) {
  const qualifier = resubmitted ? 'resubmitted ' : '';
  const decisionName = `Location ${number} ${qualifier}photograph acceptance`;
  const commentsName = `Location ${number} ${qualifier}photograph comments`;

  return (
    <>
      <TaskRow
        label={`Do you accept the ${qualifier}photographs for this location?`}
        required
        locked={locked}
        top
      >
        <TaskChoice
          value={review.decision}
          options={decisionOptions}
          onSelect={value => onChange('decision', value)}
          locked={locked}
          error={decisionError ? requiredMessage(decisionName) : undefined}
        />
      </TaskRow>

      {review.decision === NOT_ACCEPTED && (
        <>
          <TaskRow
            label="What is wrong with the photographs for this location?"
            required
            locked={locked}
            top
          >
            <TaskTextarea
              value={review.rejectionComments}
              onChange={value => onChange('rejectionComments', value)}
              locked={locked}
              error={commentsError ? requiredMessage(commentsName) : undefined}
            />
          </TaskRow>
          {/* Full-width help text under the field, with no icon as on WFD:
              injected HTML in the real build. */}
          <TaskHint plain>
            <p>
              Say which photograph is affected - the close-up, the one showing the notice in its
              surroundings or both. Tell the applicant what they need to provide instead. This will
              be sent to the applicant, so keep it factual and clear.
            </p>
          </TaskHint>
        </>
      )}
    </>
  );
}
