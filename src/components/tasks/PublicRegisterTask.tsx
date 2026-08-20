// src/components/tasks/PublicRegisterTask.tsx
// Task form for "Public register". Section 1 is the applicant's submitted answers
// (read-only columns on the case). Section 2 is the caseworker's assessment: an
// OOB Choice column for the grounds raised, which reveals a decision block per
// ground — or, for "Neither", a straight refusal the applicant is told about.
// Section 3 is the personal-information check, and section 4 the URL column that
// launches the redaction journey on CDP. Every show/hide here is an OOB business
// rule on a choice field, so none of it needs code in the real build.
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
import {
  FIELD_NAMES,
  relatesOptions,
  requiredFields,
  showsCommercial,
  showsNeither,
  showsRedact,
  showsSecurity,
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
  answers: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

// The applicant's submitted answer, which arrives with the application from CDP.
const APPLICANT_REQUEST =
  'We would like the unit rates table in section 4 of our method statement withheld, and ' +
  'also the vessel movement schedule in appendix B. The unit rates are commercially ' +
  'confidential and are only shared with our insurer. Two competitors operate in the same ' +
  'stretch of coast and if they can see our rates they can undercut us. The vessel movement ' +
  'schedule shows which boats we use and when, which we would rather our competitors did not have.';

// Displayed as the OOB URL column value. The real CDP journey isn't live, so
// the click target is the GOV.UK prototype instead (prototype-only split).
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
  const locked = tasks.publicRegister === 'Cannot start yet';
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
    const missing = requiredFields(form).filter(k => !form[k].trim());
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
        saveLabel={locked ? undefined : 'Save and close'}
        onSave={locked ? undefined : handleSave}
        showSendToApplicant={!locked}
        backTo={`/receive-assess/cases/${encodeURIComponent(caseId)}`}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Public register
          <span className={styles.savedLabel}>- {saved.publicRegister ? 'Saved' : 'Unsaved'}</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.bodyCard}>
        <div>
          <Text block className={styles.sectionHeading}>1. The applicant's request</Text>
          <div className={styles.answers}>
            <TaskRow label="Did the applicant ask for information to be withheld?" locked={locked}>
              <TaskValue>Yes</TaskValue>
            </TaskRow>
            <TaskRow label="What they want withheld and why" locked={locked} top>
              <TaskValue multiline>{APPLICANT_REQUEST}</TaskValue>
            </TaskRow>
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>2. Your assessment</Text>
          <div className={styles.answers}>
            <TaskRow label="What does the request relate to?" required locked={locked} top>
              <TaskChoice
                value={form.relatesTo}
                options={relatesOptions}
                onSelect={v => update('relatesTo', v)}
                locked={locked}
                error={errorFor('relatesTo')}
              />
            </TaskRow>

            {showsCommercial(form.relatesTo) && (
              <WithholdDecision
                heading="Commercial confidentiality"
                locked={locked}
                fields={{
                  agree: 'commercialAgree',
                  applicantText: 'commercialApplicantText',
                  rationale: 'commercialRationale',
                }}
                values={form}
                errorFor={errorFor}
                onChange={update}
              />
            )}

            {showsSecurity(form.relatesTo) && (
              <WithholdDecision
                heading="National security"
                locked={locked}
                fields={{
                  agree: 'securityAgree',
                  applicantText: 'securityApplicantText',
                  rationale: 'securityRationale',
                }}
                values={form}
                errorFor={errorFor}
                onChange={update}
              />
            )}

            {/* Neither ground is raised, so there is no decision to make — only the
                refusal to explain to the applicant, and the reasoning behind it. */}
            {showsNeither(form.relatesTo) && (
              <>
                <TaskRow label="What is your rationale?" required locked={locked} top>
                  <TaskTextarea
                    value={form.neitherRationale}
                    onChange={v => update('neitherRationale', v)}
                    locked={locked}
                    error={errorFor('neitherRationale')}
                  />
                </TaskRow>
                <TaskRow label="What do you want to tell the applicant?" required locked={locked} top>
                  <TaskTextarea
                    value={form.neitherApplicantText}
                    onChange={v => update('neitherApplicantText', v)}
                    locked={locked}
                    error={errorFor('neitherApplicantText')}
                  />
                </TaskRow>
              </>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        <div>
          <Text block className={styles.sectionHeading}>3. Personal information check</Text>
          <div className={styles.answers}>
            <TaskRow
              label="Does the application contain personal information that must be removed?"
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

            {/* Internal only — the applicant isn't told, the information just goes. */}
            {form.personalInfo === YES && (
              <TaskRow label="What personal information needs removing?" required locked={locked} top>
                <TaskTextarea
                  value={form.personalInfoDetail}
                  onChange={v => update('personalInfoDetail', v)}
                  locked={locked}
                  error={errorFor('personalInfoDetail')}
                />
              </TaskRow>
            )}
          </div>
        </div>

        {showsRedact(form.relatesTo) && (
          <>
            <div className={styles.divider} />
            <div>
              <Text block className={styles.sectionHeading}>4. Redact the application</Text>
              <TaskRow
                label="Select the link to redact the application. You will be able to choose which parts of the application to redact and record a reason for each one."
                locked={locked}
                top
              >
                <UrlField
                  url={REDACT_URL}
                  href={REDACT_HREF}
                  launchLabel="Redact the application on CDP"
                />
              </TaskRow>
            </div>
          </>
        )}

        <div className={styles.divider} />

        {/* The task can't be completed while it's gated, so D365 renders the
            Two Options field disabled along with the rest of the locked form. */}
        <Checkbox
          label="Select to mark the task as complete"
          checked={form.completed}
          disabled={locked}
          onChange={(_, data) => {
            setPublicRegisterField('completed', Boolean(data.checked));
            markUnsaved('publicRegister');
          }}
        />
      </Card>
    </div>
  );
}
