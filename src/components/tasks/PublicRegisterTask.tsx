// src/components/tasks/PublicRegisterTask.tsx
// Task form for "Withholding information" (formerly Public register). Section 1 is
// the applicant's answers: whether they asked for anything to be withheld and the
// reason they chose (read-only columns on the case). The live cases use the
// commercial or industrial confidentiality reason, so section 2 shows the
// applicant's explanation with the caseworker's decision on it. The national
// security variations are mockups only (public/mockups/withhold-information).
// Then come the personal-information check and the URL column that launches the
// redaction journey on CDP. Every show/hide here is an OOB business rule on a
// choice field or on the applicant's own answer, so none of it needs code.
// A Two Options checkbox marks the task complete: ticked -> Done on save,
// unticked -> In progress (OOB Task activity statuses), as on Prep for consultee.
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
  Checkbox,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import TaskRow from './TaskRow';
import TaskValue from './TaskValue';
import TaskChoice from './TaskChoice';
import TaskTextarea from './TaskTextarea';
import WithholdDecision from './WithholdDecision';
import UrlField from './UrlField';
import { CommercialRationaleHint, PersonalInfoHint } from './publicRegisterHints';
import {
  FIELD_NAMES,
  requiredFields,
  yesNoOptions,
  YES,
  type FieldKey,
} from './publicRegisterFields';
import {
  CANNOT_START_MESSAGE,
  notificationMessage,
  requiredMessage,
} from '../../utils/validationMessages';
import { useTasks } from '../../context/TaskContext';
import { taskStatusForCase } from '../../utils/publicNoticeEvidence';

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
    marginBottom: tokens.spacingVerticalL,
  },
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

// The applicant's submitted answer, which arrives with the application from CDP.
// Matches the Withholding information tab (public/cdp/public-register.html).
const REASON = 'Commercial or industrial confidentiality';
const APPLICANT_REQUEST =
  'We would like the fees and financial figures in our activity description withheld. A ' +
  'second operator is expected to bid for a concession in the same harbour next year, and ' +
  'if they can see what we are paying and what we expect to take they can pitch against us. ' +
  'We would also like the pontoon dimensions and fixing method shown on our construction ' +
  'drawing withheld. We spent two years getting this set-up right and we do not want ' +
  'another hire business copying it.';

// Displayed as the OOB URL column value. The real CDP journey isn't live, so
// the click target is the GOV.UK prototype instead (prototype-only split).
// Cases whose Withholding information guidance collapses behind "Help with ..."
// disclosures rather than sitting open on the form. Both presentations are in the
// prototype so the round of testing on 10014 (open) and 10015 (disclosure) can
// compare them; the guidance copy itself is identical either way. 10013 has no
// assessment section, so this only affects its personal-information guidance.
const GUIDANCE_AS_DISCLOSURE = ['MLA/2026/10013', 'MLA/2026/10015'];

// Cases where the applicant answered "No" to the withholding question. There is
// then nothing to assess: the reason field and the decision section come off the
// form. Modelled as a business rule on
// the applicant's own answer, exactly like every other reveal on this form.
const NO_WITHHOLD_REQUEST = ['MLA/2026/10013'];

const REDACT_URL = 'https://marine-licensing-url/redact/6a39375b0e7bc1f2d84a';
const REDACT_HREF =
  'https://marine-licensing-prototype-5b7b33ca29e1.herokuapp.com/versions/multiple-sites-v2/low-complexity-v4/redact/redact-details?redact-site-type=circular';

interface PublicRegisterTaskProps {
  caseId: string;
}

export default function PublicRegisterTask({ caseId }: PublicRegisterTaskProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, publicRegisterForm: form, saved, setPublicRegisterField, markUnsaved, savePublicRegister } =
    useTasks();
  // Gated behind Site check. The record still opens — D365 cannot lock a
  // caseworker out — but it opens read-only: padlocked fields, no Save command.
  const locked =
    taskStatusForCase(caseId, 'publicRegister', tasks.publicRegister) === 'Cannot start yet';
  const hideGuidance = GUIDANCE_AS_DISCLOSURE.includes(caseId);
  // Did the applicant ask for anything to be withheld? If not there is no
  // decision to make.
  const assessed = !NO_WITHHOLD_REQUEST.includes(caseId);
  // Fields left empty on a failed save. Each clears as soon as it's given a value.
  const [errors, setErrors] = useState<FieldKey[]>([]);

  const errorFor = (field: FieldKey) =>
    errors.includes(field) ? requiredMessage(FIELD_NAMES[field]) : undefined;

  const update = (field: FieldKey, value: string) => {
    setPublicRegisterField(field, value);
    setErrors(prev => prev.filter(k => k !== field));
    markUnsaved('publicRegister');
  };

  const handleSave = () => {
    const missing = requiredFields(form, assessed).filter(k => !form[k].trim());
    setErrors(missing);
    if (missing.length) return;
    savePublicRegister();
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
        saveLabel="Save and close"
        onSave={locked ? () => navigate(`/receive-assess/cases/${encodeURIComponent(caseId)}`) : handleSave}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Withholding information
          <span className={styles.savedLabel}>- {saved.publicRegister ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>The applicant's request</Text>
        <div className={styles.answers}>
          <TaskRow label="Did the applicant ask for information to be withheld?" locked>
            <TaskValue>{assessed ? 'Yes' : 'No'}</TaskValue>
          </TaskRow>
          {/* Nothing was requested, so the applicant never chose a reason. */}
          {assessed && (
            <TaskRow label="Their reason" locked>
              <TaskValue>{REASON}</TaskValue>
            </TaskRow>
          )}
        </div>
      </Card>

      {/* No request to decide on when the applicant answered "No". */}
      {assessed && (
        <WithholdDecision
          heading={REASON}
          locked={locked}
          fields={{
            agree: 'commercialAgree',
            applicantText: 'commercialApplicantText',
            rationale: 'commercialRationale',
          }}
          values={form}
          errorFor={errorFor}
          onChange={update}
          guidance={<CommercialRationaleHint disclosure={hideGuidance} />}
        >
          <TaskRow label="What they want withheld and why" locked top>
            <TaskValue multiline>{APPLICANT_REQUEST}</TaskValue>
          </TaskRow>
        </WithholdDecision>
      )}

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>
          Personal information check
        </Text>
        <div className={styles.answers}>
          <TaskRow
            label="Does the application, or any supporting documents, contain personal information about someone else that must be removed before publishing?"
            required
            locked={locked}
            top
          >
            <TaskChoice
              value={form.personalInfo}
              options={yesNoOptions}
              onSelect={v => update('personalInfo', v)}
              locked={locked}
              error={errorFor('personalInfo')}
            />
          </TaskRow>
          <PersonalInfoHint disclosure={hideGuidance} />

          {/* Internal only — the applicant isn't told, the information just goes. */}
          {form.personalInfo === YES && (
            <TaskRow label="What personal information needs to be redacted, and why?" required locked={locked} top>
              <TaskTextarea
                value={form.personalInfoDetail}
                onChange={v => update('personalInfoDetail', v)}
                locked={locked}
                error={errorFor('personalInfoDetail')}
              />
            </TaskRow>
          )}
        </div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>
          Redact the application
        </Text>
        <TaskRow
          label="Select the link to redact the application. You will be able to choose which parts of the application to redact."
          locked
          top
        >
          <UrlField
            url={REDACT_URL}
            href={REDACT_HREF}
            launchLabel="Redact the application on CDP"
          />
        </TaskRow>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Complete task</Text>
        {/* The task can't be completed while it's gated, so D365 renders the
            Two Options field disabled along with the rest of the locked form. */}
        <div className={styles.answers}>
          <Body1>
            Any information for the applicant will be sent when the task is complete.
          </Body1>
          <TaskRow label="Select to mark the task as complete" locked={locked}>
            <Checkbox
              aria-label="Select to mark the task as complete"
              checked={form.completed}
              disabled={locked}
              onChange={(_, data) => {
                setPublicRegisterField('completed', Boolean(data.checked));
                markUnsaved('publicRegister');
              }}
            />
          </TaskRow>
        </div>
      </Card>
    </div>
  );
}
