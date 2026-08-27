// src/components/tasks/SiteNoticeTask.tsx
// Task form for "Public notice", currently capturing the Site notice type.
// Section 1 is the applicant's proposed-works summary (a read-only column on the
// case). Section 2 asks whether a site notice is required.
// OOB business rules reveal either a mandatory rationale for No, or the existing
// summary and audience sections (renumbered 3 and 4) for Yes.
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
import SiteNoticeAssessment from './SiteNoticeAssessment';
import {
  requiredSiteNoticeFields,
  siteNoticeFieldNames,
  type SiteNoticeField,
} from './siteNoticeFields';
import {
  CANNOT_START_MESSAGE,
  notificationMessage,
  requiredMessage,
} from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';

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
  const [errors, setErrors] = useState<SiteNoticeField[]>([]);

  const errorFor = (field: SiteNoticeField) =>
    errors.includes(field) ? requiredMessage(siteNoticeFieldNames[field]) : undefined;

  const update = (field: SiteNoticeField, value: string) => {
    setSiteNoticeField(field, value);
    const nextForm = { ...form, [field]: value };
    const stillRequired = requiredSiteNoticeFields(nextForm);
    setErrors(prev => prev.filter(k => k !== field && stillRequired.includes(k)));
    markUnsaved('siteNotice');
  };

  const handleSave = () => {
    const missing = requiredSiteNoticeFields(form).filter(k => !form[k].trim());
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
          {notificationMessage(errors.map(k => siteNoticeFieldNames[k]))}
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={locked ? undefined : 'Save and close'}
        onSave={locked ? undefined : handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Public notice
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

        <SiteNoticeAssessment
          form={form}
          locked={locked}
          errorFor={errorFor}
          onChange={update}
        />
      </Card>
    </div>
  );
}
