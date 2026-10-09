// Native D365 task form for the Marine plan policies task (MLA/2026/10002). The
// policy assessments are related records listed in a read-only subgrid; each
// opens its own form (MarinePlanPolicyTask), which validates its own fields.
// The task has nothing of its own to edit and no "mark as complete" checkbox:
// its status follows the assessments, Done once every policy is assessed.
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, shorthands, tokens, Body1, Card, Text, Title3,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import MppAssessmentGrid from './MppAssessmentGrid';
import type { PolicyRow } from './MppAssessmentGrid';
import { useTasks } from '../../context/TaskContext';
import { siteCheckCompleteForCase } from '../../utils/publicNoticeEvidence';
import { mppAssessmentStatus, policies } from '../../utils/marinePlanPolicies';
import { CANNOT_START_MESSAGE } from '../../utils/validationMessages';

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
    gap: tokens.spacingVerticalXXS,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalM,
  },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

type Props = { caseId: string };

export default function MarinePlanPoliciesTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { tasks, mppForm } = useTasks();
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;
  // Gated behind Site check. The record still opens, read-only, and so do its
  // policy assessments.
  const locked = !siteCheckCompleteForCase(caseId, tasks);

  const rows: PolicyRow[] = policies.map(policy => ({
    code: policy.code,
    policy: policy.label,
    group: policy.group,
    status: mppAssessmentStatus(mppForm[policy.code], locked),
    outcome: mppForm[policy.code]?.outcome || '---',
  }));

  return (
    <div className={styles.page}>
      {locked && <FormNotification level="read-only">{CANNOT_START_MESSAGE}</FormNotification>}
      <FormCommandBar saveLabel="Save and close" onSave={() => navigate(caseUrl)} backTo={caseUrl} />

      <Card className={styles.headerCard}>
        <Title3>
          Marine plan policies
          {/* Nothing on the task itself is edited, so it is always Saved. */}
          <span className={styles.savedLabel}>- Saved</span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      <Card className={styles.sectionCard}>
        <Text block className={styles.sectionHeading}>Policy assessments</Text>
        <MppAssessmentGrid
          caseId={caseId}
          rows={rows}
          onOpen={code => navigate(`${caseUrl}/tasks/marine-plan-policies/${code}`)}
        />
      </Card>
    </div>
  );
}
