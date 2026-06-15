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

interface PersistedState {
  tasks: TaskState;
  siteCheckForm: SiteCheckForm;
  wfdForm: WfdForm;
}

const initialState: PersistedState = {
  tasks: {
    siteCheck: 'To do',
    wfdAssessment: 'Cannot start yet',
    marinePlanPolicies: 'Cannot start yet',
  },
  siteCheckForm: { coordinatesOk: '', withinMile: '', notes: '' },
  wfdForm: { review: '' },
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
  setSiteCheckField: (field: keyof SiteCheckForm, value: string) => void;
  setWfdReview: (value: string) => void;
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

  const setSiteCheckField = (field: keyof SiteCheckForm, value: string) =>
    setState(prev => ({ ...prev, siteCheckForm: { ...prev.siteCheckForm, [field]: value } }));

  const setWfdReview = (value: string) =>
    setState(prev => ({ ...prev, wfdForm: { ...prev.wfdForm, review: value } }));

  // Saving the Site check completes it and unlocks the downstream tasks.
  const completeSiteCheck = () =>
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        siteCheck: 'Done',
        wfdAssessment: 'To do',
        marinePlanPolicies: 'To do',
      },
    }));

  // Saving the WFD assessment completes it; no further tasks depend on it.
  const completeWfd = () =>
    setState(prev => ({
      ...prev,
      tasks: { ...prev.tasks, wfdAssessment: 'Done' },
    }));

  const resetAll = () => setState(initialState);

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        siteCheckForm: state.siteCheckForm,
        wfdForm: state.wfdForm,
        setSiteCheckField,
        setWfdReview,
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
