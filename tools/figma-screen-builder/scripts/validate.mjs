import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [manifestText, descriptionsText, iconsText, code] = await Promise.all([
  readFile(new URL('manifest.json', root), 'utf8'),
  readFile(new URL('src/screen-descriptions.json', root), 'utf8'),
  readFile(new URL('src/fluent-icons.json', root), 'utf8'),
  readFile(new URL('code.js', root), 'utf8'),
]);

const manifest = JSON.parse(manifestText);
const descriptions = JSON.parse(descriptionsText);
const icons = JSON.parse(iconsText);
const requiredScreens = ['caseList', 'publicRegister'];

if (manifest.main !== 'code.js') throw new Error('manifest.json must load code.js');
if (manifest.networkAccess?.allowedDomains?.[0] !== 'none') {
  throw new Error('The first version must not use external network access');
}
for (const key of requiredScreens) {
  if (!descriptions[key]) throw new Error(`Missing screen description: ${key}`);
}
if (!descriptions.publicRegisterVariations?.length) {
  throw new Error('Missing representative Public register conditional state');
}
if (!code.includes('MAS D365 Screen Builder')) throw new Error('code.js was not built correctly');
if (code.includes('.remove(')) throw new Error('The plugin must not delete existing Figma nodes');
for (const name of ['ArrowLeftRegular', 'OpenRegular', 'SaveRegular', 'LockClosedRegular', 'GlobeRegular', 'ErrorCircleRegular']) {
  if (!icons[name]?.length) throw new Error(`Missing Fluent icon data: ${name}`);
}

console.log('Manifest, screen descriptions and generated plugin are valid');
