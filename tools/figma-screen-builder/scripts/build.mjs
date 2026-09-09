import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const [template, descriptions, icons] = await Promise.all([
  readFile(new URL('src/code.template.js', root), 'utf8'),
  readFile(new URL('src/screen-descriptions.json', root), 'utf8'),
  readFile(new URL('src/fluent-icons.json', root), 'utf8'),
]);

const parsed = JSON.parse(descriptions);
const parsedIcons = JSON.parse(icons);
const output = template
  .replace('__SCREEN_DESCRIPTIONS__', JSON.stringify(parsed, null, 2))
  .replace('__FLUENT_ICONS__', JSON.stringify(parsedIcons, null, 2));

if (output === template || output.includes('__FLUENT_ICONS__')) {
  throw new Error('Build marker was not found in src/code.template.js');
}

await writeFile(new URL('code.js', root), `${output.trim()}\n`, 'utf8');
console.log('Built code.js from src/code.template.js and src/screen-descriptions.json');
