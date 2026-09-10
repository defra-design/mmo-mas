// Native D365 task form for reviewing evidence submitted by the applicant.
// Applicant evidence is imported into D365 as read-only columns; photograph
// references are OOB URL columns, so D365 displays the raw URL and globe button.
import { useNavigate } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  tokens,
  Card,
  Title3,
  Body1,
  Checkbox,
  Text,
} from '@fluentui/react-components';
import FormCommandBar from '../FormCommandBar';
import FormNotification from '../FormNotification';
import { useTasks } from '../../context/TaskContext';
import { hasSubmittedPublicNoticeEvidence } from '../../utils/publicNoticeEvidence';
import TaskRow from './TaskRow';
import TaskValue from './TaskValue';
import UrlField from './UrlField';

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
    marginBottom: tokens.spacingVerticalS,
  },
  intro: { color: tokens.colorNeutralForeground2 },
  location: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  locationHeading: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  divider: { ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2) },
  completeRow: { display: 'flex', alignItems: 'flex-start' },
  savedLabel: {
    marginLeft: tokens.spacingHorizontalXS,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground2,
  },
});

const EVIDENCE = [
  {
    name: 'Teignmouth Harbour entrance noticeboard',
    date: '18 August 2026',
    closeUpUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/teignmouth-harbour-entrance-close-up.jpg',
    closeUpHref: '/cdp/evidence/location-1-close-up.svg',
    surroundingsUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/teignmouth-harbour-entrance-surroundings.jpg',
    surroundingsHref: '/cdp/evidence/location-1-surroundings.svg',
  },
  {
    name: 'Fish Quay public noticeboard',
    date: '18 August 2026',
    closeUpUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/fish-quay-close-up.jpg',
    closeUpHref: '/cdp/evidence/location-2-close-up.svg',
    surroundingsUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/fish-quay-surroundings.jpg',
    surroundingsHref: '/cdp/evidence/location-2-surroundings.svg',
  },
  {
    name: 'Back Beach access point',
    date: '19 August 2026',
    closeUpUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/back-beach-close-up.jpg',
    closeUpHref: '/cdp/evidence/location-3-close-up.svg',
    surroundingsUrl:
      'https://marine-licensing-url/evidence/MLA-2026-10014/back-beach-surroundings.jpg',
    surroundingsHref: '/cdp/evidence/location-3-surroundings.svg',
  },
];

type Props = { caseId: string };

export default function ReviewPublicNoticeEvidenceTask({ caseId }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const {
    publicNoticeEvidenceMeta,
    saved,
    setPublicNoticeEvidenceCompleted,
    markUnsaved,
    savePublicNoticeEvidence,
  } = useTasks();
  const available = hasSubmittedPublicNoticeEvidence(caseId);
  const caseUrl = `/receive-assess/cases/${encodeURIComponent(caseId)}`;

  const handleSave = () => {
    savePublicNoticeEvidence();
    navigate(caseUrl);
  };

  return (
    <div className={styles.page}>
      {!available && (
        <FormNotification level="read-only">
          This task is only available after the applicant submits public notice evidence.
        </FormNotification>
      )}

      <FormCommandBar
        saveLabel={available ? 'Save and close' : undefined}
        onSave={available ? handleSave : undefined}
        backTo={caseUrl}
      />

      <Card className={styles.headerCard}>
        <Title3>
          Review public notice evidence
          <span className={styles.savedLabel}>
            - {saved.publicNoticeEvidence ? 'Saved' : 'Unsaved'}
          </span>
        </Title3>
        <div><Body1>Task</Body1></div>
      </Card>

      {available && (
        <Card className={styles.bodyCard}>
          <div>
            <Text block className={styles.sectionHeading}>Site notice evidence</Text>
            <Body1 className={styles.intro}>
              The applicant submitted evidence for 3 locations on 20 August 2026.
            </Body1>
          </div>

          {EVIDENCE.map((location, index) => (
            <div className={styles.location} key={location.name}>
              {index > 0 && <div className={styles.divider} />}
              <Text block className={styles.locationHeading}>Location {index + 1}</Text>
              <TaskRow label="Location name" locked>
                <TaskValue>{location.name}</TaskValue>
              </TaskRow>
              <TaskRow label="Date displayed" locked>
                <TaskValue>{location.date}</TaskValue>
              </TaskRow>
              <TaskRow label="Close-up photograph of the notice" locked>
                <UrlField
                  url={location.closeUpUrl}
                  href={location.closeUpHref}
                  launchLabel={`Open close-up photograph for Location ${index + 1}`}
                />
              </TaskRow>
              <TaskRow label="Photograph showing the notice in its surroundings" locked top>
                <UrlField
                  url={location.surroundingsUrl}
                  href={location.surroundingsHref}
                  launchLabel={`Open surroundings photograph for Location ${index + 1}`}
                />
              </TaskRow>
            </div>
          ))}

          <div className={styles.divider} />
          <div className={styles.completeRow}>
            <Checkbox
              label="Select to mark the task as complete"
              checked={publicNoticeEvidenceMeta.completed}
              onChange={(_, data) => {
                setPublicNoticeEvidenceCompleted(Boolean(data.checked));
                markUnsaved('publicNoticeEvidence');
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}
