import { readdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const iconSource = new URL('../../../node_modules/@fluentui/react-icons/lib/icons/', import.meta.url);
const names = [
  'AddRegular',
  'ArrowLeftRegular',
  'ArrowUpRegular',
  'ContactCardRegular',
  'ChevronDownRegular',
  'ChevronRightRegular',
  'ClockRegular',
  'DataBarVerticalRegular',
  'DocumentCopyRegular',
  'ErrorCircleRegular',
  'GlobeRegular',
  'HomeRegular',
  'LightbulbRegular',
  'LocationRegular',
  'LockClosedRegular',
  'OpenRegular',
  'PersonRegular',
  'PinRegular',
  'QuestionRegular',
  'SaveRegular',
  'SearchRegular',
  'SettingsRegular',
  'WrenchRegular'
];

const files = (await readdir(iconSource)).filter(file => /^chunk-\d+\.js$/.test(file));
const source = (await Promise.all(files.map(file => readFile(new URL(file, iconSource), 'utf8')))).join('\n');
const icons = {};

for (const name of names) {
  const pattern = new RegExp(`createFluentIcon\\('${name}', "1em", (\\[[\\s\\S]*?\\])(?:,|\\))`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find ${name} in @fluentui/react-icons`);
  icons[name] = JSON.parse(match[1]);
}

await writeFile(new URL('src/fluent-icons.json', root), `${JSON.stringify(icons, null, 2)}\n`, 'utf8');
console.log(`Extracted ${names.length} Fluent UI vector icons`);
