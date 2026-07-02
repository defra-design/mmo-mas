# Iteration snapshots — freeze runbook

How to preserve a completed iteration of the prototype as a permanent, self-contained
snapshot, and how the mechanism works. Audience: whoever runs the freeze (developer or AI
agent). For the plain-English overview see the
[Design and development guide](./design-and-development-guide.md#iterations--versioning).

> **The mechanism is built and in use.** Iteration 1 is already frozen at
> `snapshots/iteration-1/`. This doc is the runbook for freezing the *next* iteration and the
> reference for how it all fits together.

---

## To freeze an iteration (the whole procedure)

Run this when an iteration has finished usability testing, **before** you start changing the
app for the next one:

```bash
# 1. Record the exact tested commit as the source of record.
git tag iteration-2
git push origin iteration-2

# 2. Build a self-contained snapshot into snapshots/iteration-2/.
npm run freeze -- iteration-2

# 3. Add a landing-page link to it (see "Landing page link" below).

# 4. Commit the snapshot + the link.
git add snapshots/iteration-2 src/components/IndexPage.tsx
git commit -m "Freeze Iteration 2 snapshot"
```

Then continue normal development on the live app (root URL) for the next iteration.

### Landing page link

In `src/components/IndexPage.tsx`, the frozen link is a **plain `<a>`** (not a react-router
`<Link>`), because the snapshot is a separate build with its own bundle and router basename:

```tsx
<a href="/iteration-2/receive-assess"> Iteration 2 (as usability-tested) </a>
```

Relabel the previous "in progress" link to the new current iteration number, and update the
in-progress `<Link to="/receive-assess">` label to match.

---

## How it works

### The build (`scripts/freeze-iteration.mjs`, `npm run freeze`)

`npm run freeze -- iteration-N` runs:

```
vite build --base=/iteration-N/ --outDir snapshots/iteration-N --emptyOutDir
```

Setting Vite's `--base` to `/iteration-N/` makes two things resolve under that prefix:

- **Bundled asset URLs** in the built `index.html` (`/iteration-N/assets/…`).
- **`import.meta.env.BASE_URL`** — inlined as the string `"/iteration-N/"` at build time.

The app reads `BASE_URL` in three places, which is what makes a snapshot self-contained:

| Concern | Where | Effect in a snapshot |
|---------|-------|----------------------|
| Static asset paths (cdp/images/documents) | `src/utils/asset.ts`, used by `MarineCaseSummary.tsx` (CDP iframes), `IndexPage.tsx` (logo), `tasks/WfdTask.tsx` (doc link) | Point at `/iteration-N/cdp/…` etc. — the snapshot's own frozen copies |
| Router basename | `src/App.tsx` (`<Router basename={…}>`) | Client-side routes live under `/iteration-N/` |
| localStorage key | `src/context/TaskContext.tsx` | Keyed `mas-review-assess-state:iteration-N` so saved answers don't bleed between iterations or into the live app |

Because Vite copies `public/` (cdp, images, documents) into every build's output, the snapshot
gets its **own** copy of those files — later edits to the live `public/` can't change it.

### Serving (`server.js`)

Snapshots live in `snapshots/` at the repo root (a committed folder — **not** gitignored, and
deliberately **outside** `public/` so they're never nested inside later builds). `server.js`:

- serves `dist/` (the live app) and `snapshots/` (mounted at `/`, so `snapshots/iteration-N/…`
  is served at `/iteration-N/…`) as static files;
- has an SPA fallback that sends `/iteration-N/` deep links to that snapshot's own
  `index.html` (regex `^/(iteration-\d+)(/|$)`), and everything else to the live `index.html`.

No Heroku/hosting change is needed — one dyno serves the live app and every snapshot.

---

## Rules & gotchas

- **Never hard-code `/cdp/…`, `/images/…`, `/documents/…`.** Always go through `asset()` from
  `src/utils/asset.ts`, or the snapshot will load the *live* file instead of its frozen copy.
- **Snapshot naming is `iteration-<N>`** (hyphen). The server regex and the freeze script both
  depend on that exact shape.
- **`snapshots/` must stay committed** (it's not in `.gitignore`; `dist/` is). It must also stay
  outside `public/` so a later freeze doesn't copy older snapshots into the new one.
- **Freeze from the state you tested**, before starting the next iteration's changes. The git
  tag is the pure record; the built snapshot carries the (visually identical) `BASE_URL` asset
  handling that makes it self-contained.
- **Don't rebuild an existing snapshot** to "update" it — that defeats the point. A snapshot is
  frozen. If an old iteration genuinely needs a fix, think hard about whether it should change
  at all.

## Verifying a freeze

```bash
# asset refs in the snapshot index should be /iteration-N/…
grep -oE '(src|href)="[^"]*"' snapshots/iteration-N/index.html

# the snapshot has its own public assets
ls snapshots/iteration-N/{cdp,images,documents}

# routing: run the server and check the snapshot deep link + a frozen CDP page
PORT=4599 node server.js &
curl -s localhost:4599/iteration-N/receive-assess | grep -oE 'src="[^"]*\.js"'   # → /iteration-N/assets/…
curl -s -o /dev/null -w '%{http_code}\n' localhost:4599/iteration-N/cdp/project-details.html  # → 200
```
