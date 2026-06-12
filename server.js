// Production server for the MAS prototype.
// Serves the built static app from dist/ behind HTTP Basic Auth.
// The password comes from the Heroku config var PASSWORD (process.env.PASSWORD)
// and is never sent to the browser.

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { timingSafeEqual } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;

const app = express();

// Constant-time string compare to avoid leaking length/contents via timing.
function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Basic Auth gate. Any username is accepted; only the password is checked.
// If PASSWORD is not set (e.g. local preview), auth is skipped with a warning.
app.use((req, res, next) => {
  if (!PASSWORD) {
    console.warn('PASSWORD env var not set — serving app without authentication.');
    return next();
  }

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const password = decoded.slice(decoded.indexOf(':') + 1);
    if (safeEqual(password, PASSWORD)) return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="MAS prototype"');
  return res.status(401).send('Authentication required.');
});

// Serve built assets, with SPA fallback so client-side routes resolve.
app.use(express.static(distDir));
app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));

app.listen(port, () => console.log(`MAS prototype listening on port ${port}`));
