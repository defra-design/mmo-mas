import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [manifestText, descriptionsText, iconsText, code, ui] = await Promise.all([
  readFile(new URL('manifest.json', root), 'utf8'),
  readFile(new URL('src/screen-descriptions.json', root), 'utf8'),
  readFile(new URL('src/fluent-icons.json', root), 'utf8'),
  readFile(new URL('code.js', root), 'utf8'),
  readFile(new URL('ui.html', root), 'utf8'),
]);

const manifest = JSON.parse(manifestText);
const descriptions = JSON.parse(descriptionsText);
const icons = JSON.parse(iconsText);
const requiredScreens = [
  'caseList',
  'caseSummaryStates',
  'siteCheckContent',
  'siteCheckStates',
  'publicRegister',
  'publicNoticeEvidenceReview',
];

if (manifest.main !== 'code.js') throw new Error('manifest.json must load code.js');
if (manifest.ui !== 'ui.html') throw new Error('manifest.json must load the screen picker UI');
if (manifest.networkAccess?.allowedDomains?.[0] !== 'none') {
  throw new Error('The first version must not use external network access');
}
for (const key of requiredScreens) {
  if (!descriptions[key]) throw new Error(`Missing screen description: ${key}`);
}
if (!descriptions.publicRegisterVariations?.length) {
  throw new Error('Missing representative Public register conditional state');
}
if (descriptions.caseSummaryStates?.length !== 2 || descriptions.siteCheckStates?.length !== 3) {
  throw new Error('The first assessment journey must contain two case summaries and three Site check states');
}
if (descriptions.publicNoticeEvidenceReview?.states?.length !== 5) {
  throw new Error('Review public notice evidence must include the original and resubmission review states');
}
if (!manifest.menu?.some(item => item.command === 'choose-screens')) {
  throw new Error('Missing screen and state picker command');
}
if (!code.includes('MAS D365 Screen Builder')) throw new Error('code.js was not built correctly');
if (code.includes('.remove(')) throw new Error('The plugin must not delete existing Figma nodes');
for (const marker of ['Select all', 'Public register', 'Assessment journey', 'Notice evidence', 'Generate selected']) {
  if (!ui.includes(marker)) throw new Error(`Screen picker is missing: ${marker}`);
}
for (const screenId of [
  'case-list',
  'public-register-initial',
  'public-register-variation-',
  'case-summary-initial',
  'site-check-',
  'case-summary-unlocked',
  'public-notice-evidence-',
]) {
  if (!code.includes(screenId)) throw new Error(`Screen picker cannot generate: ${screenId}`);
}
for (const name of [
  'ArrowLeftRegular',
  'ArrowDownloadRegular',
  'OpenRegular',
  'SaveRegular',
  'LockClosedRegular',
  'GlobeRegular',
  'ImageRegular',
  'ErrorCircleRegular',
  'DismissCircleFilled',
  'DismissSquareRegular',
  'SendRegular',
]) {
  if (!icons[name]?.length) throw new Error(`Missing Fluent icon data: ${name}`);
}

console.log('Manifest, screen descriptions and generated plugin are valid');
