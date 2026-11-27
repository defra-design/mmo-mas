// src/utils/teignmouthCaseAnswers.ts
// The caseworker's answers on MLA/2026/10015 (Installation of floating pontoon,
// Teignmouth Harbour). Only the Site check has been done, so every other task
// is ready to start. They seed the case's saved answers (see context/caseSeeds.ts).
import type { SiteCheckForm } from '../context/TaskContext';

export const TEIGNMOUTH_SITE_CHECK: SiteCheckForm = {
  coordinatesOk: 'Yes',
  withinMile: 'Yes',
  notes: 'The pontoon site is in the outer harbour at Teignmouth, against the existing harbour wall, and matches the uploaded site coordinates and drawings. The works are in the Teign transitional water body, so a WFD assessment is needed. The nearest protected sites are Dawlish Warren SAC and the Exe Estuary SPA, about 4 kilometres to the north.',
};
