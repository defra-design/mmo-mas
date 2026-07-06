// src/components/MarineCaseSummary.tsx
import { useEffect, useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Avatar,
  Card,
  Text,
  Title3,
  Body1,
  Caption1,
  TabList,
  Tab,
  Overflow,
  OverflowItem,
  useOverflowMenu,
  useIsOverflowItemVisible,
  Menu,
  MenuTrigger,
  MenuButton,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';
import { getAssigneeAvatarColor } from '../utils/avatarColors';
import { asset } from '../utils/asset';
import { useTasks } from '../context/TaskContext';
import FormCommandBar from './FormCommandBar';
import TaskList from './TaskList';
import MarinePlanPoliciesList from './MarinePlanPoliciesList';
import CdpFrame from './CdpFrame';
import marineCaseDetails from '../mock-data/marine-case-details.json';
import marineCases from '../mock-data/marine-licence-cases.json';

const useStyles = makeStyles({
  // Fills the height of the scrollable shell area; the header stays put while
  // only the tab content below it scrolls (matching D365).
  page: {
    backgroundColor: tokens.colorNeutralBackground2,
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  // Command bar + case header: fixed height, never scrolls.
  stickyTop: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  // Tab content area: takes the remaining height.
  content: {
    flexGrow: 1,
    minHeight: 0,
    marginTop: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
  },
  // Version 1: main region + persistent Tasks rail, side by side.
  contentRow: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    gap: tokens.spacingHorizontalM,
  },
  mainRegion: {
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  // Persistent Tasks panel shown on every tab (Version 1); scrolls its own content.
  tasksRail: {
    width: '305px',
    flexShrink: 0,
    minHeight: 0,
    overflowY: 'auto',
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
  },
  // Native (Case summary) content scrolls within the content area.
  summaryScroll: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  // White card that an iframe section fills; the iframe scrolls its own content.
  frameCard: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow4,
  },
  placeholder: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground3,
  },
  headerCard: { ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL) },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXXL,
    marginBottom: tokens.spacingVerticalL,
  },
  // The title holds at least ~240px and wraps its text (at word boundaries)
  // within that column. Once the title's min width and the meta strip can no
  // longer sit side by side, the meta strip wraps onto its own line underneath.
  // This is container-relative — it tracks the actual header width, not the
  // viewport, so it works regardless of nav/task-rail widths.
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '280px',
    minWidth: '240px',
  },
  titleText: { minWidth: 0 },
  metaGroup: { display: 'flex', gap: tokens.spacingHorizontalXXL, flexShrink: 0 },
  // Fill the header width so the overflow logic measures the real available
  // space — otherwise the shrink-to-fit TabList reports "full" and the overflow
  // menu kicks in while there's still room for more tabs.
  tabList: { width: '100%' },
  metaItem: { display: 'flex', flexDirection: 'column' },
  metaLabel: { color: tokens.colorNeutralForeground3 },
  assignedItem: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  layout: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalM, alignItems: 'flex-start' },
  mainCard: { flex: '1 1 320px', minWidth: 0, ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL) },
  tasksCard: { width: '260px', flexShrink: 0, ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL) },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalL,
  },
  fieldColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalXXL,
  },
  fieldColumn: {
    flex: '1 1 320px',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  field: { display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'center', gap: tokens.spacingHorizontalM },
  fieldLabel: {},
  fieldValue: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
});

interface MarineCaseSummaryProps {
  caseId: string;
}

// Tabs whose content is CDP application data rendered in an iframe. Paths are
// resolved through asset() so a frozen iteration loads its own CDP pages.
const cdpPages: Record<string, { src: string; title: string }> = {
  project: { src: asset('cdp/project-details.html'), title: 'Project details' },
  site: { src: asset('cdp/site-and-activity.html'), title: 'Site and activity' },
  mpp: { src: asset('cdp/marine-plan-policies.html'), title: 'Marine plan policies' },
  wfd: { src: asset('cdp/water-framework-directive.html'), title: 'Water Framework Directive' },
  other: { src: asset('cdp/other-permissions.html'), title: 'Other permissions' },
  'public-register': { src: asset('cdp/public-register.html'), title: 'Public register' },
};

// The case tabs, in order. Driven by data so the overflow menu can list the
// tabs that don't fit on screen.
const tabs: { id: string; name: string }[] = [
  { id: 'summary', name: 'Case summary' },
  { id: 'project', name: 'Project details' },
  { id: 'site', name: 'Sites and activities' },
  { id: 'mpp', name: 'Marine plan policies' },
  { id: 'wfd', name: 'Water Framework Directive' },
  { id: 'other', name: 'Other permissions' },
  { id: 'public-register', name: 'Public register' },
];

// A single overflowed tab, shown as a menu item; visible tabs render nothing.
function OverflowTabMenuItem({
  id,
  name,
  onClick,
}: {
  id: string;
  name: string;
  onClick: () => void;
}) {
  const isVisible = useIsOverflowItemVisible(id);
  if (isVisible) return null;
  return <MenuItem onClick={onClick}>{name}</MenuItem>;
}

// The "…" button, shown only when one or more tabs don't fit; opens a menu of
// the hidden tabs (matching the D365 model-driven form overflow flyout).
function OverflowTabsMenu({ onTabSelect }: { onTabSelect: (id: string) => void }) {
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();
  if (!isOverflowing) return null;
  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          ref={ref}
          appearance="transparent"
          icon={<MoreHorizontalRegular />}
          menuIcon={null}
          aria-label={`${overflowCount} more tabs`}
          role="tab"
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {tabs.map(tab => (
            <OverflowTabMenuItem
              key={tab.id}
              id={tab.id}
              name={tab.name}
              onClick={() => onTabSelect(tab.id)}
            />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}

export default function MarineCaseSummary({ caseId }: MarineCaseSummaryProps) {
  const styles = useStyles();
  const { tasksOnAllTabs } = useTasks();
  const [selectedTab, setSelectedTab] = useState('summary');

  // Teignmouth (MLA/2026/1002) is fully built; other references fall back to their list row.
  const details = (marineCaseDetails as Record<string, any>)[caseId];
  const row = marineCases.find(c => c.reference === caseId);

  // Case age is fixed at "1 day", so Submitted is always yesterday — shown in the
  // out-of-the-box D365 format (DD/MM/YYYY).
  const submittedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  })();
  const data = {
    reference: caseId,
    title: details?.title ?? row?.project ?? 'Marine licence case',
    status: details?.status ?? 'Allocated',
    assignedTo: details?.assignedTo ?? row?.caseOfficer ?? 'Unallocated',
    caseAge: details?.caseAge ?? row?.caseAge ?? '—',
    applicationType: details?.applicationType ?? 'Marine licence',
    submitted: details ? submittedDate : '—',
    feeBand: details?.feeBand ?? '—',
    applicant: details?.applicant ?? '—',
    organisation: details?.organisation ?? '—',
    caseOfficer: details?.caseOfficer ?? 'Sam Evans',
    consentToPublish: details?.consentToPublish ?? '—',
  };

  useEffect(() => {
    document.title = `${data.reference} - MMO Marine Applications System`;
  }, [data.reference]);

  const meta = [
    { label: 'Reference', value: data.reference },
    { label: 'Status', value: data.status },
    { label: 'Case age', value: data.caseAge },
    { label: 'Assigned to', value: data.assignedTo },
  ];

  const leftFields = [
    { label: 'Reference', value: data.reference },
    { label: 'Application type', value: data.applicationType },
    { label: 'Submitted', value: data.submitted },
    { label: 'Fee band', value: data.feeBand },
  ];

  const rightFields = [
    { label: 'Applicant', value: data.applicant },
    { label: 'Organisation', value: data.organisation },
    { label: 'Case Officer', value: data.caseOfficer },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.stickyTop}>
      <FormCommandBar showReject />

      <Card className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.titleGroup}>
            <Avatar name={data.title} size={48} color="colorful" style={{ flexShrink: 0 }} />
            <div className={styles.titleText}>
              <Title3>{data.title}</Title3>
              <div><Body1>Case</Body1></div>
            </div>
          </div>
          <div className={styles.metaGroup}>
            {meta.map(m =>
              m.label === 'Assigned to' ? (
                <div key={m.label} className={styles.assignedItem}>
                  <Avatar
                    name={m.value}
                    size={32}
                    color="colorful"
                    style={{ backgroundColor: getAssigneeAvatarColor(m.value) }}
                  />
                  <div className={styles.metaItem}>
                    <Body1>{m.value}</Body1>
                    <Caption1 className={styles.metaLabel}>{m.label}</Caption1>
                  </div>
                </div>
              ) : (
                <div key={m.label} className={styles.metaItem}>
                  <Body1>{m.value}</Body1>
                  <Caption1 className={styles.metaLabel}>{m.label}</Caption1>
                </div>
              )
            )}
          </div>
        </div>

        <Overflow minimumVisible={1}>
          <TabList
            className={styles.tabList}
            selectedValue={selectedTab}
            onTabSelect={(_, d) => setSelectedTab(d.value as string)}
            size="large"
          >
            {tabs.map(tab => (
              // The active tab gets a higher priority so it's never the one hidden.
              <OverflowItem key={tab.id} id={tab.id} priority={selectedTab === tab.id ? 2 : 1}>
                <Tab value={tab.id}>{tab.name}</Tab>
              </OverflowItem>
            ))}
            <OverflowTabsMenu onTabSelect={setSelectedTab} />
          </TabList>
        </Overflow>
      </Card>
      </div>

      <div className={styles.content}>
        <div className={styles.contentRow}>
          <div className={styles.mainRegion}>
            {selectedTab === 'summary' && (
              <div className={styles.summaryScroll}>
                <div className={styles.layout}>
                  <Card className={styles.mainCard}>
                    <Text as="h2" className={styles.sectionHeading}>Case summary</Text>
                    <div className={styles.fieldColumns}>
                      {[leftFields, rightFields].map((col, i) => (
                        <div key={i} className={styles.fieldColumn}>
                          {col.map(f => (
                            <div key={f.label} className={styles.field}>
                              <Text className={styles.fieldLabel}>{f.label}</Text>
                              <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Version 2: Tasks panel sits inline on the Case summary tab.
                      Version 1 renders it in the persistent rail instead. */}
                  {!tasksOnAllTabs && (
                    <Card className={styles.tasksCard}>
                      <TaskList caseId={caseId} />
                      <MarinePlanPoliciesList caseId={caseId} />
                    </Card>
                  )}
                </div>
              </div>
            )}

            {cdpPages[selectedTab] && (
              <div className={styles.frameCard}>
                <CdpFrame src={cdpPages[selectedTab].src} title={cdpPages[selectedTab].title} />
              </div>
            )}

            {selectedTab !== 'summary' && !cdpPages[selectedTab] && (
              <div className={styles.frameCard}>
                <div className={styles.placeholder}>This section is not yet available in the prototype.</div>
              </div>
            )}
          </div>

          {/* Version 1: one Tasks panel that persists across every tab. */}
          {tasksOnAllTabs && (
            <Card className={styles.tasksRail}>
              <TaskList caseId={caseId} />
              <MarinePlanPoliciesList caseId={caseId} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
