// src/components/MarineCaseSummary.tsx
import { useEffect, useState } from 'react';
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
  Button,
  Field,
  Textarea,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@fluentui/react-components';
import { MoreHorizontalRegular, DismissRegular } from '@fluentui/react-icons';
import { getAssigneeAvatarColor } from '../utils/avatarColors';
import { asset } from '../utils/asset';
import { useTasks } from '../context/TaskContext';
import FormCommandBar from './FormCommandBar';
import TaskList from './TaskList';
import MarinePlanPoliciesList from './MarinePlanPoliciesList';
import MarinePlanPoliciesSubgrid from './MarinePlanPoliciesSubgrid';
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
  // Full-width MPP list stacked under the summary + tasks (MLA/2026/10013 variant).
  mppFullWidthCard: {
    marginTop: tokens.spacingHorizontalM,
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
  },
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
  transferDetailsValue: { whiteSpace: 'pre-wrap' },
  transferFields: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  transferTextarea: { minHeight: '160px' },
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
  const { tasksOnAllTabs, transfer, transferToMcms } = useTasks();
  const [selectedTab, setSelectedTab] = useState('summary');

  // Transfer to MCMS dialog state. `transferError` drives the OOB required-field
  // validation on the Transfer details textarea.
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferDetails, setTransferDetails] = useState('');
  const [transferError, setTransferError] = useState('');

  // This case's transfer record (transfer is scoped to a single case).
  const caseTransfer = transfer?.caseId === caseId ? transfer : null;
  const isTransferred = Boolean(caseTransfer);

  // MPP design explorations live only on the duplicate cases; the original
  // MLA/2026/10002 keeps its plain single "Marine plan policies" task row.
  //  · 10012 → paginated policy list in the right-hand rail
  //  · 10013 → full-width policy subgrid stacked under the Case summary + Tasks
  //  · 10014 → policy subgrid replaces the CDP view on the Marine plan policies
  //           tab, and every task is ungated (demo of the merged review/assess).
  const mppRailList = caseId === 'MLA/2026/10012';
  const mppFullWidth = caseId === 'MLA/2026/10013';
  const mppTabList = caseId === 'MLA/2026/10014';
  const mppAsList = mppRailList || mppFullWidth || mppTabList;
  const ungated = mppTabList;
  const showRail = tasksOnAllTabs && !mppFullWidth;

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
    caseOfficer: details?.caseOfficer ?? 'Sam Evans',
    consentToPublish: details?.consentToPublish ?? '—',
  };

  useEffect(() => {
    document.title = `${data.reference} - MMO Marine Applications System`;
  }, [data.reference]);

  const meta = [
    { label: 'Reference', value: data.reference },
    { label: 'Status', value: isTransferred ? 'Transferred' : data.status },
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

  const openTransfer = () => {
    setTransferDetails('');
    setTransferError('');
    setTransferOpen(true);
  };

  // Cancel / dismiss: close the dialog leaving the case unchanged.
  const cancelTransfer = () => setTransferOpen(false);

  // OOB required-field validation on the details textarea, then record the
  // transfer, close the dialog and return to a transferred state.
  const confirmTransfer = () => {
    if (!transferDetails.trim()) {
      setTransferError('You must provide a value for Transfer details.');
      return;
    }
    transferToMcms(caseId, transferDetails.trim(), data.caseOfficer);
    setTransferOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.stickyTop}>
      <FormCommandBar showReject showTransfer={!isTransferred} onTransfer={openTransfer} />

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

                  {/* Tasks panel sits inline on the Case summary tab when it isn't
                      in the persistent rail (Version 2, or the full-width MPP variant). */}
                  {!showRail && (
                    <Card className={styles.tasksCard}>
                      <TaskList caseId={caseId} mppInSeparateList={mppAsList} ungated={ungated} />
                      {mppRailList && <MarinePlanPoliciesList caseId={caseId} />}
                    </Card>
                  )}
                </div>

                {/* Full-width MPP subgrid stacked under the summary + tasks (10013). */}
                {mppFullWidth && (
                  <Card className={styles.mppFullWidthCard}>
                    <MarinePlanPoliciesSubgrid caseId={caseId} />
                  </Card>
                )}

                {/* Read-only Transfer to MCMS record, shown once transferred. */}
                {caseTransfer && (
                  <Card className={styles.transferCard}>
                    <Text as="h2" className={styles.sectionHeading}>Transfer to MCMS details</Text>
                    <div className={styles.transferFields}>
                      {[
                        { label: 'Transferred by', value: caseTransfer.transferredBy },
                        { label: 'Date transferred', value: caseTransfer.date },
                      ].map(f => (
                        <div key={f.label} className={styles.field}>
                          <Text className={styles.fieldLabel}>{f.label}</Text>
                          <div className={styles.fieldValue}><Body1>{f.value}</Body1></div>
                        </div>
                      ))}
                      <div className={styles.transferField}>
                        <Text className={styles.fieldLabel}>Transfer details</Text>
                        <div className={mergeClasses(styles.fieldValue, styles.transferDetailsValue)}>
                          <Body1>{caseTransfer.details}</Body1>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* 10014: the Marine plan policies tab is the caseworker subgrid
                (all policies "To do", click to assess), not the CDP applicant view. */}
            {mppTabList && selectedTab === 'mpp' && (
              <div className={styles.summaryScroll}>
                <Card className={styles.mppFullWidthCard}>
                  <MarinePlanPoliciesSubgrid caseId={caseId} defaultStatus="To do" ungated />
                </Card>
              </div>
            )}

            {cdpPages[selectedTab] && !(mppTabList && selectedTab === 'mpp') && (
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
          {showRail && (
            <Card className={styles.tasksRail}>
              <TaskList caseId={caseId} mppInSeparateList={mppAsList} ungated={ungated} />
              {mppRailList && <MarinePlanPoliciesList caseId={caseId} />}
            </Card>
          )}
        </div>
      </div>

      {/* Transfer to MCMS dialog — a custom modal following the OOB Resolve Case
          pattern (command-bar action → modal → close). */}
      <Dialog open={transferOpen} onOpenChange={(_, d) => setTransferOpen(d.open)} modalType="modal">
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<DismissRegular />}
                  onClick={cancelTransfer}
                />
              }
            >
              Transfer to MCMS
            </DialogTitle>
            <DialogContent>
              <Field
                label="Transfer details"
                required
                validationState={transferError ? 'error' : 'none'}
                validationMessage={transferError || undefined}
              >
                <Textarea
                  className={styles.transferTextarea}
                  value={transferDetails}
                  onChange={(_, d) => {
                    setTransferDetails(d.value);
                    if (transferError) setTransferError('');
                  }}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={confirmTransfer}>
                Transfer and close
              </Button>
              <Button appearance="secondary" onClick={cancelTransfer}>
                Cancel
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
