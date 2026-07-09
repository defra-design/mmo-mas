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

// Records a "Transfer to MCMS" action against one case: who did it, the date it
// was done, and the caseworker's free-text reason. null = not transferred.
export interface TransferState {
  caseId: string;
  transferredBy: string;
  date: string;
  details: string;
}

interface PersistedState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  mppForm: MppForm;
  saved: SavedState;
  // The case's Transfer to MCMS record, or null until it is transferred.
  transfer: TransferState | null;
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
  transfer: null,
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
        transfer: parsed.transfer ?? initialState.transfer,
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
  transfer: TransferState | null;
  tasksOnAllTabs: boolean;
  transferToMcms: (caseId: string, details: string, transferredBy: string) => void;
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

  // Records the Transfer to MCMS against a case. The date is always "today" (the
  // day the transfer is done), stamped in the OOB D365 format (DD/MM/YYYY).
  const transferToMcms = (caseId: string, details: string, transferredBy: string) =>
    setState(prev => {
      const d = new Date();
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return {
        ...prev,
        transfer: { caseId, transferredBy, date: `${dd}/${mm}/${d.getFullYear()}`, details },
      };
    });

  const setSiteCheckField = (field: keyof SiteCheckForm, value: string) =>
    setState(prev => ({ ...prev, siteCheckForm: { ...prev.siteCheckForm, [field]: value } }));

  const setWfdReview = (value: string) =>
    setState(prev => ({ ...prev, wfdForm: { ...prev.wfdForm, review: value } }));

  // Writes one field of one policy's assessment (live, like setSiteCheckField). Once
  // every policy has an outcome the whole MPP task rolls up to Done; otherwise it
  // stays "To do" while it's being worked through.
  const setMppField = (code: string, field: keyof MppAnswer, value: string) =>
    setState(prev => {
      const existing = prev.mppForm[code] ?? { outcome: '', reason: '' };
      const mppForm = {
        ...prev.mppForm,
        [code]: { ...existing, [field]: value },
      };
      const allAssessed =
        policyCount > 0 &&
        Object.values(mppForm).filter(a => a.outcome).length === policyCount;
      return {
        ...prev,
        mppForm,
        tasks: {
          ...prev.tasks,
          marinePlanPolicies: allAssessed ? 'Done' : prev.tasks.marinePlanPolicies,
        },
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
        transfer: state.transfer,
        tasksOnAllTabs: state.tasksOnAllTabs,
        transferToMcms,
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
