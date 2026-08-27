// src/components/tasks/SiteNoticeTask.tsx
// Task form for "Site notice". Section 1 is the applicant's proposed-works summary
// (a read-only column on the case). Section 2 is the caseworker's shortened version
// for the public notice — a Multiline Text column with its guidance collapsed behind
// a disclosure. Section 3 is a Choice column naming who has to be told. Both
// caseworker fields are business-required, so a save that passes validation
// completes the task.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Text,
  Title3,
  Body1,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import TaskRow from './TaskRow';
import TaskValue from './TaskValue';
import TaskChoice from './TaskChoice';
import TaskTextarea from './TaskTextarea';
import { GroupsHint, SummaryHint } from './siteNoticeHints';
import {
  CANNOT_START_MESSAGE,
  notificationMessage,
  requiredMessage,
} from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import type { SiteNoticeForm } from '../../context/TaskContext';

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
    marginBottom: tokens.spacingVerticalL,
  },
  // Section description, sitting between the heading and the first field.
  desc: {
    color: tokens.colorNeutralForeground2,
    marginTop: `calc(0px - ${tokens.spacingVerticalS})`,
    marginBottom: tokens.spacingVerticalL,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

// The applicant's submitted answer, which arrives with the application from CDP.
const PROPOSED_WORKS =
  'We propose to extend the existing sea defence at Dawlish by 120 metres eastwards along ' +
  'the foreshore. The works consist of installing pre-cast concrete armour units and rock ' +
  'revetment along the toe of the existing structure, with associated scour protection at ' +
  'the eastern end. Materials will be delivered by road and placed using a tracked excavator ' +
  'working from the beach during low tide. The works are expected to take 14 weeks.';

// "Select the groups who need to be told" — the audiences a notice can be aimed at.
const GROUP_OPTIONS = ['Marine users', 'Community users', 'Both'];

// Display names D365 uses when it lists the fields that failed validation.
const FIELD_NAMES: Record<keyof SiteNoticeForm, string> = {
  summary: 'Summary of the proposed works',
  groups: 'Who needs to be told about this application',
};

type FieldKey = keyof SiteNoticeForm;

interface SiteNoticeTaskProps {
  caseId: string;
}

export default function SiteNoticeTask({ caseId }: SiteNoticeTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, siteNoticeForm: form, saved, setSiteNoticeField, markUnsaved, saveSiteNotice } =
    useTasks();
  // Gated behind Site check. The record still opens — D365 cannot lock a
  // caseworker out — but it opens read-only: padlocked fields, no Save command.
  const locked = tasks.siteNotice === 'Cannot start yet';
  // Fields left empty on a failed save. Each clears as soon as it's given a value.
  const [errors, setErrors] = useState<FieldKey[]>([]);

  const errorFor = (field: FieldKey) =>
    errors.includes(field) ? requiredMessage(FIELD_NAMES[field]) : undefined;

  const update = (field: FieldKey, value: string) => {
    setSiteNoticeField(field, value);
    setErrors(prev => prev.filter(k => k !== field));
    markUnsaved('siteNotice');
  };

  const handleSave = () => {
    const missing = (Object.keys(FIELD_NAMES) as FieldKey[]).filter(k => !form[k].trim());
    setErrors(missing);
    if (missing.length) return;
    saveSiteNotice();
    navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`);
  };

  return (
    <div className={styles.page}>
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}

      {errors.length > 0 && (
        <FormNotification level="error">
          {notificationMessage(errors.map(k => FIELD_NAMES[k]))}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={locked ? undefined : 'Save and close'}
        onSave={locked ? undefined : handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Site notice
          <span className={styles.savedLabel}>- {saved.siteNotice ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. The applicant's proposed works</Text>
          <TaskRow label="Proposed works summary" locked={locked} top>
            <TaskValue multiline>{PROPOSED_WORKS}</TaskValue>
          </TaskRow>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. Your summary for the site notice</Text>
          <TaskRow label="Write a summary of the proposed works" required locked={locked} top>
            <TaskTextarea
              value={form.summary}
              onChange={v => update('summary', v)}
              locked={locked}
              error={errorFor('summary')}
            />
          </TaskRow>
          <SummaryHint />
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>
            3. Who the notice is for
          </Text>
          <Text block className={styles.desc}>
            The applicant sees suggested notice locations for the group you choose.
          </Text>
          <TaskRow label="Who needs to be told about this application?" required locked={locked} top>
            <TaskChoice
              value={form.groups}
              options={GROUP_OPTIONS}
              onSelect={v => update('groups', v)}
              locked={locked}
              error={errorFor('groups')}
            />
          </TaskRow>
          <GroupsHint />
        </div>
      </Card>
    </div>
  );
}
