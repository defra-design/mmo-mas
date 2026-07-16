// src/components/MarineCaseSummary.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  makeStyles,
  mergeClasses,
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
import { MoreHorizontalRegular, SendRegular, ArrowExportRegular } from '@fluentui/react-icons';
import { getAssigneeAvatarColor } from '../utils/avatarColors';
import { asset } from '../utils/asset';
import { useTasks } from '../context/TaskContext';
import { caseStatus } from '../utils/caseStatus';
import { RequestTransferDialog, CompleteTransferDialog } from './TransferMcmsDialogs';
import RejectApplicationDialog from './RejectApplicationDialog';
import FormCommandBar from './FormCommandBar';
import TaskList from './TaskList';
import MarinePlanPoliciesList from './MarinePlanPoliciesList';
import MarinePlanPoliciesSubgrid from './MarinePlanPoliciesSubgrid';
import TasksSubgrid from './TasksSubgrid';
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
  // Native (React) tabs scroll the whole tab body — main region *and* Tasks rail —
  // as one, so the single scrollbar sits at the far right of the content area, as
  // D365 does. `flex-start` lets both columns take their content height instead of
  // stretching. Iframe tabs must NOT get this: their frameCard needs a fixed height
  // to grow into so the CDP page scrolls inside its own iframe.
  contentRowScroll: {
    overflowY: 'auto',
    alignItems: 'flex-start',
    // CSS forces overflow-x to `auto` once overflow-y isn't `visible`, so this box
    // clips at its own edges — cropping the cards' box-shadow flush against the
    // left nav. Pad it out past the shadow's reach and pull it back with a matching
    // negative margin, so the shadow has room and nothing else moves.
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: '8px',
    marginLeft: '-8px',
    marginRight: '-8px',
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
  // Groups a native tab's cards. Deliberately does not scroll — contentRowScroll
  // owns the scrolling, so the scrollbar lands right of the Tasks rail, not between.
  nativeTabBody: { minWidth: 0 },
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
  // Full-width MPP list. On 10014 it is the whole tab, so it must sit flush with
  // the top of the Tasks rail beside it — the gap above it is added by stackedCard
  // only where it actually follows another card (10013, 10015).
  mppFullWidthCard: {
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
  },
  stackedCard: { marginTop: tokens.spacingHorizontalM },
  // Full-width Task grid at the top of the dedicated Tasks tab (MLA/2026/10015).
  tasksTabCard: { ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL) },
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
  // "Transfer to MCMS details" card, stacked under the Case summary once the
  // case has been transferred (mirrors a read-only D365 section).
  transferCard: {
    marginTop: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
  },
  // The transfer details value can be multi-line, so it sits top-aligned and
  // preserves the caseworker's line breaks. Label column matches the Case summary
  // section above it (140px); the value stretches to the far right of the card.
  transferField: { display: 'grid', gridTemplateColumns: '140px 1fr', alignItems: 'start', gap: tokens.spacingHorizontalM },
  // A top-aligned row's value box carries its own vertical padding, which the bare
  // label does not — without matching it, the label rides above the first line of
  // the value beside it. Only the top-aligned rows need this; the centred ones
  // (styles.field) line up on their own.
  topAlignedLabel: { paddingTop: tokens.spacingVerticalS },
  transferDetailsValue: { whiteSpace: 'pre-wrap', minHeight: '160px' },
  transferFields: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
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
function OverflowTabsMenu({
  tabs,
  onTabSelect,
}: {
  tabs: { id: string; name: string }[];
  onTabSelect: (id: string) => void;
}) {
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
  const {
    tasksOnAllTabs,
    transfers,
    rejections,
    requestTransferToMcms,
    completeTransferToMcms,
    rejectApplication,
  } = useTasks();
  // A task form can request a specific landing tab via navigation state (e.g.
  // 10014's MPP assessment returns to the Marine plan policies tab on save so the
  // caseworker can pick the next policy). Otherwise 10015 leads with its dedicated
  // Tasks tab; every other case opens on Case summary.
  const location = useLocation();
  const requestedTab = (location.state as { tab?: string } | null)?.tab;
  const [selectedTab, setSelectedTab] = useState(
    requestedTab ?? (caseId === 'MLA/2026/10015' ? 'tasks' : 'summary')
  );

  // Which case-action dialog is open, if any. Each dialog owns its own fields and
  // validation state and is mounted only while open.
  const [openDialog, setOpenDialog] = useState<'request' | 'complete' | 'reject' | null>(null);

  // This case's transfer and rejection records. Each case keeps its own, independently.
  const caseTransfer = transfers[caseId] ?? null;
  const caseRejection = rejections[caseId] ?? null;
  const isRequested = Boolean(caseTransfer);
  const isTransferred = Boolean(caseTransfer?.mcmsReference);
  const isRejected = Boolean(caseRejection);

  // MPP design explorations live only on the duplicate cases; the original
  // MLA/2026/10002 keeps its plain single "Marine plan policies" task row.
  //  · 10012 → paginated policy list in the right-hand rail
  //  · 10013 → full-width policy subgrid stacked under the Case summary + Tasks
  //  · 10014 → policy subgrid replaces the CDP view on the Marine plan policies
  //           tab; WFD & MPP are gated behind Site check, but the policies stay
  //           openable in a disabled (Cannot start yet) state until it's done.
  //  · 10015 → dedicated "Tasks" tab (before Case summary) holding the full-width
  //           Task grid + full-width MPP subgrid; WFD & MPP gated behind Site check.
  const mppRailList = caseId === 'MLA/2026/10012';
  const mppFullWidth = caseId === 'MLA/2026/10013';
  const mppTabList = caseId === 'MLA/2026/10014';
  const tasksTab = caseId === 'MLA/2026/10015';
  const mppAsList = mppRailList || mppFullWidth || mppTabList || tasksTab;
  // 10013 shows the Tasks list in the persistent rail (across every tab) even
  // though it also has the full-width MPP subgrid stacked under the Case summary.
  // 10015 instead gives the tasks their own tab, so it opts out of the rail.
  const showRail = tasksOnAllTabs && !tasksTab;

  // 10015 prepends a dedicated "Tasks" tab ahead of Case summary.
  const caseTabs = tasksTab ? [{ id: 'tasks', name: 'Tasks' }, ...tabs] : tabs;

  // 10014's Marine plan policies tab is a native subgrid, not the CDP iframe.
  const nativeMppTab = mppTabList && selectedTab === 'mpp';
  // Tabs whose content is React rather than an iframe. These scroll as one body
  // (see contentRowScroll); iframe tabs keep their own inner scroll.
  const nativeTab =
    selectedTab === 'summary' || (tasksTab && selectedTab === 'tasks') || nativeMppTab;

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
    applicationType: details?.applicationType ?? 'Marine licence application',
    submitted: details ? submittedDate : '—',
    feeBand: details?.feeBand ?? '—',
    applicant: details?.applicant ?? '—',
    organisation: details?.organisation ?? '—',
    consentToPublish: details?.consentToPublish ?? '—',
  };

  useEffect(() => {
    document.title = `${data.reference} - MMO Marine Applications System`;
  }, [data.reference]);

  const meta = [
    { label: 'Reference', value: data.reference },
    { label: 'Status', value: caseStatus(transfers, rejections, caseId) ?? data.status },
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
  ];

  // The command bar drives whichever transfer step is next; once transferred it disappears.
  const openTransfer = () => setOpenDialog(isRequested ? 'complete' : 'request');
  const cancelDialog = () => setOpenDialog(null);

  // Every name recorded is the caseworker the case is assigned to, so a new case
  // with a new assignee records that person rather than a hardcoded one. (In the
  // real system the second transfer step is done by the Business Support Team, not
  // the Case Officer the case is assigned to.)
  const closeToSummary = () => {
    setOpenDialog(null);
    // Return to the Case summary tab so the updated record is in view, regardless
    // of which tab the action was triggered from.
    setSelectedTab('summary');
  };

  const confirmRequest = (reasons: string) => {
    requestTransferToMcms(caseId, reasons, data.assignedTo);
    closeToSummary();
  };

  const confirmComplete = (mcmsReference: string) => {
    completeTransferToMcms(caseId, mcmsReference, data.assignedTo);
    closeToSummary();
  };

  const confirmReject = (reasons: string[], notes: string) => {
    rejectApplication(caseId, reasons, notes, data.assignedTo);
    closeToSummary();
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyTop}>
      {/* One command that advances the transfer. The Case Officer *sends* a request
          to the Business Support Team (nothing has left MAS yet), so it takes the
          send icon; the export arrow is saved for the step where the case actually
          leaves for MCMS. The two never appear together, so each icon has to carry
          its own meaning rather than be read against the other.

          Rejecting is terminal, so it removes both commands. A case already on its
          way to MCMS can't be rejected here either — it is no longer this
          caseworker's to decide. */}
      <FormCommandBar
        showReject={!isRejected && !isRequested}
        onReject={() => setOpenDialog('reject')}
        showTransfer={!isTransferred && !isRejected}
        transferLabel={isRequested ? 'Complete transfer to MCMS' : 'Request transfer to MCMS'}
        transferIcon={isRequested ? <ArrowExportRegular /> : <SendRegular />}
        onTransfer={openTransfer}
      />

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
            {caseTabs.map(tab => (
              // The active tab gets a higher priority so it's never the one hidden.
              <OverflowItem key={tab.id} id={tab.id} priority={selectedTab === tab.id ? 2 : 1}>
                <Tab value={tab.id}>{tab.name}</Tab>
              </OverflowItem>
            ))}
            <OverflowTabsMenu tabs={caseTabs} onTabSelect={setSelectedTab} />
          </TabList>
        </Overflow>
      </Card>
      </div>

      <div className={styles.content}>
        <div className={mergeClasses(styles.contentRow, nativeTab && styles.contentRowScroll)}>
          <div className={styles.mainRegion}>
            {/* 10015: dedicated Tasks tab — full-width Task grid, then the
                full-width Marine plan policies subgrid stacked underneath. */}
            {tasksTab && selectedTab === 'tasks' && (
              <div className={styles.nativeTabBody}>
                <Card className={styles.tasksTabCard}>
                  <TasksSubgrid caseId={caseId} />
                </Card>
                <Card className={mergeClasses(styles.mppFullWidthCard, styles.stackedCard)}>
                  <MarinePlanPoliciesSubgrid caseId={caseId} />
                </Card>
              </div>
            )}

            {selectedTab === 'summary' && (
              <div className={styles.nativeTabBody}>
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

                  {/* Tasks panel sits inline on the Case summary tab when it isn't
                      in the persistent rail (Version 2, or the full-width MPP variant).
                      10015 keeps its tasks on the dedicated Tasks tab, not here. */}
                  {!showRail && !tasksTab && (
                    <Card className={styles.tasksCard}>
                      <TaskList caseId={caseId} mppInSeparateList={mppAsList} />
                      {mppRailList && <MarinePlanPoliciesList caseId={caseId} />}
                    </Card>
                  )}
                </div>

                {/* Read-only Transfer to MCMS record. The request fields appear as soon
                    as the Case Officer raises it; the completion fields only once the
                    Business Support Team have done the transfer and recorded the reference. */}
                {caseTransfer && (
                  <Card className={styles.transferCard}>
                    <Text as="h2" className={styles.sectionHeading}>Transfer to MCMS details</Text>
                    <div className={styles.transferFields}>
                      {[
                        { label: 'Transfer requested by', value: caseTransfer.requestedBy },
                        { label: 'Date requested', value: caseTransfer.dateRequested },
                      ].map(f => (
                        <div key={f.label} className={styles.field}>
                          <Text className={styles.fieldLabel}>{f.label}</Text>
                          <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                        </div>
                      ))}
                      <div className={styles.transferField}>
                        <Text className={mergeClasses(styles.fieldLabel, styles.topAlignedLabel)}>
                          Reasons for transfer
                        </Text>
                        <div className={mergeClasses(styles.fieldValue, styles.transferDetailsValue)}>
                          <Body1>{caseTransfer.reasons}</Body1>
                        </div>
                      </div>
                      {isTransferred &&
                        [
                          { label: 'Transferred by', value: caseTransfer.completedBy },
                          { label: 'Date transferred', value: caseTransfer.dateTransferred },
                          { label: 'MCMS reference', value: caseTransfer.mcmsReference },
                        ].map(f => (
                          <div key={f.label} className={styles.field}>
                            <Text className={styles.fieldLabel}>{f.label}</Text>
                            <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}

                {/* Read-only Rejection record, written by the Reject application
                    command. Same read-only section pattern as the transfer record. */}
                {caseRejection && (
                  <Card className={styles.transferCard}>
                    <Text as="h2" className={styles.sectionHeading}>Rejection details</Text>
                    <div className={styles.transferFields}>
                      {[
                        { label: 'Rejected by', value: caseRejection.rejectedBy },
                        { label: 'Date rejected', value: caseRejection.dateRejected },
                      ].map(f => (
                        <div key={f.label} className={styles.field}>
                          <Text className={styles.fieldLabel}>{f.label}</Text>
                          <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                        </div>
                      ))}
                      {/* A multi-select choice reads back as its selected values on
                          one line, the way D365 shows a Choices field. */}
                      <div className={styles.transferField}>
                        <Text className={mergeClasses(styles.fieldLabel, styles.topAlignedLabel)}>
                          Sections of the application with issues
                        </Text>
                        <div className={styles.fieldValue}>
                          <Body1>{caseRejection.reasons.join(', ')}</Body1>
                        </div>
                      </div>
                      <div className={styles.transferField}>
                        <Text className={mergeClasses(styles.fieldLabel, styles.topAlignedLabel)}>
                          Provide details for each issue
                        </Text>
                        <div className={mergeClasses(styles.fieldValue, styles.transferDetailsValue)}>
                          <Body1>{caseRejection.notes}</Body1>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Full-width MPP subgrid, stacked below the summary, tasks and the
                    transfer record (10013) — the transfer details belong with the
                    case's own fields, above the policy assessments. */}
                {mppFullWidth && (
                  <Card className={mergeClasses(styles.mppFullWidthCard, styles.stackedCard)}>
                    <MarinePlanPoliciesSubgrid caseId={caseId} />
                  </Card>
                )}
              </div>
            )}

            {/* 10014: the Marine plan policies tab is the caseworker subgrid
                (all policies "To do", click to assess), not the CDP applicant view. */}
            {nativeMppTab && (
              <div className={styles.nativeTabBody}>
                <Card className={styles.mppFullWidthCard}>
                  <MarinePlanPoliciesSubgrid caseId={caseId} defaultStatus="To do" openableWhenLocked />
                </Card>
              </div>
            )}

            {cdpPages[selectedTab] && !nativeMppTab && (
              <div className={styles.frameCard}>
                <CdpFrame
                  // 10015 shows the sector-grouped MPP view (one page per sector);
                  // 10002 (Teignmouth) shows the multi-site, multi-activity Sites and
                  // activities view — every other case keeps the single-site default.
                  src={
                    tasksTab && selectedTab === 'mpp'
                      ? asset('cdp/marine-plan-policies-sectors.html')
                      : caseId === 'MLA/2026/10002' && selectedTab === 'site'
                        ? asset('cdp/site-and-activity-multi.html')
                        : cdpPages[selectedTab].src
                  }
                  title={cdpPages[selectedTab].title}
                />
              </div>
            )}

            {selectedTab !== 'summary' && !cdpPages[selectedTab] && !(tasksTab && selectedTab === 'tasks') && (
              <div className={styles.frameCard}>
                <div className={styles.placeholder}>This section is not yet available in the prototype.</div>
              </div>
            )}
          </div>

          {/* Version 1: one Tasks panel that persists across every tab. */}
          {showRail && (
            <Card className={styles.tasksRail}>
              <TaskList caseId={caseId} mppInSeparateList={mppAsList} />
              {mppRailList && <MarinePlanPoliciesList caseId={caseId} />}
            </Card>
          )}
        </div>
      </div>

      {openDialog === 'request' && (
        <RequestTransferDialog onCancel={cancelDialog} onConfirm={confirmRequest} />
      )}
      {openDialog === 'complete' && (
        <CompleteTransferDialog onCancel={cancelDialog} onConfirm={confirmComplete} />
      )}
      {openDialog === 'reject' && (
        <RejectApplicationDialog onCancel={cancelDialog} onConfirm={confirmReject} />
      )}
    </div>
  );
}
