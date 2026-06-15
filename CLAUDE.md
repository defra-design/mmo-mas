# MAS Caseworker Prototype — Claude Code Rules

## Project overview

React + TypeScript prototype that mimics a Dynamics 365 model-driven app for internal
Marine Management Organisation (MMO) caseworker staff. The prototype is used to explore
and test UX patterns for the Marine Applications System (MAS) caseworker system before
decisions are locked in D365 build.

The visual target is the real D365 instance — navy top bar, white left nav rail, Fluent UI
typography and spacing throughout. Screenshots of the real instance are in `/docs/reference/`
if they exist; otherwise treat Image 1 (case list) and Image 2 (case summary) as the reference.

---

## Design system

- **Fluent UI v9** (`@fluentui/react-components`) is the primary component library for all
  new work. Use v8 (`@fluentui/react`) only where an existing component has not yet been
  migrated — do not introduce new v8 components.
- ListView.tsx uses the Fluent UI v9 Table.
- Use Fluent UI v9 `Popover`/`Menu` for header and cell hover menus.
- Do not install or use any component library other than `@fluentui/*`.
- Do not create custom components that replicate existing Fluent UI v9 components.

---

## Layout and navigation

- Shell: TopBar (navy `#243a5e` header) → custom Left Nav rail → Main content area.
- Nav is custom `Nav.tsx` + `Nav.css` — do not replace with the Fluent UI Nav component.
  The custom Nav matches D365 precisely: expandable sections, chevrons, hover states.
- Chevrons: down (∨) when collapsed, up (∧) when expanded.
- Selected nav item: white background + 3px left border `#0078d4`.
- Nav rail background: `#f3f2f1`.

---

## Colour tokens

| Token | Value | Usage |
|-------|-------|-------|
| Active / brand | `#0078d4` | Links, selected states, primary buttons |
| Nav rail bg | `#f3f2f1` | Left nav background |
| Hover | `#edebe9` | Row and nav item hover |
| Top bar | `#243a5e` | Navy header bar |
| Text primary | `#323130` | Body text |
| Text secondary | `#605e5c` | Labels, metadata |

---

## Styling rules

- Per-component CSS files (e.g. `Nav.css`, `CaseList.css`) or Fluent v9
  `makeStyles`/`mergeClasses` — use whichever pattern the existing file already uses.
- No external CSS frameworks (no Tailwind, Bootstrap, etc.).
- No CSS-in-JS libraries other than Fluent v9 utilities.
- Tables: set fixed/min/max widths on key columns to match D365 column proportions.
- Header menus: ~180–220px wide popover, chevron immediately after label, no left
  padding on menu items, bold label, opens on click.

---

## Task workflow pattern

Tasks are accessed from the task list on the Case summary. The pattern for all task views is:

1. User clicks a task in the task list → navigates to the task form view.
2. Task form shows: applicant's answers (read-only display), then caseworker outcome fields
   (Dropdowns / ComboBoxes for selects and multi-selects).
3. Saving the task → returns user to Case summary with that task's status updated to
   **Completed** and any downstream task dependencies updated (e.g. WFD unlocked after
   Site check).
4. Tasks that cannot start yet show status **Cannot start yet** and are not clickable.

Use Fluent UI v9 `Dropdown` or `Combobox` for single selects. Use `TagPicker` or a
`Combobox` with `multiselect` for multi-selects. Use `Textarea` for free-text fields.
Wrap fields in Fluent v9 `Field` for consistent label + validation layout.

---

## Coding conventions

- Functional components and hooks only — no class components.
- TypeScript throughout. Define prop types inline or with a local `type Props = { … }`.
- Import types: `import type { … } from '@fluentui/react-components'`.
- Assume `initializeIcons()` runs in `src/main.tsx` — do not call it elsewhere.
- Keep components small and focused. A task form should not exceed ~150 lines.
- Use relative imports — no path aliases (the project does not have them configured).

---

## Data and config

- Mock data lives in `src/mock-data/<entityPlural>.json`.
- Entity configs (columns, form layout) live in `src/config/entities/<entity>.json`.
- Mock data JSON holds the *initial* seed data. Caseworker input and task-status changes
  are not written back to JSON — they live in runtime state (see **State persistence and
  reset** below). No real API calls.
- Use `uuid` for any new ID generation. Use `faker` sparingly for supplementary mock data.

---

## State persistence and reset

Caseworker answers and task statuses persist across page refreshes so a user can leave and
return to a case and still see their work. This is handled in a single React context, not in
the mock-data JSON.

- **Store:** `src/context/TaskContext.tsx` — a `TaskProvider` holds all mutable prototype
  state (task statuses + each task's saved form answers) and exposes it via the `useTasks()`
  hook. Components read and mutate state only through `useTasks()`; never write to
  `localStorage` directly from a component.
- **Persistence:** the whole state object is mirrored to `localStorage` under the key
  `mas-review-assess-state` on every change, and re-hydrated on load (`loadState`). Hydration
  merges over `initialState`, so adding a new field is backwards-compatible with older saved
  state. Corrupt/unavailable storage falls back to `initialState` silently.
- **Saving a task** calls its context action (e.g. `completeSiteCheck`), which sets that
  task's status to `Done` and unlocks downstream tasks (e.g. sets `wfdAssessment` and
  `marinePlanPolicies` from `Cannot start yet` to `To do`). Saved field values are written
  via per-field setters (e.g. `setSiteCheckField`) so the task form re-populates on revisit.
- **Reset:** the **Reset prototype data** link on the index page (`src/components/IndexPage.tsx`)
  calls `resetAll()`, which sets state back to `initialState` (the `useEffect` then clears the
  persisted copy). This is the supported way for a user to start the prototype afresh.

> Note: `TaskState` / `SiteCheckForm` in `TaskContext.tsx` are currently hand-written per
> task. When adding a task, extend these types and the `initialState` rather than introducing
> a second persistence mechanism.

---

## New task scaffold checklist

When adding a new task type, complete these steps in order:

1. Add/update task entry in the relevant case's mock data (`src/mock-data/cases.json` or
   equivalent) with status `to-do`, `completed`, or `cannot-start-yet`.
2. Extend `TaskContext.tsx`: add the task's status to `TaskState`, add a form-answers
   interface + field to `PersistedState`, seed both in `initialState`, and add the
   save/setter actions (mirrors `completeSiteCheck` / `setSiteCheckField`). This is what
   makes the answers persist and survive refresh; do not store task state anywhere else.
3. Create `src/components/tasks/<TaskName>Task.tsx` — the task form component. Read and
   write its state only through `useTasks()`.
4. Add a route in `App.tsx`: `/cases/:caseId/tasks/<task-slug>`.
5. Wire the task list item in `CaseSummary.tsx` to navigate to the route on click
   (only when status is not `cannot-start-yet`).
6. On save, call the task's context action to set status `Done`, unlock any downstream
   tasks, and navigate back to `/cases/:caseId`.

---

## New entity scaffold checklist

When adding a new list view / entity (not a task):

1. Add mock rows → `src/mock-data/<entityPlural>.json`
2. Describe columns + form layout → `src/config/entities/<entity>.json`
3. Create `src/components/<Entity>ListView.tsx` (Fluent v9 Table)
4. Register a left-nav link in the relevant `Shell.tsx` group
5. Add a route + page stub in `App.tsx`

---

## File and folder structure

```
src/
  components/
    tasks/          ← one file per task type, e.g. SiteCheckTask.tsx
    CaseSummary.tsx
    CaseList.tsx (or ListView.tsx)
    Nav.tsx / Nav.css
    TopBar.tsx
  config/
    entities/       ← JSON configs per entity
  mock-data/        ← JSON mock data per entity
  utils/            ← non-React helpers
  main.tsx          ← entry point, initializeIcons() here
  App.tsx           ← router
```

PascalCase for component filenames. camelCase for utils and helpers.

---

## Allowed libraries

| Allowed | Purpose |
|---------|---------|
| `@fluentui/react-components` | UI components (v9) — primary |
| `@fluentui/react` | Legacy v8 — existing components only, no new additions |
| `@fluentui/react-icons` | Icons |
| `date-fns` | Date formatting |
| `uuid` | ID generation |
| `faker` | Supplementary mock data only |

Do not add: `moment`, `lodash`, any CSS-in-JS library, any other component library.

---

## Commit style (Conventional Commits)

- `feat:` — new screens, components, or task types
- `fix:` — bug fixes
- `chore:` — tooling, lint, dependency updates

Keep commits focused. Aim for under ~300 lines changed per commit.
