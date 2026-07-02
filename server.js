// Production server for the MAS prototype.
// Serves the built static app from dist/. The app is open — there is no
// authentication, so usability-test participants can reach it with just the URL.
// (HTTP Basic Auth was removed because the password gate was blocking testers.)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
// Frozen iteration snapshots live in snapshots/<iteration-N>/ (committed to the
// repo, built by `npm run freeze`). Mounting the folder at '/' serves each one at
// its own /iteration-N/ prefix. See docs/iteration-snapshots.md.
const snapshotsDir = path.join(__dirname, 'snapshots');
const port = process.env.PORT || 3000;

const app = express();

// Serve the current app and the frozen snapshots as static files.
app.use(express.static(distDir));
app.use(express.static(snapshotsDir));

// SPA fallback so client-side routes resolve on refresh / deep link. Requests
// under /iteration-N/ belong to that snapshot's own SPA; everything else is the
// current app.
app.get('*', (req, res) => {
  const match = req.path.match(/^\/(iteration-\d+)(\/|$)/);
  if (match) {
    return res.sendFile(path.join(snapshotsDir, match[1], 'index.html'));
  }
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => console.log(`MAS prototype listening on port ${port}`));
