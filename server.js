// Production server for the MAS prototype.
// Serves the built static app from dist/. The app is open — there is no
// authentication, so usability-test participants can reach it with just the URL.
// (HTTP Basic Auth was removed because the password gate was blocking testers.)

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = process.env.PORT || 3000;

const app = express();

// Serve built assets, with SPA fallback so client-side routes resolve.
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.listen(port, () => console.log(`MAS prototype listening on port ${port}`));
