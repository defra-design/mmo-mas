# Fluent UI v9 → D365 OOB construct map

Check this before introducing a component that isn't already used elsewhere in the prototype. If what you need isn't listed, work out the real D365 construct first, then find (or ask for) the closest Fluent UI v9 equivalent — don't reach for a Fluent component just because it looks right.

| Need | Real D365 construct | Fluent UI v9 building block |
|---|---|---|
| Case-level actions (resolve, reject, submit, save, escalate) | Command bar | Toolbar-style action bar pinned above the form, never buttons in the body |
| Main record editing | Main form | Field/Label components in D365's standard 2–3 column layout |
| Compact context view without leaving the page | Quick View form | Card + Field components, read-only styling |
| Related record lists (linked applications, related cases) | Subgrid | DataGrid / Table |
| Multi-stage case progression (e.g. LCML journey stages) | Business Process Flow | Horizontal stepper-style component pinned at the top of the form |
| Activity/notes feed | Timeline | List or Card feed, reverse-chronological |
| Form-level or command-bar-level notifications, warnings, wait states | Form notification / alert | MessageBar |
| Confirm/cancel prompts (e.g. "Resolve this case?") | Native D365 confirmation dialog | Dialog |
| Async processing (e.g. an MPP calculation running) | D365's native async/processing indicator | Spinner + MessageBar, occupying the space the real operation would use |
| Read-only display of data owned by another system (e.g. applicant-facing GOV.UK submission) | Embedded external content | iFrame — do not rebuild as a native-looking form |
| Anything a caseworker needs to act on (assessment tasks, decisions) | Native form/control | Real Fluent form components — never an iFrame |
| Tabbed navigation within a record | Form tabs | Fluent TabList |
| Filtering/searching a list view | View + column filters | Fluent SearchBox + DataGrid column filtering |

## Things that don't have an OOB equivalent — treat with caution

If a request pushes toward one of these, flag it as a custom-dev cost rather than building it quietly:

- Bespoke multi-panel layouts that don't match a standard form/subgrid arrangement
- Drag-and-drop interactions
- Inline rich visualisations beyond what a subgrid/chart component can do natively
- Anything that would only be possible with a PCF control or a canvas app embedded in the model-driven app

## Updating this file

When a new pattern gets settled (the way the command bar, iFrame split, or MoJ-style alert pattern did), add it here so future prototype work doesn't have to re-derive it.
