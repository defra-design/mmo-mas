// src/context/TaskContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

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

// Tracks whether each task's form has unsaved edits. False = "Unsaved" until the
// task is saved; an edit flips it back to false (matches D365 dirty-tracking).
export interface SavedState {
  siteCheck: boolean;
  wfdAssessment: boolean;
}

interface PersistedState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
  saved: SavedState;
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
  saved: { siteCheck: false, wfdAssessment: false },
  tasksOnAllTabs: false,
};

const STORAGE_KEY = 'mas-review-assess-state';

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
        saved: { ...initialState.saved, ...parsed.saved },
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
  saved: SavedState;
  tasksOnAllTabs: boolean;
  setTasksOnAllTabs: (value: boolean) => void;
  setSiteCheckField: (field: keyof SiteCheckForm, value: string) => void;
  setWfdReview: (value: string) => void;
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

  const setSiteCheckField = (field: keyof SiteCheckForm, value: string) =>
    setState(prev => ({ ...prev, siteCheckForm: { ...prev.siteCheckForm, [field]: value } }));

  const setWfdReview = (value: string) =>
    setState(prev => ({ ...prev, wfdForm: { ...prev.wfdForm, review: value } }));

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

  const resetAll = () => setState(initialState);

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        siteCheckForm: state.siteCheckForm,
        wfdForm: state.wfdForm,
        saved: state.saved,
        tasksOnAllTabs: state.tasksOnAllTabs,
        setTasksOnAllTabs,
        setSiteCheckField,
        setWfdReview,
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
