import { makeStyles, shorthands, tokens, Text } from '@fluentui/react-components';
import type { SiteNoticeForm } from '../../context/TaskContext';
import { SITE_NOTICE, NO_NOTICES, publicNoticeOptions } from '../../utils/publicNoticeRequirement';
import TaskChoice from './TaskChoice';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';
import TaskValue from './TaskValue';
import { GroupsHint, SummaryHint } from './siteNoticeHints';
import { groupOptions, type SiteNoticeField } from './siteNoticeFields';

const useStyles = makeStyles({
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: `calc(0px - ${tokens.spacingVerticalS})`,
    marginBottom: tokens.spacingVerticalL,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
});

type Props = {
  form: SiteNoticeForm;
  proposedWorks: string;
  locked: boolean;
  errorFor: (field: SiteNoticeField) => string | undefined;
  onChange: (field: SiteNoticeField, value: string) => void;
};

export default function SiteNoticeAssessment({
  form,
  proposedWorks,
  locked,
  errorFor,
  onChange,
}: Props) {
  const styles = useStyles();

  return (
    <>
      <div>
        <Text block className={styles.sectionHeading}>1. Public notice requirement</Text>
        <div className={styles.answers}>
          <TaskRow
            label="Which public notices are required?"
            required
            locked={locked}
            top
          >
            <TaskChoice
              value={form.needsNotice}
              options={publicNoticeOptions}
              onSelect={v => onChange('needsNotice', v)}
              locked={locked}
              error={errorFor('needsNotice')}
            />
          </TaskRow>

          {form.needsNotice === NO_NOTICES && (
            <TaskRow
              label="Why are no public notices required?"
              required
              locked={locked}
              top
            >
              <TaskTextarea
                value={form.rationale}
                onChange={v => onChange('rationale', v)}
                locked={locked}
                error={errorFor('rationale')}
              />
            </TaskRow>
          )}
        </div>
      </div>

      {form.needsNotice === SITE_NOTICE && (
        <>
          <div className={styles.divider} />

          <div>
            <Text block className={styles.sectionHeading}>2. Site notice summary</Text>
            <div className={styles.answers}>
              <TaskRow label="Applicant's proposed works summary" locked top>
                <TaskValue multiline>{proposedWorks}</TaskValue>
              </TaskRow>
              <TaskRow label="Write a summary for the site notice" required locked={locked} top>
                <TaskTextarea
                  value={form.summary}
                  onChange={v => onChange('summary', v)}
                  locked={locked}
                  error={errorFor('summary')}
                />
              </TaskRow>
            </div>
            <SummaryHint />
          </div>

          <div className={styles.divider} />

          <div>
            <Text block className={styles.sectionHeading}>3. Who the site notice is for</Text>
            <Text block className={styles.desc}>
              The applicant sees suggested notice locations for the group you choose.
            </Text>
            <TaskRow
              label="Who needs to be told about this application?"
              required
              locked={locked}
              top
            >
              <TaskChoice
                value={form.groups}
                options={groupOptions}
                onSelect={v => onChange('groups', v)}
                locked={locked}
                error={errorFor('groups')}
              />
            </TaskRow>
            <GroupsHint />
          </div>
        </>
      )}
    </>
  );
}
