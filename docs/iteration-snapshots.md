# Preserving iterations as snapshots

A plan (not yet implemented) for keeping each completed iteration of the prototype
permanently viewable in its tested state, so usability-test stakeholders can flip
between iterations.

> **Status: not built yet.** This is a handoff brief. A future agent can pick it up and
> implement it. Confirm the requirement still stands with the user before starting — they
> may only want to freeze specific iterations rather than all of them.

---

## The goal

We iterate the prototype (Iteration 1, then 2, …) based on user feedback. After an
iteration has been usability-tested we want it to stay reachable **exactly as it was
tested**, even after the code moves on. Ideally every preserved iteration is linked from
the index page (`src/components/IndexPage.tsx`).

## Constraints (read these first)

- **Single Heroku app, single dyno.** Deployment is one Express server (`server.js`,
  started by `Procfile` → `web: node server.js`) serving the built `dist/` folder with an
  SPA fallback. We **cannot** spin up a separate Heroku app per iteration — everything must
  run from this one app.
- **Build pipeline:** `npm run build` = `tsc -b && vite build` → outputs `dist/`. Vite copies
  everything in `public/` verbatim into `dist/` on every build.
- **Router:** the app uses `BrowserRouter` (`src/App.tsx`), no `basename` today.
- **`vite.config.ts` has no `base` set** (defaults to `/`).

## What "versions" mean today (don't be misled)

- On the index page, **"Version 1" and "Version 2"** point at the *same* route
  (`/review-assess`) and the *same* code. They differ only by a runtime data toggle
  (`setTasksOnAllTabs(true/false)`). They are **not** separate code iterations.
- **"Proof of concept"** (`/iteration1` route in `App.tsx`) **is** a genuine frozen
  in-app snapshot — older components living alongside the current app under their own route.
  It's a working example of the "in-app" approach described below.

---

## Recommended approach: static frozen snapshots served as sub-paths

Freeze each completed iteration as a **prebuilt static copy** committed into the repo, served
by the existing Heroku app at a sub-path (`/v1/`, `/v2/`, …). This gives byte-for-byte
fidelity, runs on the one Heroku dyno, and — crucially — **keeps the live `src/` clean**
(it only ever contains the current iteration).

### Mechanics

1. **Build the iteration once, under its sub-path base.** From the commit/tag being frozen:
   - Set Vite base to the sub-path for that build: `vite build --base=/v1/`.
   - Set the router basename for that build: `<BrowserRouter basename="/v1">` in `src/App.tsx`.
     (Only for the snapshot build — the live app stays at `/`.)
2. **Commit the built output into `public/v1/`.** Because Vite copies `public/` straight into
   `dist/`, the snapshot ends up at `dist/v1/` on every future deploy and is served at
   `https://<app>.herokuapp.com/v1/`. It never rebuilds, so it can't drift.
3. **Link it from the index page** (`IndexPage.tsx`) — a plain `<a href="/v1/">` (not a
   react-router `<Link>`, since it's a separate built app, not an in-app route).
4. **Make the SPA fallback sub-path-aware** in `server.js`. Today the catch-all does
   `res.sendFile(dist/index.html)` for everything; a deep link or refresh under `/v1/…` must
   fall back to `/v1/index.html` instead. ~5 lines: if the request path starts with a known
   snapshot prefix, serve that snapshot's `index.html`.

### A `freeze` helper (suggested)

Add an npm script / small Node script that automates step 1–2 for a given version label, so
each future freeze is one command, e.g. `npm run freeze -- v2`. It should:
- check out the tag/commit for that iteration (or operate on current working tree),
- build with `--base=/vN/` and the matching `basename`,
- copy the build output into `public/vN/`,
- leave `src/` and the live app untouched.

### Effort

- **One-time:** moderate — the `base`/`basename` plumbing, the `server.js` fallback tweak,
  and the `freeze` script.
- **Per iteration after that:** one command + an index-page link.

### Gotchas to verify when implementing

- **`base` + `basename` must match** the sub-path or assets/routes 404.
- Any **absolute asset URLs** in the app (e.g. `/images/...`, `/cdp/...`, the logo in
  `IndexPage.tsx`) will resolve against the domain root, not the sub-path. Confirm the
  snapshot still finds its images and CDP iframe pages — they may need to be relative, or the
  snapshot needs its own copy of those assets under `public/v1/`.
- **CDP iframe pages** (`public/cdp/*.html`) are loaded by `CdpFrame.tsx` at `/cdp/...`.
  A snapshot should bundle its own copy so later CDP edits don't change the frozen iteration.
- Test a **hard refresh on a deep link** under `/v1/` to confirm the server fallback works.

---

## Fallback approach: in-app versioned routes

Lower upfront effort, but it bloats the live source over time. This is what `/iteration1`
already does.

- Copy the iteration's components into a `src/components/v1/` folder, namespace its route
  (`/v1/...`) in `App.tsx`, and link it from the index page.
- **No deploy/server changes** — works on the one Heroku app immediately.

### Why it's the second choice

- `src/` grows with every iteration and must never be touched again (easy to break by accident).
- **Shared state gotchas** that must be isolated per iteration or old iterations get corrupted:
  - The single `TaskContext` uses one `localStorage` key (`mas-review-assess-state`). A frozen
    iteration needs its **own key** (e.g. `mas-state-v1`) or iterations read each other's data.
  - `public/cdp/` pages are global — version them (`public/cdp/v1/...`) if an iteration changes them.
  - Shared mock data (`src/mock-data/`) and entity configs are global — copy if an iteration diverges.

Prefer this only if you'll keep just one or two old iterations around.

---

## Always do this regardless: tag in git

Independent of either approach, **tag the commit you tested** the moment an iteration's
usability testing ends:

```bash
git tag iteration-1
git push origin iteration-1
```

This is free, permanent, and the unambiguous source of record — and it's what the `freeze`
script would build from. Even if we never build a live snapshot, the exact tested code is
recoverable.

---

## Recommendation summary

1. **Tag every iteration in git** — always, immediately, low cost.
2. For iterations stakeholders need to revisit live, **build static snapshots into
   `public/vN/`** and serve them as sub-paths from the one Heroku app (the recommended
   approach above). Keeps the active source clean and gives perfect fidelity.
3. Use in-app versioned routes only as a quick fallback for one or two iterations.
