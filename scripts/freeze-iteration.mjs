// Freeze the current app as a permanent iteration snapshot.
//
//   npm run freeze -- iteration-1
//
// Builds the app with Vite's base set to /<label>/ and writes the output to
// snapshots/<label>/. Because the base is set, every asset and client-side route
// resolves under that prefix, so the snapshot is fully self-contained (its own
// copy of cdp/, images/, documents/) and never drifts as the live app changes.
//
// Commit the resulting snapshots/<label>/ folder. server.js serves it at
// /<label>/. See docs/iteration-snapshots.md for the full runbook.

import { execSync } from 'node:child_process';

const label = process.argv[2];

if (!label || !/^iteration-\d+$/.test(label)) {
  console.error('Usage: npm run freeze -- iteration-<N>   (e.g. iteration-1)');
  process.exit(1);
}

const outDir = `snapshots/${label}`;

console.log(`\nFreezing current app → ${outDir}  (base=/${label}/)\n`);

execSync(`npx vite build --base=/${label}/ --outDir ${outDir} --emptyOutDir`, {
  stdio: 'inherit',
});

console.log(`\n✓ ${label} frozen at ${outDir}/`);
console.log(`  Next: commit the ${outDir}/ folder and add its link to the index page.\n`);
