// src/context/TaskContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { policyCount } from '../utils/marinePlanPolicies';

export type TaskStatus = 'Done' | 'To do' | 'Cannot start yet';

export interface TaskState {
  siteCheck: TaskStatus;
  wfdAssessment: TaskStatus;
  marinePlanPolicies: TaskStatus;
}

export interface SiteCheckForm {
  coordinatesOk: string;
  withinMile: string;
  notes: string;
}

export interface WfdForm {
  review: string;
}

// A caseworker's assessment of one marine plan policy.
export interface MppAnswer {
  outcome: string;
  reason: string;
}

// The MPP task is 1-to-many: one answer per policy, keyed by policy code.
export type MppForm = Record<string, MppAnswer>;

// Tracks whether each task's form has unsaved edits. False = "Unsaved" until the
// task is saved; an edit flips it back to false (matches D365 dirty-tracking).
export interface SavedState {
  siteCheck: boolean;
  wfdAssessment: boolean;
  marinePlanPolicies: boolean;
}

// Records a "Transfer to MCMS" against one case. Two stages, done by two teams:
// the Case Officer (CO) requests the transfer, then the Business Support Team
// (BST) carry it out by hand in the legacy MCMS system and record the reference
// it was given there. The completion fields stay undefined until that second step.
export interface TransferState {
  requestedBy: string;
  dateRequested: string;
  reasons: string;
  completedBy?: string;
  dateTransferred?: string;
  mcmsReference?: string;
}

// Every case's transfer record, keyed by case reference. Cases are independent:
// transferring one must never disturb another's status, because a caseworker can
// have several in flight (and, in future, cases rejected rather than transferred).
// The Status a case shows while a transfer is in flight is derived from this map
// by `transferStatus` in src/utils/transferStatus.ts.
export type TransfersState = Record<string, TransferState>;

// Today, in the out-of-the-box D365 format (DD/MM/YYYY).
function today() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

interface PersistedState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  saved: SavedState;
  // Every case's Transfer to MCMS record, keyed by case reference.
  transfers: TransfersState;
  // Prototype demo flag (set from the index page): Version 2 (false) = Tasks
  // panel on the Case summary tab only; Version 1 (true) = Tasks panel persists
  // on every case tab. See IndexPage.
  tasksOnAllTabs: boolean;
}

const initialState: PersistedState = {
  tasks: {
    siteCheck: 'To do',
    wfdAssessment: 'Cannot start yet',
    marinePlanPolicies: 'Cannot start yet',
  },
  siteCheckForm: { coordinatesOk: '', withinMile: '', notes: '' },
  wfdForm: { review: '' },
  mppForm: {},
  saved: { siteCheck: false, wfdAssessment: false, marinePlanPolicies: false },
  transfers: {},
  // Default to the "tasks on all tabs" experience — the tested Iteration 1
  // behaviour (formerly the "Version 1" index link). The untested "Version 2"
  // variant that turned this off has been dropped.
  tasksOnAllTabs: true,
};

// Scope the persisted state to the build's base URL so a frozen iteration
// (served under /iteration-N/) keeps its own saved answers rather than sharing
// the live app's. At the domain root the base is '/', preserving the original key.
// Every app's key shares this prefix; "Clear saved data" removes them all (see
// resetAll) so one click wipes live and every frozen iteration on this origin.
const STORAGE_KEY_PREFIX = 'mas-review-assess-state';
const base = import.meta.env.BASE_URL;
const STORAGE_KEY =
  base === '/'
    ? STORAGE_KEY_PREFIX
    : `${STORAGE_KEY_PREFIX}:${base.replace(/\//g, '')}`;

// Lift a pre-`transfers` saved record (one `transfer` object holding its own
// caseId) into the keyed map. Anything without `requestedBy` predates the
// two-step split and is discarded.
function migrateSingleTransfer(old: unknown): TransfersState {
  const t = old as (TransferState & { caseId?: string }) | null | undefined;
  return t?.caseId && t.requestedBy ? { [t.caseId]: t } : {};
}

// Hydrate from localStorage so answers survive a full page refresh.
function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        tasks: { ...initialState.tasks, ...parsed.tasks },
        siteCheckForm: { ...initialState.siteCheckForm, ...parsed.siteCheckForm },
        wfdForm: { ...initialState.wfdForm, ...parsed.wfdForm },
        mppForm: { ...initialState.mppForm, ...parsed.mppForm },
        saved: { ...initialState.saved, ...parsed.saved },
        // State saved before transfers were keyed by case held a single `transfer`
        // object carrying its own caseId; lift it into the map. Anything older than
        // the two-step split has no `requestedBy` and would render an empty card,
        // so it is dropped rather than migrated.
        transfers: parsed.transfers ?? migrateSingleTransfer(parsed.transfer),
        tasksOnAllTabs: parsed.tasksOnAllTabs ?? initialState.tasksOnAllTabs,
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return initialState;
}

interface TaskContextValue {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  saved: SavedState;
  transfers: TransfersState;
  tasksOnAllTabs: boolean;
  requestTransferToMcms: (caseId: string, reasons: string, requestedBy: string) => void;
  completeTransferToMcms: (caseId: string, mcmsReference: string, completedBy: string) => void;
  setTasksOnAllTabs: (value: boolean) => void;
  setSiteCheckField: (field: keyof SiteCheckForm, value: string) => void;
  setWfdReview: (value: string) => void;
  setMppField: (code: string, field: keyof MppAnswer, value: string) => void;
  markUnsaved: (task: keyof SavedState) => void;
  completeSiteCheck: () => void;
  completeWfd: () => void;
  resetAll: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [state]);

  const setTasksOnAllTabs = (value: boolean) =>
    setState(prev => ({ ...prev, tasksOnAllTabs: value }));

  // Step 1 (Case Officer): request the transfer, recording the reasons. Other
  // cases' records are untouched.
  const requestTransferToMcms = (caseId: string, reasons: string, requestedBy: string) =>
    setState(prev => ({
      ...prev,
      transfers: {
        ...prev.transfers,
        [caseId]: { requestedBy, dateRequested: today(), reasons },
      },
    }));

  // Step 2 (Business Support Team): record the reference MCMS gave the case, which
  // completes the transfer. No-op unless this case has a pending request.
  const completeTransferToMcms = (caseId: string, mcmsReference: string, completedBy: string) =>
    setState(prev =>
      prev.transfers[caseId]
        ? {
            ...prev,
            transfers: {
              ...prev.transfers,
              [caseId]: {
                ...prev.transfers[caseId],
                completedBy,
                dateTransferred: today(),
                mcmsReference,
              },
            },
          }
        : prev,
    );

  const setSiteCheckField = (field: keyof SiteCheckForm, value: string) =>
    setState(prev => ({ ...prev, siteCheckForm: { ...prev.siteCheckForm, [field]: value } }));

  const setWfdReview = (value: string) =>
    setState(prev => ({ ...prev, wfdForm: { ...prev.wfdForm, review: value } }));

  // Writes one field of one policy's assessment (live, like setSiteCheckField). A
  // policy only counts as assessed once it has both an outcome and a reason — the
  // two business-required fields on its form. Once every policy is assessed the
  // whole MPP task rolls up to Done; otherwise it stays "To do" while it's being
  // worked through.
  const setMppField = (code: string, field: keyof MppAnswer, value: string) =>
    setState(prev => {
      const existing = prev.mppForm[code] ?? { outcome: '', reason: '' };
      const mppForm = {
        ...prev.mppForm,
        [code]: { ...existing, [field]: value },
      };
      const allAssessed =
        policyCount > 0 &&
        Object.values(mppForm).filter(a => a.outcome.trim() && a.reason.trim()).length ===
          policyCount;
      // Emptying a field on a policy that had been assessed takes the task back off
      // Done. Any other status ("To do", or "Cannot start yet" on a locked case) is
      // left alone — only the Done roll-up is derived from the answers.
      const current = prev.tasks.marinePlanPolicies;
      const marinePlanPolicies = allAssessed
        ? 'Done'
        : current === 'Done'
          ? 'To do'
          : current;
      return {
        ...prev,
        mppForm,
        tasks: { ...prev.tasks, marinePlanPolicies },
      };
    });

  // An edit marks the task as having unsaved changes (shown in the task header).
  const markUnsaved = (task: keyof SavedState) =>
    setState(prev => ({ ...prev, saved: { ...prev.saved, [task]: false } }));

  // Saving the Site check completes it, marks it saved, and unlocks downstream tasks.
  const completeSiteCheck = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        siteCheck: 'Done',
        wfdAssessment: 'To do',
        marinePlanPolicies: 'To do',
      },
      saved: { ...prev.saved, siteCheck: true },
    }));

  // Saving the WFD assessment completes it and marks it saved; nothing depends on it.
  const completeWfd = () =>
    setState(prev => ({
      ...prev,
      tasks: { ...prev.tasks, wfdAssessment: 'Done' },
      saved: { ...prev.saved, wfdAssessment: true },
    }));

  // Clears every prototype key on this origin (live + all frozen iterations),
  // not just this app's own key, so the index page's "Clear saved data" wipes
  // everything as it did before iterations got their own scoped keys. The
  // useEffect below then re-seeds only the current app's key with initialState.
  const resetAll = () => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) localStorage.removeItem(key);
      }
    } catch {
      /* ignore storage errors */
    }
    setState(initialState);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        siteCheckForm: state.siteCheckForm,
        wfdForm: state.wfdForm,
        mppForm: state.mppForm,
        saved: state.saved,
        transfers: state.transfers,
        tasksOnAllTabs: state.tasksOnAllTabs,
        requestTransferToMcms,
        completeTransferToMcms,
        setTasksOnAllTabs,
        setSiteCheckField,
        setWfdReview,
        setMppField,
        markUnsaved,
        completeSiteCheck,
        completeWfd,
        resetAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
