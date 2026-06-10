// src/context/TaskContext.tsx
import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';

export type TaskStatus = 'Done' | 'To do' | 'Cannot start yet';

export interface TaskState {
  reviewApplication: TaskStatus;
  siteCheck: TaskStatus;
  wfdAssessment: TaskStatus;
  marinePlanPolicies: TaskStatus;
}

// Review application is treated as already done (built another day).
const initialState: TaskState = {
  reviewApplication: 'Done',
  siteCheck: 'To do',
  wfdAssessment: 'Cannot start yet',
  marinePlanPolicies: 'Cannot start yet',
};

interface TaskContextValue {
  tasks: TaskState;
  completeSiteCheck: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<TaskState>(initialState);

  // Saving the Site check completes it and unlocks the downstream tasks.
  const completeSiteCheck = () =>
    setTasks(prev => ({
      ...prev,
      siteCheck: 'Done',
      wfdAssessment: 'To do',
      marinePlanPolicies: 'To do',
    }));

  return (
    <TaskContext.Provider value={{ tasks, completeSiteCheck }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a TaskProvider');
  return ctx;
}
