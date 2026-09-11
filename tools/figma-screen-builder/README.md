# MAS D365 Screen Builder

A local Figma development plugin that builds the MAS reference screens and
representative conditional states as editable Figma layers. It does not publish,
authenticate, call an API, or use the network.

## Build

From this folder:

```sh
npm run build
npm run check
```

The build combines `src/screen-descriptions.json` with the renderer in
`src/code.template.js` and writes `code.js`, which is loaded by `manifest.json`.
Edit the descriptions for routine copy/data changes; edit the renderer only when
adding a new D365 pattern.

The editable vector icons in `src/fluent-icons.json` are extracted from the
prototype's installed `@fluentui/react-icons` package. Run `npm run refresh-icons`
only when that package is upgraded or the plugin needs another Fluent icon.

## Import and run in Figma desktop

1. Open a normal Figma Design file in the required corporate workspace.
2. Right-click the canvas and choose **Select plugins → Development → Import
   plugin from manifest…**.
3. Select this folder's `manifest.json`.
4. Open **Actions**, search for **MAS D365 Screen Builder**, and choose
   **Choose screens and states…**.
5. Select individual screens or use the **Case list**, **Public register**,
   **Assessment journey** or **Notice evidence** preset, then choose
   **Generate selected**.

The picker lists the exact frames that will be added. The Assessment journey
preset selects five frames in sequence: Case summary with gated tasks, Site check
initial, Site check validation errors, Site check completed, and Case summary
with the downstream tasks unlocked. Use **Generate all MAS D365 screens** from
the Actions menu when you want every available screen without opening the picker.

The Notice evidence preset generates the `MLA/2026/10014` Review public notice
evidence task in two states: its default empty state, and its saved mixed-decision
state with Location 1 rejected and Locations 2 and 3 accepted.

The plugin uses two stable pages:

- `00 · D365 components` — reusable local components and component masters.
- `01 - MAS D365 Screens` — all editable application screens.

Each run appends a labelled `Run 01`, `Run 02`, and so on to the right of the
existing material on these pages. Generation is additive: the plugin does not
remove or reposition earlier layers, so duplicated screens, pasted references,
annotations and previous generated runs are left unchanged. Arrange the screens
into journeys directly on `01 - MAS D365 Screens` as needed. The first run after
this naming change automatically renames an existing `01 · Screens` page and
retains everything on it.

It also creates text and colour styles under the matching `D365 / Run …` group,
so a later run cannot change styles used by an earlier one. The application
frames exclude browser chrome. Segoe UI is used when it is installed and
available to Figma desktop; otherwise the plugin uses Inter.

## Editing content

Content layers use names such as `Page heading`, `Section heading`, `Question`,
`Help text`, `Field value`, `Validation message`, and `Primary action`. Edit the
text override in the screen instance; auto layout on form rows and cards allows
questions, help text, validation messages and multiline answers to increase in
height. Long single-select values remain one line and truncate before the dropdown
chevron, matching the D365 control. Re-run the plugin to regenerate from the JSON
descriptions.

For an approved copy change, update `src/screen-descriptions.json` and the matching
React source in the same change. The generated text overrides are practical for
this proof, while the JSON file gives Codex a predictable interchange format.

### Content resilience check

After adding a new screen pattern, run the plugin and test one generated screen:

1. Lengthen a `Question` until it wraps onto at least three lines.
2. Replace a `Help text` value with a two-line sentence.
3. Add several lines to a multiline `Field value`.
4. Enter an unusually long single-select `Field value`.

The question, help link and multiline field should grow vertically and move the
following rows down. The single-select value should stay on one line, truncate
before its chevron and leave the following rows unchanged. The generated screen
is a fixed viewport, so unusually large additions may require increasing the
outer screen frame height after editing.

## Corporate plugin restrictions

If **Import plugin from manifest** is absent or Figma reports that development
plugins are restricted, capture the exact message and ask the Figma organization
or workspace administrator to approve the plugin. The longer-term sharing route
is a private internal organization plugin, not a Community publication. Keep the
manifest's network access set to `none`; adding domains later may trigger a new
security review.

No reference bitmap is embedded. This keeps generated screens fully editable and
the first version self-contained. The supplied screenshots remain the comparison
source during visual review.
