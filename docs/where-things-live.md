# Where things live

A map of the MAS caseworker prototype. It's organised
around what you actually **see on screen**: for each piece of the UI, where it's
**defined** and where its **data** comes from.

> This is a React + TypeScript prototype that mimics a Dynamics 365 model-driven app
> for MMO (Marine Management Organisation) caseworkers reviewing marine licence
> applications. There is no backend — all data is mock data, and any caseworker input
> is held in React state and mirrored to the browser's `localStorage`. See
> [`CLAUDE.md`](../CLAUDE.md) for the design-system rules and conventions.

## Running it

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # production build
npm run lint     # eslint
```

---

## Hosting & access (no password)

The deployed prototype is served by **`server.js`** (a small Express server, started via the
`Procfile`). It serves the built `dist/` folder with an SPA fallback so client-side routes work.

- **There is no authentication.** Anyone with the URL can open the prototype — this is
  deliberate so usability-test participants aren't blocked.
- **History:** the server used to sit behind **HTTP Basic Auth**, with the password read from
  a `PASSWORD` env/config var. That gate was removed because the password prompt
  ("Authentication required") was stopping test participants from getting in. The
  password-checking code is gone from `server.js`; the `PASSWORD` env var is now ignored.
- If you ever need to lock it down again (e.g. before it holds anything sensitive), restore a
  Basic Auth middleware in `server.js` — but remember to share the credentials with testers.

---

## The two journeys

The app contains two separate journeys, reached from the landing page:

| Journey | What it is | Status |
|---------|-----------|--------|
| **Review and assess** | The real work — marine licence case list, case summary, CDP data tabs, caseworker tasks. | Active / current focus |
| ↳ **Version 1** | Review and assess with the **persistent task list** — the Tasks panel stays pinned beside every case tab. | The chosen direction |
| ↳ **Version 2** | Review and assess with the task list shown on the **Case summary tab only**. | Alternative, kept for comparison |
| **Proof of concept** | An earlier exploration ("Active cases" list + case view). | Legacy — kept for reference |

The current design work happens almost entirely in **Review and assess**.

---

## Big picture: the app shell

Every page (except the landing page) is wrapped in the **Shell**, which provides the
three D365 regions:

```
┌─────────────────────────────────────────────────────────┐
│  TopBar (navy header)                                    │  ← TopBar.tsx
├──────────┬──────────────────────────────────────┬───────┤
│          │                                       │       │
│  Left    │          Main content area            │ right │  ← page content
│  Nav     │          (the routed page)            │ rail  │
│  rail    │                                       │       │
│          │                                       │       │
└──────────┴──────────────────────────────────────┴───────┘
   Nav.tsx                                          (Shell.tsx)
```

| Region | Defined in | Notes |
|--------|-----------|-------|
| Shell (the 3-column frame) | `src/components/Shell.tsx` | Also holds the nav-group definitions and which nav keys map to real routes. |
| Top navy header bar | `src/components/TopBar.tsx` | Waffle icon (→ landing page), "Dynamics 365 \| Marine Applications System" title, placeholder action icons, user persona. Uses Fluent **v8**. |
| Left navigation rail | `src/components/Nav.tsx` + `src/components/Nav.css` | Custom-built to match D365 (expandable sections, chevrons, selected state). The **menu items themselves** are the `navGroups` / `reviewAssessNavGroups` arrays in `Shell.tsx`. Most links are dead (`url: '#'`); only `Home`, `Cases` and `Marine licence cases` route anywhere (see `navRoutes` in `Shell.tsx`). |
| Thin right rail | `src/components/Shell.tsx` (inline) | Empty placeholder, matches D365. |

> **Worked example — "the header, where is it defined and where is the data saved?"**
> The navy bar across the top is `src/components/TopBar.tsx`. Its contents (title text,
> icons) are hard-coded in that file — there's no data source, it's chrome. The per-case
> blue header inside the Case summary is different — see [Case summary](#case-summary) below.

---

## Routes

All routes are declared in `src/App.tsx`. The `:caseId` is a case reference like `MLA/2026/1002`.

| URL | Page component | Journey |
|-----|---------------|---------|
| `/` | `IndexPage.tsx` | Landing page (no Shell) |
| `/iteration1` | `ListView.tsx` ("Active cases") | Proof of concept |
| `/cases/:caseId` | `CaseView.tsx` | Proof of concept |
| `/review-assess` | `MarineLicenceListView.tsx` ("Marine licence cases") | Review and assess |
| `/review-assess/cases/:caseId` | `MarineCaseSummary.tsx` | Review and assess |
| `/review-assess/cases/:caseId/tasks/site-check` | `tasks/SiteCheckTask.tsx` | Review and assess |
| `/review-assess/cases/:caseId/tasks/wfd` | `tasks/WfdTask.tsx` | Review and assess |

---

## Section by section (Review and assess)

### Landing page

- **What you see:** MMO logo, "Marine Applications System prototype", Version 1 / Version 2
  links into Review and assess, a "Clear saved data" button, and a "Proof of concept" link.
- **Defined in:** `src/components/IndexPage.tsx`
- **Data:** none. The Version 1 / Version 2 links set the `tasksOnAllTabs` flag (see
  [Tasks](#tasks-panel--task-forms)). "Clear saved data" calls `resetAll()` to wipe runtime state.

### Marine licence cases list (the grid)

- **What you see:** the D365-style read-only table of cases at `/review-assess`, with
  sortable/filterable column headers, status badges, a case-officer avatar column.
- **Defined in:** `src/components/MarineLicenceListView.tsx`
- **Column definitions** (which columns, labels, widths): `src/config/entities/marine-licence-case.json`
- **Row data:** `src/mock-data/marine-licence-cases.json`
- **Sort + filter state:** local React state inside the component. The last-used **sort** is
  remembered per list view in `localStorage` (`mas-list-sort:<title>`). **Filters** live in
  component state only (not persisted). The Status column uses an "Equals" checkbox filter;
  every other column uses a "Contains" text filter.
- **Which rows are clickable:** only references present in `src/mock-data/marine-case-details.json`
  navigate to a Case summary; the rest are display-only.

### Case summary

- **What you see:** at `/review-assess/cases/:caseId` — a command bar, a blue **case header**
  (avatar, project title, and a meta strip: Reference / Status / Case age / Assigned to),
  then a row of **tabs**, then the selected tab's content.
- **Defined in:** `src/components/MarineCaseSummary.tsx`
- **Command bar** (Back / Open / Reject application): `src/components/FormCommandBar.tsx`
- **Case header + meta strip data:** assembled in `MarineCaseSummary.tsx` from
  `src/mock-data/marine-case-details.json` (full detail for built-out cases) with a fallback to
  the matching row in `src/mock-data/marine-licence-cases.json`. Only `MLA/2026/1002`
  (Teignmouth) is fully built out; other cases fall back to their list-row values.
- **The "Case summary" tab** (Reference / Application type / Submitted / Fee band / Applicant /
  Organisation field boxes): rendered by `MarineCaseSummary.tsx` itself, same data source.

### CDP application-data tabs (iframes)

The tabs **Project details, Site and activity, Marine plan policies, Water Framework
Directive, Other permissions, Public register** show the **applicant's** submitted data. To
mirror the real system, these are **static HTML pages embedded in an `<iframe>`** — not React.

- **What you see:** applicant data laid out label-beside-value, matching the D365 look.
- **Rendered by:** `src/components/CdpFrame.tsx` (just an `<iframe>`), wired up via the
  `cdpPages` lookup in `MarineCaseSummary.tsx` (maps a tab → an HTML file).
- **Page source:** `public/cdp/<section>.html`, served as static files at `/cdp/<section>.html`.
- **Shared styling:** `public/cdp/cdp.css`.
- **Data:** baked straight into the HTML for simple sections. List/detail sections
  (`marine-plan-policies`, `other-permissions`) load a sibling `<section>.json` via a sibling
  `<section>.js`. These are plain HTML/CSS/vanilla-JS — they do **not** use React or the build pipeline.

### Tasks panel & task forms

- **What you see:** a "Tasks" panel listing caseworker tasks (Site check, Water Framework
  Directive, Marine plan policies) each with a status. Clicking a startable task opens its form.
- **Task list panel:** `src/components/TaskList.tsx`. In **Version 2** it sits inline on the
  Case summary tab; in **Version 1** (`tasksOnAllTabs = true`) it persists in a rail on every
  tab. The version is chosen by the Version 1 / 2 links on the landing page.
- **Task forms:**
  - `src/components/tasks/SiteCheckTask.tsx`
  - `src/components/tasks/WfdTask.tsx`
  - `src/components/tasks/OutcomeDropdown.tsx` — the shared grey "outcome" select used by both.
- **Task data & status:** **not** in any JSON file. Task statuses and the caseworker's saved
  answers live in runtime state — see below. The applicant answers shown read-only inside a
  task form are currently hard-coded in the form component.

---

## Where data lives (the four sources)

| Kind of data | Where | Notes |
|--------------|-------|-------|
| **Seed row data** for list views | `src/mock-data/*.json` | Initial/static. `marine-licence-cases.json` (list rows), `marine-case-details.json` (full case detail), plus the legacy `cases.json` / `case-details.json`. |
| **Column & form layout config** | `src/config/entities/*.json` | Describes which columns a list view shows, their labels and widths. |
| **Applicant (CDP) data** | `public/cdp/*.html` and `public/cdp/*.json` | Baked into the iframe HTML, or in a sibling JSON for list/detail sections. |
| **Caseworker input & task status (runtime)** | `src/context/TaskContext.tsx` → `localStorage` | The mutable prototype state. See below. |

### Runtime state — `TaskContext.tsx`

This is the one place caseworker input and task progress are stored. There is **no** backend
and these are **not** written back to the JSON files.

- A single `TaskProvider` (wrapped around the app in `App.tsx`) holds: each task's **status**,
  each task's saved **form answers**, dirty/"Unsaved" flags, and the `tasksOnAllTabs` UI flag.
- Components read and write it only through the **`useTasks()`** hook — never touch
  `localStorage` directly from a component.
- The whole state object is mirrored to `localStorage` under the key
  **`mas-review-assess-state`** on every change, and re-hydrated on load — so a caseworker can
  refresh or leave and come back and still see their work.
- **Saving a task** (e.g. `completeSiteCheck()`) sets that task's status to `Done` and unlocks
  downstream tasks (Site check unlocks WFD and Marine plan policies).
- **Reset:** "Clear saved data" on the landing page calls `resetAll()`, which restores
  `initialState` and clears the persisted copy.

> Separately, the list view persists only its **last-used sort** under `localStorage` keys
> like `mas-list-sort:Marine licence cases` (in `MarineLicenceListView.tsx`).

### Static assets

- `public/images/` — the MMO logo.
- `public/documents/` — downloadable docs linked from task forms (e.g. the WFD `.docx`).
- `public/favicon.ico`.

---

## "I want to change X — where do I look?"

| I want to… | Look in |
|------------|---------|
| Change the navy top bar / its title | `src/components/TopBar.tsx` |
| Add or rename a left-nav menu item | the `navGroups` / `reviewAssessNavGroups` arrays in `src/components/Shell.tsx` |
| Make a nav item actually navigate | `navRoutes` in `src/components/Shell.tsx` + a route in `src/App.tsx` |
| Add/edit a column in the case grid | `src/config/entities/marine-licence-case.json` |
| Change which cases appear in the grid | `src/mock-data/marine-licence-cases.json` |
| Change how the grid renders / its filtering | `src/components/MarineLicenceListView.tsx` |
| Edit the blue case header / Case summary fields | `src/components/MarineCaseSummary.tsx` (+ `marine-case-details.json` for the values) |
| Edit an applicant-data tab (Project details, WFD, etc.) | `public/cdp/<section>.html` (+ `.json` for list/detail sections) |
| Add a new applicant-data tab | follow the checklist in [`CLAUDE.md`](../CLAUDE.md) ("New CDP application-data section checklist") |
| Add or edit a caseworker task form | `src/components/tasks/` + extend `src/context/TaskContext.tsx` |
| Change task status logic / unlocking | `src/context/TaskContext.tsx` |
| Add a brand-new list view / entity | follow the "New entity scaffold checklist" in [`CLAUDE.md`](../CLAUDE.md) |

---

## File tree (quick reference)

```
src/
  App.tsx                       ← router: all routes live here
  main.tsx                      ← entry point; initializeIcons()
  components/
    Shell.tsx                   ← 3-column frame + nav-group data + nav→route map
    TopBar.tsx                  ← navy top header bar
    Nav.tsx / Nav.css           ← custom left navigation rail
    IndexPage.tsx               ← landing page (Version 1/2 links, reset)
    MarineLicenceListView.tsx   ← Marine licence cases grid (Review & assess)
    MarineCaseSummary.tsx       ← case header + tabs; wires CDP iframe tabs
    CdpFrame.tsx                ← the <iframe> wrapper for CDP pages
    FormCommandBar.tsx          ← Back / Open / Save / Reject command bar
    TaskList.tsx                ← the Tasks panel
    tasks/
      SiteCheckTask.tsx         ← Site check task form
      WfdTask.tsx               ← Water Framework Directive task form
      OutcomeDropdown.tsx       ← shared outcome <Dropdown>
    ListView.tsx / CaseView.tsx ← legacy Proof-of-concept pages
    CommandBar.tsx / HeaderRow.tsx / FilterControls.tsx ← legacy helpers
  config/entities/              ← list column + form layout JSON
  mock-data/                    ← seed row/detail JSON
  context/TaskContext.tsx       ← runtime state + localStorage persistence
  utils/avatarColors.ts         ← assignee avatar colour helper
public/
  cdp/                          ← static CDP application-data pages (HTML/CSS/JS/JSON)
  images/ documents/            ← logo + downloadable docs
```
