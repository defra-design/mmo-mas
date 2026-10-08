---
name: d365-oob-prototype
description: Use this skill for any design or build task in the MAS caseworker prototype — the TypeScript + Vite + React + Fluent UI v9 app that simulates the Dynamics 365 model-driven caseworker system. Trigger it whenever a task touches a screen, form, button, panel, list, dialog, notification, or any new UI in this prototype, even if the request doesn't mention "D365" or "out of the box" explicitly — e.g. "add a reject button," "build the wait-state screen for the MPP calculation," "add a summary panel to the case view," "how should this list of related applications look." The skill enforces that every component maps to something a developer could actually build with native D365 configuration — no bespoke UI that would secretly require a PCF control, canvas app, or custom page to ship for real.
---

# D365 OOB Prototype Constraints

## Why this exists

This prototype's entire value is that it's a truthful preview of what MMO caseworkers will get in real D365 — and what the dev team can actually build without custom code. A polished screen that quietly assumes a component D365 doesn't have OOB isn't a helpful prototype; it's a design that costs the dev team weeks of unplanned PCF work, or gets rejected at build time. Every UI decision here should survive the question: "could this be configured in a real D365 model-driven app with standard forms, views, business process flows, and the command bar — no custom code?"

Fluent UI v9 is simply the rendering layer used to *simulate* D365's real controls in this prototype. It is not a general-purpose component library to design freely with — it's a constrained palette standing in for D365's actual OOB toolkit.

## The two-layer check

Before adding or changing any UI element, check both layers:

1. **Fluent UI v9 layer** — build it with `@fluentui/react-components`. Don't hand-roll bespoke components that duplicate something Fluent already provides, and don't introduce Fluent UI v8/legacy components into this codebase.
2. **D365-native mapping layer** — the resulting pattern must correspond to a real, native D365 model-driven app construct (form, subgrid, business process flow, command bar action, timeline, alert, dialog, etc.). If there's no real D365 construct behind the Fluent component, don't build it — find the nearest OOB equivalent instead, or flag the gap (see "When you're unsure" below).

See `references/component-map.md` for the working map from Fluent UI v9 components to their real D365 equivalents — check it before introducing a component that isn't already used elsewhere in the prototype.

## Hard constraints

These come directly from how the real D365 build will work, so they're not stylistic preferences:

- **Command bar only for actions.** No custom buttons live in the form body. Resolve, reject, submit, save, and any other case-level action belongs on the command bar, matching how D365 actually exposes actions on a record.
- **OOB actions stay OOB.** Things like resolving or rejecting a case should route through the native D365 action they correspond to (e.g. OOB Resolve Case), not a custom "fake" version of that flow.
- **Read-only external data → iFrame, not a rebuilt form.** If a screen is just displaying data owned by another system (e.g. the applicant-facing GOV.UK submission), embed it read-only rather than reconstructing it as a native-looking D365 form.
- **Interactive/assessable data → native form, not an iFrame.** Anything a caseworker needs to act on (assessment tasks, decisions, notes) should be a real D365 form/control, because iFrames can't carry native D365 interactivity.
- **Wait/processing states use OOB affordances.** Model these with Fluent's Spinner/MessageBar in the space a real async D365 operation would occupy, not a custom loading page.
- **Notifications and alerts map to D365's own notification surface** (form-level and command-bar-level alerts), not an invented banner design.

## Task form conventions

Every task form follows these rules. They mirror how a real D365 form behaves, so apply them to new tasks without being asked.

- **Header save state.** The task header reads `Task name - Saved` by default, for every task, including a read-only one. It becomes `Unsaved` as soon as the caseworker changes any field, and returns to `Saved` when the task is saved. State lives in `saved` in `TaskContext` (initial values `true`; edits call `markUnsaved`).
- **Read-only tasks (not yet unlocked).** A task that cannot start yet still opens, because D365 cannot lock a caseworker out of a record. It shows:
  - a read-only form notification at the top, with a lock icon, explaining why;
  - a padlock (`FieldLock`, via `FieldDecorations`) on every field the caseworker would edit;
  - fields that are not editable but also not disabled-styled: no greyed-out look and no disabled cursor (D365 greys nothing out; only the text caret is dropped);
  - `Saved` in the header;
  - the **Save and close** command, which just returns to the Case summary without changing any status.
- **Live tasks.** The applicant's data carries a padlock (the same `FieldLock`) because the caseworker cannot edit it. Caseworker outcome fields have no padlock.
- **Text fields.** All single-line and multi-line text fields have the grey background (`colorNeutralBackground3`) and no border, including on focus, as in the existing tasks. Use `TaskTextarea` for multi-line text rather than a new Textarea.
- **Accordion help text.** Guidance under a field uses `TaskHint`. Open, it is an info icon with the guidance always visible. Pass `title` to collapse it behind a "Help with ..." accordion instead: link-coloured text, start-position chevron, no icon, and the open panel sits flush beneath it (the GOV.UK details pattern drawn in Fluent). Closed, it uses a small bottom gap; open, the full gap. In real D365 this is injected HTML in a web resource, not a native control.

## Grid and subgrid conventions

Every read-only grid (the case list and every subgrid) mirrors the OOB D365 grid. The full
list of behaviours is in CLAUDE.md under **Grid and subgrid (D365 grid) conventions**; apply
it to new grids without being asked. In short:

- **Hover and focus** come from the shared `useSubgridStyles`: light grey row, darker grey
  cell, blue tones when selected, a dark border on a clicked cell until focus moves, and a
  blue outline on a hovered column header.
- **Selecting:** `GridCheckbox` for the select column (grey square and preview tick on
  hover); clicking a row selects just that row; `Rows: N  Selected: N` in the footer.
- **Opening:** the primary link and a row double-click both open the row's record. A link to
  another table (e.g. Organisation on Consultees) opens that record instead, and the row
  then gets a last **Navigate** icon column for its own record.
- **Subgrid command bar:** create command with nothing selected; Edit and Remove with rows
  selected. Edit on several rows is the OOB "Edit multiple records" panel, not a custom
  form. Remove is the OOB Delete command relabelled in the command designer (no code).
- Related records are added and edited on their own full-page main form, opened from the
  subgrid, not inline in the grid.

## When you're unsure

If a design need doesn't have an obvious OOB match, say so out loud instead of quietly building a custom solution. Flag it plainly: "this would need a PCF control / canvas app / custom page in real D365" — so the cost is visible and it can be a deliberate decision, not a silent one baked into the prototype.

## Stack conventions

- TypeScript + Vite + React, `@fluentui/react-components` (Fluent UI v9) only.
- One component per file, kept under ~150 lines where practical.
- When proposing a new component, name the real D365 construct it's standing in for as part of the explanation — this keeps the mapping explicit rather than assumed.
