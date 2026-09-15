// MAS D365 Screen Builder
// Generated code.js is built from this renderer and screen-descriptions.json.

const DESCRIPTIONS = __SCREEN_DESCRIPTIONS__;
const FLUENT_ICONS = __FLUENT_ICONS__;

const C = {
  navy: '#001640',
  brand: '#0078D4',
  canvas: '#FAFAFA',
  nav: '#F3F2F1',
  white: '#FFFFFF',
  text: '#323130',
  secondary: '#605E5C',
  disabled: '#A19F9D',
  stroke: '#E1DFDD',
  field: '#F3F2F1',
  hover: '#EDEBE9',
  red: '#C50F1F',
  errorBackground: '#FDE7E9',
  yellow: '#FFE399',
};

const STATUS = {
  'Awaiting allocation': { background: '#E5E6E7', text: '#282D30' },
  'Assessment in progress': { background: '#CFE4F8', text: '#0C2D4A' },
  'Awaiting applicant': { background: '#FDF2CC', text: '#5C4400' },
  Consultation: { background: '#FBE2C4', text: '#6B3B00' },
};

const AVATARS = {
  'Sam Evans': '#FFE399',
  'Rachel Patel': '#7BC67B',
  'Gary Whitfield': '#A83CC2',
  'James Okafor': '#4AA3DF',
};

const TEXT_SPECS = {
  body: { size: 14, line: 20, weight: 'regular' },
  small: { size: 12, line: 16, weight: 'regular' },
  label: { size: 14, line: 20, weight: 'semibold' },
  section: { size: 16, line: 22, weight: 'semibold' },
  title: { size: 24, line: 32, weight: 'semibold' },
  product: { size: 16, line: 22, weight: 'semibold' },
};

let fonts;
let styles;

function rgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function paint(hex, opacity = 1) {
  return [{ type: 'SOLID', color: rgb(hex), opacity }];
}

function readableTextOn(hex) {
  const color = rgb(hex);
  const linear = value => value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  const luminance = (0.2126 * linear(color.r)) + (0.7152 * linear(color.g)) + (0.0722 * linear(color.b));
  return luminance > 0.42 ? C.text : C.white;
}

async function loadPreferredFonts() {
  const candidates = [
    {
      regular: { family: 'Segoe UI', style: 'Regular' },
      semibold: { family: 'Segoe UI', style: 'Semibold' },
    },
    {
      regular: { family: 'Inter', style: 'Regular' },
      semibold: { family: 'Inter', style: 'Semi Bold' },
    },
  ];

  for (const candidate of candidates) {
    try {
      await Promise.all([
        figma.loadFontAsync(candidate.regular),
        figma.loadFontAsync(candidate.semibold),
      ]);
      return candidate;
    } catch (_) {
      // Try the next locally available font family.
    }
  }
  throw new Error('Segoe UI or Inter must be available in Figma.');
}

function ensureTextStyle(name, spec, runLabel) {
  const fullName = `D365 / ${runLabel} / ${name}`;
  let style = figma.getLocalTextStyles().find(item => item.name === fullName);
  if (!style) style = figma.createTextStyle();
  style.name = fullName;
  style.fontName = fonts[spec.weight];
  style.fontSize = spec.size;
  style.lineHeight = { value: spec.line, unit: 'PIXELS' };
  return style;
}

function ensurePaintStyle(name, hex, runLabel) {
  const fullName = `D365 / ${runLabel} / ${name}`;
  let style = figma.getLocalPaintStyles().find(item => item.name === fullName);
  if (!style) style = figma.createPaintStyle();
  style.name = fullName;
  style.paints = paint(hex);
  return style;
}

function ensureStyles(runLabel) {
  const text = {};
  for (const [name, spec] of Object.entries(TEXT_SPECS)) {
    text[name] = ensureTextStyle(name, spec, runLabel);
  }
  return {
    text,
    paint: {
      brand: ensurePaintStyle('Brand', C.brand, runLabel),
      navy: ensurePaintStyle('Global header', C.navy, runLabel),
      canvas: ensurePaintStyle('Canvas', C.canvas, runLabel),
      nav: ensurePaintStyle('Navigation', C.nav, runLabel),
      field: ensurePaintStyle('Read-only field', C.field, runLabel),
      text: ensurePaintStyle('Text', C.text, runLabel),
      secondary: ensurePaintStyle('Secondary text', C.secondary, runLabel),
      stroke: ensurePaintStyle('Divider', C.stroke, runLabel),
    },
  };
}

function fillStyleFor(color) {
  if (!styles) return null;
  const matches = {
    [C.brand]: styles.paint.brand,
    [C.navy]: styles.paint.navy,
    [C.canvas]: styles.paint.canvas,
    [C.nav]: styles.paint.nav,
    [C.field]: styles.paint.field,
    [C.text]: styles.paint.text,
    [C.secondary]: styles.paint.secondary,
    [C.stroke]: styles.paint.stroke,
  };
  return matches[color] || null;
}

function makeText(name, value, styleName = 'body', color = C.text, width) {
  const node = figma.createText();
  node.name = name;
  node.fontName = fonts[TEXT_SPECS[styleName].weight];
  node.textStyleId = styles.text[styleName].id;
  node.fills = paint(color);
  const fillStyle = fillStyleFor(color);
  if (fillStyle) node.fillStyleId = fillStyle.id;
  node.characters = value;
  if (width) {
    node.resize(width, Math.max(TEXT_SPECS[styleName].line, 1));
    node.textAutoResize = 'HEIGHT';
  } else {
    node.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  return node;
}

function makeIcon(name, iconName, size = 20, color = C.text) {
  const paths = FLUENT_ICONS[iconName];
  if (!paths) throw new Error(`Unknown Fluent icon: ${iconName}`);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20" fill="${color}">`,
    ...paths.map(path => `<path d="${path}"/>`),
    '</svg>',
  ].join('');
  const node = figma.createNodeFromSvg(svg);
  node.name = name;
  node.resize(size, size);
  return node;
}

function makeResizeGrip() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">',
    `<path d="M11 4L4 11M11 8L8 11" stroke="${C.secondary}" stroke-width="1" stroke-linecap="round"/>`,
    '</svg>',
  ].join('');
  const node = figma.createNodeFromSvg(svg);
  node.name = 'Resize handle';
  node.resize(12, 12);
  return node;
}

function makeAppLauncher() {
  const frame = fixedFrame('App launcher', 24, 24);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const dot = figma.createRectangle();
      dot.name = 'App launcher dot';
      dot.resize(3, 3);
      dot.x = 5 + column * 6;
      dot.y = 5 + row * 6;
      dot.cornerRadius = 1.5;
      dot.fills = paint(C.white);
      frame.appendChild(dot);
    }
  }
  return frame;
}

function makeEmptyCheckbox(name = 'Checkbox') {
  const frame = fixedFrame(name, 20, 20);
  const box = figma.createRectangle();
  box.name = 'Checkbox box';
  box.resize(16, 16);
  box.x = 2;
  box.y = 2;
  box.cornerRadius = 2;
  box.fills = [];
  box.strokes = paint(C.secondary);
  box.strokeWeight = 1;
  frame.appendChild(box);
  return frame;
}

function fixedFrame(name, width, height, fill = null) {
  const node = figma.createFrame();
  node.name = name;
  node.resize(width, height);
  node.clipsContent = false;
  node.fills = fill ? paint(fill) : [];
  const fillStyle = fill && fillStyleFor(fill);
  if (fillStyle) node.fillStyleId = fillStyle.id;
  return node;
}

function verticalFrame(name, width, gap = 0, padding = 0, fill = null) {
  const node = fixedFrame(name, width, 1, fill);
  node.layoutMode = 'VERTICAL';
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'FIXED';
  node.itemSpacing = gap;
  node.paddingTop = padding;
  node.paddingRight = padding;
  node.paddingBottom = padding;
  node.paddingLeft = padding;
  return node;
}

function horizontalFrame(name, width, height, gap = 0, paddingX = 0, fill = null) {
  const node = fixedFrame(name, width, height, fill);
  node.layoutMode = 'HORIZONTAL';
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'FIXED';
  node.itemSpacing = gap;
  node.paddingLeft = paddingX;
  node.paddingRight = paddingX;
  node.primaryAxisAlignItems = 'MIN';
  node.counterAxisAlignItems = 'CENTER';
  return node;
}

function applyCard(node) {
  node.fills = paint(C.white);
  node.cornerRadius = 4;
  node.strokes = paint(C.stroke);
  node.strokeWeight = 1;
  node.effects = [{
    type: 'DROP_SHADOW',
    color: { ...rgb('#000000'), a: 0.14 },
    offset: { x: 0, y: 3 },
    radius: 6,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
}

function addLine(parent, name, width, color = C.stroke) {
  const line = figma.createRectangle();
  line.name = name;
  line.resize(width, 1);
  line.fills = paint(color);
  const fillStyle = fillStyleFor(color);
  if (fillStyle) line.fillStyleId = fillStyle.id;
  parent.appendChild(line);
  return line;
}

function setText(root, name, value) {
  const node = root.findOne(item => item.type === 'TEXT' && item.name === name);
  if (node) node.characters = value;
}

function initials(name) {
  return name.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function createCheckboxComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Checkbox / Checked';
  component.resize(20, 20);
  component.fills = [];
  const box = figma.createRectangle();
  box.name = 'Checkbox box';
  box.resize(16, 16);
  box.x = 2;
  box.y = 2;
  box.cornerRadius = 2;
  box.fills = paint(C.brand);
  const tick = makeText('Checkbox mark', '✓', 'small', C.white);
  tick.x = 4;
  tick.y = 1;
  component.appendChild(box);
  component.appendChild(tick);
  page.appendChild(component);
  return component;
}

function createAvatarComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / User avatar';
  component.resize(24, 24);
  component.cornerRadius = 12;
  component.fills = paint(C.yellow);
  const label = makeText('Avatar initials', 'SE', 'small', C.text);
  label.textAlignHorizontal = 'CENTER';
  label.resize(24, 16);
  label.x = 0;
  label.y = 4;
  component.appendChild(label);
  page.appendChild(component);
  return component;
}

function createStatusComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Status label';
  component.resize(160, 26);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'AUTO';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = 8;
  component.paddingRight = 8;
  component.cornerRadius = 2;
  component.fills = paint(STATUS['Assessment in progress'].background);
  component.appendChild(makeText('Status', 'Assessment in progress', 'body', STATUS['Assessment in progress'].text));
  page.appendChild(component);
  return component;
}

function createDividerComponent(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Section divider';
  component.resize(1278, 1);
  component.fills = paint(C.stroke);
  component.fillStyleId = styles.paint.stroke.id;
  page.appendChild(component);
  return component;
}

function createFieldComponents(page) {
  const readOnly = figma.createComponent();
  readOnly.name = 'D365 / Read-only field';
  readOnly.resize(900, 1);
  readOnly.layoutMode = 'VERTICAL';
  readOnly.primaryAxisSizingMode = 'AUTO';
  readOnly.counterAxisSizingMode = 'FIXED';
  readOnly.paddingTop = 8;
  readOnly.paddingRight = 12;
  readOnly.paddingBottom = 8;
  readOnly.paddingLeft = 12;
  readOnly.cornerRadius = 2;
  readOnly.fills = paint(C.field);
  readOnly.fillStyleId = styles.paint.field.id;
  readOnly.appendChild(makeText('Field value', 'Field value', 'body', C.text, 876));
  page.appendChild(readOnly);

  const dropdown = figma.createComponent();
  dropdown.name = 'D365 / Dropdown field';
  dropdown.resize(900, 32);
  dropdown.layoutMode = 'HORIZONTAL';
  dropdown.primaryAxisSizingMode = 'FIXED';
  dropdown.counterAxisSizingMode = 'FIXED';
  dropdown.primaryAxisAlignItems = 'SPACE_BETWEEN';
  dropdown.counterAxisAlignItems = 'CENTER';
  dropdown.paddingLeft = 12;
  dropdown.paddingRight = 10;
  dropdown.cornerRadius = 2;
  dropdown.fills = paint(C.field);
  dropdown.fillStyleId = styles.paint.field.id;
  const dropdownValue = makeText('Field value', '---', 'body', C.disabled, 842);
  dropdownValue.textTruncation = 'ENDING';
  dropdownValue.maxLines = 1;
  dropdown.appendChild(dropdownValue);
  dropdown.appendChild(makeIcon('Dropdown chevron', 'ChevronDownRegular', 16, C.secondary));
  page.appendChild(dropdown);

  const url = figma.createComponent();
  url.name = 'D365 / Read-only URL field';
  url.resize(900, 32);
  url.layoutMode = 'HORIZONTAL';
  url.primaryAxisSizingMode = 'FIXED';
  url.counterAxisSizingMode = 'FIXED';
  url.primaryAxisAlignItems = 'SPACE_BETWEEN';
  url.counterAxisAlignItems = 'CENTER';
  url.paddingLeft = 12;
  url.paddingRight = 8;
  url.cornerRadius = 2;
  url.fills = paint(C.field);
  url.fillStyleId = styles.paint.field.id;
  const urlText = makeText('Field value', 'https://example.invalid', 'body', C.brand, 830);
  urlText.textTruncation = 'ENDING';
  urlText.maxLines = 1;
  url.appendChild(urlText);
  url.appendChild(makeIcon('Open URL', 'GlobeRegular', 20, C.secondary));
  page.appendChild(url);

  const imageLink = figma.createComponent();
  imageLink.name = 'D365 / Evidence image link field';
  imageLink.resize(900, 32);
  imageLink.layoutMode = 'HORIZONTAL';
  imageLink.primaryAxisSizingMode = 'FIXED';
  imageLink.counterAxisSizingMode = 'FIXED';
  imageLink.counterAxisAlignItems = 'CENTER';
  imageLink.itemSpacing = 8;
  imageLink.paddingLeft = 12;
  imageLink.paddingRight = 12;
  imageLink.cornerRadius = 2;
  imageLink.fills = paint(C.field);
  imageLink.fillStyleId = styles.paint.field.id;
  imageLink.appendChild(makeIcon('Evidence image icon', 'ImageRegular', 20, C.brand));
  const imageLinkText = makeText('Field value', 'View photograph (opens in new tab)', 'body', C.brand, 848);
  imageLinkText.textTruncation = 'ENDING';
  imageLinkText.maxLines = 1;
  imageLink.appendChild(imageLinkText);
  page.appendChild(imageLink);

  const help = figma.createComponent();
  help.name = 'D365 / Help link';
  help.resize(1128, 24);
  help.layoutMode = 'HORIZONTAL';
  help.primaryAxisSizingMode = 'AUTO';
  help.counterAxisSizingMode = 'AUTO';
  help.counterAxisAlignItems = 'MIN';
  help.itemSpacing = 8;
  help.appendChild(makeIcon('Disclosure chevron', 'ChevronRightRegular', 20, C.brand));
  help.appendChild(makeText('Help text', 'Help with personal information', 'body', C.brand, 1100));
  page.appendChild(help);

  const validation = figma.createComponent();
  validation.name = 'D365 / Validation message';
  validation.resize(900, 20);
  validation.layoutMode = 'HORIZONTAL';
  validation.primaryAxisSizingMode = 'FIXED';
  validation.counterAxisSizingMode = 'AUTO';
  validation.counterAxisAlignItems = 'MIN';
  validation.itemSpacing = 8;
  validation.appendChild(makeIcon('Validation icon', 'ErrorCircleRegular', 20, C.red));
  validation.appendChild(makeText('Validation message', 'Enter a value before continuing.', 'body', C.red, 872));
  page.appendChild(validation);

  return { readOnly, dropdown, url, imageLink, help, validation };
}

function createQuestionRow(page, name, fieldComponent, decoration, multiline = false, editable = false) {
  const component = figma.createComponent();
  component.name = `D365 / Form question row / ${name}`;
  component.resize(1278, 1);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'AUTO';
  component.counterAxisAlignItems = 'MIN';
  component.itemSpacing = 0;

  // Figma's Segoe UI metrics wrap a little earlier than the browser. The extra
  // label width keeps the reference's three-line long question while retaining
  // the same 378px D365 label/decorations column before every control.
  const label = verticalFrame('Content', 336, 0, 0);
  label.appendChild(makeText('Question', multiline ? 'Question wrapping over two lines' : 'Question', 'body', C.text, 336));
  component.appendChild(label);

  component.appendChild(fixedFrame('Label spacing', 8, 1));

  const marker = horizontalFrame('Field decoration', 26, 32, 0, 0);
  marker.primaryAxisAlignItems = 'MAX';
  marker.itemSpacing = 2;
  if (decoration === 'required' || decoration === 'required-locked') {
    marker.appendChild(makeText('Required indicator', '*', 'body', C.red));
  }
  if (decoration === 'locked' || decoration === 'required-locked') {
    marker.appendChild(makeIcon('Read-only indicator', 'LockClosedRegular', 16, C.secondary));
  }
  if (decoration === 'none') {
    marker.appendChild(fixedFrame('No field decoration', 16, 16));
  }
  component.appendChild(marker);

  component.appendChild(fixedFrame('Field spacing', 8, 1));

  const field = fieldComponent.createInstance();
  field.name = name === 'URL' ? 'Read-only URL field' : name.includes('Dropdown') ? 'Dropdown field' : 'Read-only field';
  if (editable) {
    field.name = 'Multiline text field';
    field.fills = paint(C.field);
    field.fillStyleId = styles.paint.field.id;
    field.strokes = [];
    field.strokeWeight = 0;
  }
  if (multiline) {
    const fieldHeight = editable ? 112 : 136;
    field.resize(900, fieldHeight);
    field.minHeight = fieldHeight;
  } else {
    field.resize(900, field.height);
  }
  component.appendChild(field);
  if (editable) {
    const grip = makeResizeGrip();
    component.appendChild(grip);
    grip.layoutPositioning = 'ABSOLUTE';
    grip.x = 1264;
    grip.y = 98;
    grip.constraints = { horizontal: 'MAX', vertical: 'MAX' };
  }
  page.appendChild(component);
  return component;
}

function createGlobalHeader(page, shell) {
  const component = figma.createComponent();
  component.name = 'D365 / Global header';
  component.resize(1640, 48);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.primaryAxisAlignItems = 'SPACE_BETWEEN';
  component.counterAxisAlignItems = 'CENTER';
  component.paddingLeft = 20;
  component.paddingRight = 20;
  component.fills = paint(C.navy);
  component.fillStyleId = styles.paint.navy.id;

  const left = horizontalFrame('Product', 500, 48, 12, 0);
  left.primaryAxisSizingMode = 'AUTO';
  left.fills = [];
  left.appendChild(makeAppLauncher());
  left.appendChild(makeText('Product name', shell.product, 'product', C.white));
  left.appendChild(makeText('Product divider', '|', 'product', '#9AA7BD'));
  left.appendChild(makeText('Service name', shell.service, 'product', C.white));
  component.appendChild(left);

  const right = horizontalFrame('Global actions', 280, 48, 20, 0);
  right.primaryAxisSizingMode = 'AUTO';
  right.fills = [];
  for (const icon of ['SearchRegular', 'LightbulbRegular', 'AddRegular', 'SettingsRegular', 'QuestionRegular']) {
    right.appendChild(makeIcon('Global action', icon, 20, C.white));
  }
  const avatar = fixedFrame('Signed-in user avatar', 32, 32, C.yellow);
  avatar.cornerRadius = 16;
  const avatarText = makeText('Signed-in user initials', initials(shell.signedInUser), 'body', C.text, 32);
  avatarText.textAlignHorizontal = 'CENTER';
  avatarText.y = 6;
  avatar.appendChild(avatarText);
  right.appendChild(avatar);
  component.appendChild(right);
  page.appendChild(component);
  return component;
}

function createLeftNav(page, shell) {
  const component = figma.createComponent();
  component.name = 'D365 / Left navigation';
  component.resize(248, 1184);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.paddingTop = 8;
  component.fills = paint(C.nav);
  component.fillStyleId = styles.paint.nav.id;
  component.strokes = paint(C.stroke);
  component.strokeRightWeight = 1;

  for (const item of shell.navigation) {
    if (item.kind === 'group') {
      const spacing = fixedFrame('Navigation group spacing', 248, 16);
      spacing.fills = [];
      component.appendChild(spacing);
      const group = horizontalFrame('Navigation group', 248, 40, 0, 16);
      group.fills = [];
      group.appendChild(makeText('Navigation group label', item.label, 'label', C.text));
      component.appendChild(group);
      continue;
    }
    const row = horizontalFrame(`Navigation item / ${item.label}`, 248, 40, 10, 0, item.selected ? C.white : null);
    const selectedBar = figma.createRectangle();
    selectedBar.name = 'Selected indicator';
    selectedBar.resize(item.selected ? 5 : 3, 40);
    selectedBar.fills = item.selected ? paint(C.brand) : [];
    row.appendChild(selectedBar);
    row.appendChild(makeIcon('Navigation icon', item.icon, 16, item.selected ? C.brand : C.secondary));
    const label = makeText('Navigation item label', item.label, 'body', C.text, item.chevron ? 162 : 190);
    label.textTruncation = 'ENDING';
    label.maxLines = 1;
    row.appendChild(label);
    if (item.chevron) row.appendChild(makeIcon('Navigation chevron', 'ChevronDownRegular', 16, C.text));
    component.appendChild(row);
  }
  page.appendChild(component);
  return component;
}

function createCommandBar(page, save) {
  const component = figma.createComponent();
  component.name = `D365 / Command bar / ${save ? 'Save and close' : 'List'}`;
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 12;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  applyCard(component);
  component.appendChild(makeIcon('Back action', 'ArrowLeftRegular', 20, save ? C.text : C.disabled));
  component.appendChild(makeIcon('Open in new window', 'OpenRegular', 20, C.text));
  if (save) {
    const divider = figma.createRectangle();
    divider.name = 'Command divider';
    divider.resize(1, 20);
    divider.fills = paint(C.stroke);
    component.appendChild(divider);
    component.appendChild(makeIcon('Save icon', 'SaveRegular', 20, C.text));
    component.appendChild(makeText('Primary action', 'Save and close', 'body', C.text));
  }
  page.appendChild(component);
  return component;
}

function createCaseCommandBar(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Command bar / Case summary';
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 10;
  component.paddingLeft = 16;
  component.paddingRight = 16;
  applyCard(component);
  component.appendChild(makeIcon('Back action', 'ArrowLeftRegular', 20, C.disabled));
  component.appendChild(makeIcon('Open in new window', 'OpenRegular', 20, C.text));
  component.appendChild(makeIcon('Transfer action icon', 'SendRegular', 20, C.text));
  component.appendChild(makeText('Primary action', 'Request transfer to MCMS', 'body', C.text));
  component.appendChild(makeIcon('Reject action icon', 'DismissSquareRegular', 20, C.text));
  component.appendChild(makeText('Secondary action', 'Reject application', 'body', C.text));
  page.appendChild(component);
  return component;
}

function createFormNotification(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Form notification / Error';
  component.resize(1320, 40);
  component.layoutMode = 'HORIZONTAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.counterAxisAlignItems = 'CENTER';
  component.itemSpacing = 8;
  component.paddingLeft = 12;
  component.paddingRight = 12;
  component.fills = paint(C.errorBackground);
  component.strokes = paint(C.stroke);
  component.strokeBottomWeight = 1;
  component.appendChild(makeIcon('Notification icon', 'DismissCircleFilled', 16, C.red));
  component.appendChild(makeText('Validation message', 'Required fields must be filled in.', 'body', C.text, 1268));
  page.appendChild(component);
  return component;
}

function createTaskListRow(page) {
  const component = figma.createComponent();
  component.name = 'D365 / Task list row';
  component.resize(240, 60);
  component.layoutMode = 'VERTICAL';
  component.primaryAxisSizingMode = 'FIXED';
  component.counterAxisSizingMode = 'FIXED';
  component.paddingTop = 10;
  component.paddingRight = 28;
  component.paddingBottom = 9;
  component.fills = [];
  component.appendChild(makeText('Task name', 'Site check', 'label', C.text, 204));
  component.appendChild(makeText('Task status', 'To do', 'body', C.secondary, 204));
  const more = makeText('Task actions', '⋯', 'body', C.text);
  component.appendChild(more);
  more.layoutPositioning = 'ABSOLUTE';
  more.x = 220;
  more.y = 10;
  const divider = addLine(component, 'Task row divider', 240);
  divider.layoutPositioning = 'ABSOLUTE';
  divider.x = 0;
  divider.y = 59;
  page.appendChild(component);
  return component;
}

function createCaseHeader(page, description) {
  const component = figma.createComponent();
  component.name = 'D365 / Case record header';
  component.resize(1320, 152);
  applyCard(component);

  const titleGroup = horizontalFrame('Case identity', 680, 72, 12, 0);
  titleGroup.x = 20;
  titleGroup.y = 12;
  const caseAvatar = fixedFrame('Case avatar', 48, 48, '#D9A7E8');
  caseAvatar.cornerRadius = 24;
  const caseInitial = makeText('Case avatar initial', 'I', 'title', C.white, 48);
  caseInitial.textAlignHorizontal = 'CENTER';
  caseInitial.y = 8;
  caseAvatar.appendChild(caseInitial);
  titleGroup.appendChild(caseAvatar);
  const titleText = verticalFrame('Case title group', 620, 0, 0);
  const title = makeText('Page heading', description.title, 'title', C.text, 620);
  titleText.appendChild(title);
  titleText.appendChild(makeText('Record type', description.recordType, 'body', C.text));
  titleGroup.appendChild(titleText);
  component.appendChild(titleGroup);

  const meta = horizontalFrame('Case metadata', 560, 64, 24, 0);
  meta.primaryAxisAlignItems = 'MAX';
  meta.x = 740;
  meta.y = 16;
  for (const item of description.meta) {
    const groupWidth = item.avatar
      ? 124
      : item.label === 'Status'
        ? 140
        : item.label === 'Reference'
          ? 120
          : 70;
    const group = verticalFrame(`Metadata / ${item.label}`, groupWidth, 0, 0);
    if (item.avatar) {
      const assigned = horizontalFrame('Assigned user', 124, 40, 8, 0);
      const avatar = fixedFrame('Assignee avatar', 32, 32, C.yellow);
      avatar.cornerRadius = 16;
      const initialsText = makeText('Avatar initials', initials(item.value), 'small', C.text, 32);
      initialsText.textAlignHorizontal = 'CENTER';
      initialsText.y = 8;
      avatar.appendChild(initialsText);
      assigned.appendChild(avatar);
      const assignedText = verticalFrame('Assigned user text', 84, 0, 0);
      assignedText.appendChild(makeText(`Meta value / ${item.label}`, item.value, 'body', C.text, 84));
      assignedText.appendChild(makeText(`Meta label / ${item.label}`, item.label, 'small', C.secondary));
      assigned.appendChild(assignedText);
      group.appendChild(assigned);
    } else {
      group.appendChild(makeText(`Meta value / ${item.label}`, item.value, 'body', C.text, groupWidth));
      group.appendChild(makeText(`Meta label / ${item.label}`, item.label, 'small', C.secondary));
    }
    meta.appendChild(group);
  }
  component.appendChild(meta);

  const tabs = horizontalFrame('Case tabs', 1280, 48, 28, 0);
  tabs.x = 20;
  tabs.y = 104;
  tabs.counterAxisAlignItems = 'CENTER';
  description.tabs.forEach((label, index) => {
    const tab = fixedFrame(`Tab / ${label}`, index === 0 ? 104 : Math.max(110, label.length * 8), 48);
    const tabText = makeText('Tab label', label, index === 0 ? 'label' : 'body', C.text);
    tabText.x = 0;
    tabText.y = 14;
    tab.appendChild(tabText);
    if (index === 0) {
      const indicator = addLine(tab, 'Selected tab indicator', 104, C.brand);
      indicator.resize(104, 3);
      indicator.x = 0;
      indicator.y = 45;
    }
    tabs.appendChild(tab);
  });
  component.appendChild(tabs);
  page.appendChild(component);
  return component;
}

function createTableComponents(page, checkbox, avatar, status) {
  const header = figma.createComponent();
  header.name = 'D365 / Table header';
  header.resize(1278, 44);
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisSizingMode = 'FIXED';
  header.counterAxisSizingMode = 'FIXED';
  header.fills = [];

  const select = horizontalFrame('Select column', 46, 44, 0, 12);
  select.appendChild(makeEmptyCheckbox('Select all'));
  header.appendChild(select);
  for (const column of DESCRIPTIONS.caseList.columns) {
    const cell = horizontalFrame(`Column / ${column.key}`, column.width, 44, 4, 12);
    cell.primaryAxisAlignItems = column.align === 'right' ? 'MAX' : 'MIN';
    cell.appendChild(makeText('Column label', column.label, 'label', C.text));
    if (column.sorted) cell.appendChild(makeIcon('Sort direction', 'ArrowUpRegular', 16, C.secondary));
    cell.appendChild(makeIcon('Column menu', 'ChevronDownRegular', 16, C.secondary));
    header.appendChild(cell);
  }
  const headerLine = addLine(header, 'Header divider', 1278);
  headerLine.layoutPositioning = 'ABSOLUTE';
  headerLine.x = 0;
  headerLine.y = 43;
  page.appendChild(header);

  const row = figma.createComponent();
  row.name = 'D365 / Table row';
  row.resize(1278, 45);
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'FIXED';
  row.fills = [];

  const checkCell = horizontalFrame('Select column', 46, 45, 0, 12);
  checkCell.appendChild(makeEmptyCheckbox('Row checkbox'));
  row.appendChild(checkCell);

  const reference = horizontalFrame('Reference column', 172, 45, 0, 12);
  reference.appendChild(makeText('Reference', 'MLA/2026/10001', 'body', C.brand, 148));
  row.appendChild(reference);

  const project = horizontalFrame('Application name column', 284, 45, 0, 12);
  const projectText = makeText('Application name', 'Application name', 'body', C.text, 260);
  projectText.textTruncation = 'ENDING';
  projectText.maxLines = 1;
  project.appendChild(projectText);
  row.appendChild(project);

  const assigned = horizontalFrame('Assigned to column', 182, 45, 8, 12);
  const avatarInstance = avatar.createInstance();
  avatarInstance.name = 'Assignee avatar';
  assigned.appendChild(avatarInstance);
  const assigneeText = makeText('Assigned to', 'Sam Evans', 'body', C.text, 118);
  assigneeText.textTruncation = 'ENDING';
  assigneeText.maxLines = 1;
  assigned.appendChild(assigneeText);
  row.appendChild(assigned);

  const statusCell = horizontalFrame('Status column', 255, 45, 0, 12);
  const statusInstance = status.createInstance();
  statusInstance.name = 'Status label';
  statusCell.appendChild(statusInstance);
  row.appendChild(statusCell);

  const age = horizontalFrame('Case age column', 149, 45, 0, 12);
  age.primaryAxisAlignItems = 'MAX';
  age.appendChild(makeText('Case age', '1', 'body', C.text));
  row.appendChild(age);

  const notification = horizontalFrame('Notifications column', 190, 45, 0, 12);
  notification.appendChild(makeText('Notifications', 'Message received', 'body', C.text, 166));
  row.appendChild(notification);
  const rowLine = addLine(row, 'Row divider', 1278);
  rowLine.layoutPositioning = 'ABSOLUTE';
  rowLine.x = 0;
  rowLine.y = 44;
  page.appendChild(row);
  return { header, row };
}

function nextHorizontalPosition(page, minimum = 80, gap = 160) {
  if (!page.children.length) return minimum;
  const furthestRight = page.children.reduce((right, node) => Math.max(right, node.x + node.width), 0);
  return Math.max(minimum, furthestRight + gap);
}

function createComponentLibrary(page, runLabel) {
  page.backgrounds = paint('#F5F5F5');
  const firstNewNode = page.children.length;
  const batchX = nextHorizontalPosition(page);

  const checkbox = createCheckboxComponent(page);
  const avatar = createAvatarComponent(page);
  const status = createStatusComponent(page);
  const divider = createDividerComponent(page);
  const fields = createFieldComponents(page);
  const rows = {
    readOnly: createQuestionRow(page, 'Read only', fields.readOnly, 'locked'),
    readOnlyMultiline: createQuestionRow(page, 'Read only multiline', fields.readOnly, 'locked', true),
    readOnlyRequired: createQuestionRow(page, 'Read only required', fields.readOnly, 'required-locked'),
    readOnlyMultilineRequired: createQuestionRow(page, 'Read only multiline required', fields.readOnly, 'required-locked', true),
    dropdown: createQuestionRow(page, 'Dropdown', fields.dropdown, 'required'),
    textarea: createQuestionRow(page, 'Multiline text', fields.readOnly, 'required', true, true),
    textareaOptional: createQuestionRow(page, 'Multiline text optional', fields.readOnly, 'none', true, true),
    url: createQuestionRow(page, 'URL', fields.url, 'locked'),
    imageLink: createQuestionRow(page, 'Evidence image link', fields.imageLink, 'none'),
  };
  const globalHeader = createGlobalHeader(page, DESCRIPTIONS.shell);
  const leftNav = createLeftNav(page, DESCRIPTIONS.shell);
  const commandList = createCommandBar(page, false);
  const commandSave = createCommandBar(page, true);
  const commandCase = createCaseCommandBar(page);
  const formNotification = createFormNotification(page);
  const taskListRow = createTaskListRow(page);
  const caseHeader = createCaseHeader(page, DESCRIPTIONS.caseSummaryStates[0]);
  const table = createTableComponents(page, checkbox, avatar, status);

  const card = figma.createComponent();
  card.name = 'D365 / Content card';
  card.resize(520, 120);
  applyCard(card);
  page.appendChild(card);

  const created = page.children.slice(firstNewNode);
  let x = batchX;
  let y = 100;
  for (const node of created) {
    node.x = x;
    node.y = y;
    y += node.height + 48;
    if (y > 2800) { y = 100; x += 1740; }
  }
  const batchLabel = makeText(`Generated ${runLabel}`, `Generated ${runLabel}`, 'section', C.text);
  batchLabel.x = batchX;
  batchLabel.y = 48;
  page.appendChild(batchLabel);
  return {
    checkbox,
    avatar,
    status,
    divider,
    fields,
    rows,
    globalHeader,
    leftNav,
    commandList,
    commandSave,
    commandCase,
    formNotification,
    taskListRow,
    caseHeader,
    table,
    card,
  };
}

function addShell(screen, components, save, screenHeight = 1232, commandComponent = null) {
  const background = fixedFrame('Application canvas', 1640, screenHeight, C.canvas);
  screen.appendChild(background);

  const header = components.globalHeader.createInstance();
  header.name = 'Global header';
  header.x = 0;
  header.y = 0;
  screen.appendChild(header);

  const nav = components.leftNav.createInstance();
  nav.name = 'Left navigation';
  nav.resize(248, screenHeight - 48);
  nav.x = 0;
  nav.y = 48;
  screen.appendChild(nav);

  const rail = fixedFrame('Right utility rail', 30, screenHeight - 48, C.nav);
  rail.x = 1610;
  rail.y = 48;
  rail.strokes = paint(C.stroke);
  rail.strokeLeftWeight = 1;
  screen.appendChild(rail);

  const commandSource = commandComponent || (save ? components.commandSave : components.commandList);
  const command = commandSource.createInstance();
  command.name = 'Command bar';
  command.x = 268;
  command.y = 60;
  screen.appendChild(command);
  return { command };
}

function applyRowData(instance, data) {
  setText(instance, 'Reference', data.reference);
  setText(instance, 'Application name', data.project);
  setText(instance, 'Assigned to', data.assignee);
  setText(instance, 'Status', data.status);
  setText(instance, 'Case age', data.age);
  setText(instance, 'Notifications', data.notification);

  const avatar = instance.findOne(item => item.type === 'INSTANCE' && item.name === 'Assignee avatar');
  if (avatar) {
    avatar.visible = Boolean(data.assignee);
    const avatarColor = AVATARS[data.assignee] || C.yellow;
    avatar.fills = paint(avatarColor);
    setText(avatar, 'Avatar initials', initials(data.assignee));
    const avatarLabel = avatar.findOne(item => item.type === 'TEXT' && item.name === 'Avatar initials');
    if (avatarLabel) avatarLabel.fills = paint(readableTextOn(avatarColor));
  }
  const status = instance.findOne(item => item.type === 'INSTANCE' && item.name === 'Status label');
  if (status) {
    const palette = STATUS[data.status] || STATUS['Awaiting allocation'];
    status.fills = paint(palette.background);
    const label = status.findOne(item => item.type === 'TEXT' && item.name === 'Status');
    if (label) label.fills = paint(palette.text);
  }
}

function createCaseListScreen(page, components) {
  const desc = DESCRIPTIONS.caseList;
  const screen = fixedFrame(desc.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, false);

  const card = verticalFrame('Cases card', 1320, 0, 20, C.white);
  card.x = 268;
  card.y = 114;
  applyCard(card);
  const titleRow = horizontalFrame('View heading row', 1280, 40, 6, 0);
  titleRow.fills = [];
  titleRow.appendChild(makeText('Page heading', desc.pageHeading, 'title', C.text));
  titleRow.appendChild(makeIcon('View selector', 'ChevronDownRegular', 16, C.text));
  card.appendChild(titleRow);
  const tableHeader = components.table.header.createInstance();
  tableHeader.name = 'Table headers';
  card.appendChild(tableHeader);
  for (const data of desc.rows) {
    const row = components.table.row.createInstance();
    row.name = `Table row / ${data.reference}`;
    applyRowData(row, data);
    card.appendChild(row);
  }
  screen.appendChild(card);
  page.appendChild(screen);
  return screen;
}

function configureCaseHeader(instance, description) {
  setText(instance, 'Page heading', description.title);
  setText(instance, 'Record type', description.recordType);
  for (const item of description.meta) {
    setText(instance, `Meta value / ${item.label}`, item.value);
  }
}

function createCaseSummaryField(components, field) {
  const row = horizontalFrame(`Case field / ${field.label}`, 484, 32, 0, 0);
  row.appendChild(makeText('Field label', field.label, 'body', C.text, 140));
  const decoration = horizontalFrame('Field decoration', 26, 32, 0, 0);
  decoration.primaryAxisAlignItems = 'MAX';
  decoration.appendChild(makeIcon('Read-only indicator', 'LockClosedRegular', 16, C.secondary));
  row.appendChild(decoration);
  row.appendChild(fixedFrame('Field spacing', 8, 1));
  const value = components.fields.readOnly.createInstance();
  value.name = 'Read-only field';
  value.resize(310, value.height);
  setText(value, 'Field value', field.value);
  const valueText = value.findOne(node => node.type === 'TEXT' && node.name === 'Field value');
  if (valueText) valueText.resize(286, valueText.height);
  row.appendChild(value);
  return row;
}

function createTasksCard(components, tasks) {
  const card = verticalFrame('Tasks card', 280, 0, 16, C.white);
  applyCard(card);
  const heading = horizontalFrame('Tasks heading', 248, 36, 0, 0);
  heading.primaryAxisAlignItems = 'SPACE_BETWEEN';
  heading.appendChild(makeText('Section heading', 'Tasks', 'section', C.text));
  heading.appendChild(makeText('Sort tasks', '⇅', 'section', C.text));
  card.appendChild(heading);
  addLine(card, 'Tasks heading divider', 248);
  for (const task of tasks) {
    const row = components.taskListRow.createInstance();
    row.name = `Task / ${task.name}`;
    setText(row, 'Task name', task.name);
    setText(row, 'Task status', task.status);
    card.appendChild(row);
  }
  const footer = horizontalFrame('Tasks footer', 248, 44, 0, 0);
  footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
  footer.appendChild(makeText('Pagination summary', `1 - ${tasks.length} of ${tasks.length}`, 'body', C.secondary));
  footer.appendChild(makeText('Pagination', '‹  Page 1  ›', 'body', C.secondary));
  card.appendChild(footer);
  return card;
}

function createCaseSummaryScreen(page, components, description) {
  const screen = fixedFrame(description.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, false, 1232, components.commandCase);

  const header = components.caseHeader.createInstance();
  header.name = 'Case record header';
  configureCaseHeader(header, description);
  header.x = 268;
  header.y = 112;
  screen.appendChild(header);

  const summary = verticalFrame('Case summary card', 1028, 20, 20, C.white);
  summary.x = 268;
  summary.y = 280;
  applyCard(summary);
  summary.appendChild(makeText('Section heading', 'Case summary', 'section', C.text));
  const columns = horizontalFrame('Case field columns', 988, 1, 20, 0);
  columns.counterAxisSizingMode = 'AUTO';
  const left = verticalFrame('Case fields / Left column', 484, 16, 0);
  const right = verticalFrame('Case fields / Right column', 484, 16, 0);
  for (const field of description.fields) {
    (field.column === 2 ? right : left).appendChild(createCaseSummaryField(components, field));
  }
  columns.appendChild(left);
  columns.appendChild(right);
  summary.appendChild(columns);
  screen.appendChild(summary);

  const tasks = createTasksCard(components, description.tasks);
  tasks.x = 1308;
  tasks.y = 280;
  screen.appendChild(tasks);
  page.appendChild(screen);
  return screen;
}

function createIndentedValidation(components, message) {
  const row = fixedFrame('Field validation row', 1278, 1);
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'FIXED';
  row.counterAxisSizingMode = 'AUTO';
  row.appendChild(fixedFrame('Validation alignment', 378, 1));
  const validation = components.fields.validation.createInstance();
  validation.name = 'Validation message';
  setText(validation, 'Validation message', message);
  row.appendChild(validation);
  return row;
}

function createSiteCheckSection(components, content, state) {
  const section = verticalFrame(`Section / ${content.heading}`, 1278, 16, 0);
  section.appendChild(makeText('Section heading', content.heading, 'section', C.text, 1278));
  if (content.description) {
    section.appendChild(makeText('Help text', content.description, 'body', C.secondary, 1278));
  }
  const isTextarea = content.type === 'textarea';
  const source = isTextarea ? components.rows.textareaOptional : components.rows.dropdown;
  const row = source.createInstance();
  row.name = `Form question / ${content.question}`;
  configureQuestionRow(row, {
    type: content.type,
    question: content.question,
    value: state[content.key],
  });
  section.appendChild(row);
  const error = (state.errors || []).find(item => item.field === content.key);
  if (error) section.appendChild(createIndentedValidation(components, error.message));
  return section;
}

function createSiteCheckScreen(page, components, state) {
  const screen = fixedFrame(state.frameName, 1640, 1232, C.canvas);
  screen.clipsContent = true;
  const { command } = addShell(screen, components, true);
  const offset = state.notification ? 40 : 0;
  if (state.notification) {
    const notification = components.formNotification.createInstance();
    notification.name = 'Form notification';
    setText(notification, 'Validation message', state.notification);
    notification.x = 268;
    notification.y = 60;
    screen.appendChild(notification);
    command.y += offset;
  }

  const headerCard = verticalFrame('Task header card', 1320, 12, 20, C.white);
  headerCard.x = 268;
  headerCard.y = 125 + offset;
  applyCard(headerCard);
  const headingLine = horizontalFrame('Task title', 1280, 32, 6, 0);
  headingLine.primaryAxisSizingMode = 'AUTO';
  headingLine.appendChild(makeText('Page heading', state.pageHeading, 'title', C.text));
  headingLine.appendChild(makeText('Save state', `- ${state.saveState}`, 'body', C.secondary));
  headerCard.appendChild(headingLine);
  headerCard.appendChild(makeText('Record type', state.recordType, 'body', C.text));
  screen.appendChild(headerCard);

  const body = verticalFrame('Task form card', 1320, 24, 20, C.white);
  body.x = 268;
  body.y = 238 + offset;
  applyCard(body);
  const siteHeading = horizontalFrame('Site coordinates heading', 1278, 32, 10, 0);
  siteHeading.primaryAxisSizingMode = 'AUTO';
  siteHeading.appendChild(makeText('Section heading', DESCRIPTIONS.siteCheckContent.groupHeading, 'section', C.text));
  siteHeading.appendChild(makeIcon('Download icon', 'ArrowDownloadRegular', 16, C.brand));
  siteHeading.appendChild(makeText('Primary action', DESCRIPTIONS.siteCheckContent.downloadLabel, 'body', C.brand));
  body.appendChild(siteHeading);
  DESCRIPTIONS.siteCheckContent.sections.forEach((content, index) => {
    body.appendChild(components.divider.createInstance());
    body.appendChild(createSiteCheckSection(components, content, state));
  });
  screen.appendChild(body);
  page.appendChild(screen);
  return screen;
}

function configureQuestionRow(instance, row) {
  setText(instance, 'Question', row.question);
  setText(instance, 'Field value', row.value);
  if (row.type === 'dropdown') {
    const value = instance.findOne(item => item.type === 'TEXT' && item.name === 'Field value');
    if (value) {
      const color = row.value === '---' ? C.disabled : C.text;
      value.fills = paint(color);
      const fillStyle = fillStyleFor(color);
      if (fillStyle) value.fillStyleId = fillStyle.id;
    }
  }
}

function createFormSection(components, section) {
  const wrapper = verticalFrame(`Section / ${section.heading}`, 1278, 16, 0);
  wrapper.appendChild(makeText('Section heading', section.heading, 'section', C.text));
  for (const row of section.rows) {
    if (row.type === 'divider') {
      const divider = components.divider.createInstance();
      divider.name = 'Conditional section divider';
      wrapper.appendChild(divider);
      continue;
    }
    if (row.type === 'subheading') {
      wrapper.appendChild(makeText('Conditional section heading', row.label, 'label', C.text));
      continue;
    }
    if (row.type === 'help') {
      const help = components.fields.help.createInstance();
      help.name = 'Help link';
      setText(help, 'Help text', row.label);
      wrapper.appendChild(help);
      if (row.spaceAfter) {
        wrapper.appendChild(fixedFrame('Help spacing', 1, row.spaceAfter));
      }
      continue;
    }
    const source = row.type === 'dropdown'
      ? components.rows.dropdown
      : row.type === 'textarea'
        ? components.rows.textarea
      : row.type === 'readonly-multiline'
        ? components.rows.readOnlyMultiline
        : row.type === 'url'
          ? components.rows.url
          : components.rows.readOnly;
    const instance = source.createInstance();
    instance.name = `Form question / ${row.question}`;
    configureQuestionRow(instance, row);
    wrapper.appendChild(instance);
  }
  return wrapper;
}

function createPublicRegisterScreen(page, components, desc = DESCRIPTIONS.publicRegister) {
  const screenHeight = desc.frameHeight || 1232;
  const screen = fixedFrame(desc.frameName, 1640, screenHeight, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, true, screenHeight);

  const headerCard = verticalFrame('Task header card', 1320, 12, 20, C.white);
  headerCard.x = 268;
  headerCard.y = 125;
  applyCard(headerCard);
  const headingLine = horizontalFrame('Task title', 1280, 32, 6, 0);
  headingLine.primaryAxisSizingMode = 'AUTO';
  headingLine.fills = [];
  headingLine.appendChild(makeText('Page heading', desc.pageHeading, 'title', C.text));
  headingLine.appendChild(makeText('Save state', `- ${desc.saveState}`, 'body', C.secondary));
  headerCard.appendChild(headingLine);
  headerCard.appendChild(makeText('Record type', desc.recordType, 'body', C.text));
  screen.appendChild(headerCard);

  const body = verticalFrame('Task form card', 1320, 24, 20, C.white);
  body.x = 268;
  body.y = 238;
  applyCard(body);
  desc.sections.forEach((section, index) => {
    if (index > 0) {
      const divider = components.divider.createInstance();
      divider.name = 'Section divider';
      body.appendChild(divider);
    }
    body.appendChild(createFormSection(components, section));
  });
  const finalDivider = components.divider.createInstance();
  finalDivider.name = 'Section divider';
  body.appendChild(finalDivider);
  body.appendChild(makeText('Help text', desc.completionNote, 'body', C.text, 1278));
  const completion = horizontalFrame('Completion field', 1278, 32, 8, 0);
  completion.fills = [];
  const checkbox = components.checkbox.createInstance();
  checkbox.name = 'Checkbox';
  if (!desc.completed) {
    const mark = checkbox.findOne(item => item.type === 'TEXT');
    const box = checkbox.findOne(item => item.type === 'RECTANGLE');
    if (mark) mark.visible = false;
    if (box) { box.fills = []; box.strokes = paint(C.secondary); box.strokeWeight = 1; }
  }
  completion.appendChild(checkbox);
  completion.appendChild(makeText('Question', desc.completionLabel, 'body', C.text));
  body.appendChild(completion);
  screen.appendChild(body);

  page.appendChild(screen);
  return screen;
}

function createEvidenceReviewRow(components, type, question, value) {
  const source = type === 'dropdown'
    ? components.rows.dropdown
    : type === 'textarea'
      ? components.rows.textarea
      : type === 'locked-choice'
        ? components.rows.readOnlyRequired
        : type === 'locked-textarea'
          ? components.rows.readOnlyMultilineRequired
      : type === 'image-link'
        ? components.rows.imageLink
        : components.rows.readOnly;
  const row = source.createInstance();
  row.name = `Form question / ${question}`;
  configureQuestionRow(row, { type, question, value });
  if (type === 'image-link') {
    const field = row.findOne(item => item.type === 'INSTANCE' && item.name === 'Read-only field');
    if (field) field.name = 'Evidence image link field';
  }
  return row;
}

function createEvidenceLocation(components, number, location, review, options = {}) {
  const group = verticalFrame(`Location ${number}`, 1278, 16, 0);
  group.appendChild(makeText('Location heading', `Location ${number}`, 'label', C.text, 1278));
  group.appendChild(createEvidenceReviewRow(components, 'readonly', 'Location name', location.name));
  group.appendChild(createEvidenceReviewRow(components, 'readonly', 'Date displayed', location.date));
  group.appendChild(createEvidenceReviewRow(
    components,
    'image-link',
    'Close-up photograph of the notice',
    location.closeUpLabel,
  ));
  group.appendChild(createEvidenceReviewRow(
    components,
    'image-link',
    'Photograph showing the notice in its surroundings',
    location.surroundingsLabel,
  ));
  group.appendChild(createEvidenceReviewRow(
    components,
    options.reviewLocked ? 'locked-choice' : 'dropdown',
    options.acceptanceWording
      ? 'Do you accept the photographs for this location?'
      : 'What is your decision on the photographs for this location?',
    review.decision,
  ));
  if (review.decision === 'Reject') {
    group.appendChild(createEvidenceReviewRow(
      components,
      options.reviewLocked ? 'locked-textarea' : 'textarea',
      'Why are you rejecting the photographs for this location? Explain what is wrong and what the applicant needs to provide. Your comments will be sent to the applicant.',
      review.rejectionComments,
    ));
  }
  if (options.acceptanceWording && review.decision === 'No') {
    group.appendChild(createEvidenceReviewRow(
      components,
      options.reviewLocked ? 'locked-textarea' : 'textarea',
      'What is wrong with the photographs for this location?\nSay which photograph is affected - the close-up, the one showing the notice in its surroundings or both. Tell the applicant what they need to provide instead. This will be sent to the applicant, so keep it factual and clear.',
      review.rejectionComments,
    ));
  }
  if (options.replacementEvidence) {
    group.appendChild(makeText(
      'Conditional section heading',
      options.replacementEvidence.heading,
      'label',
      C.text,
      1278,
    ));
    group.appendChild(makeText(
      'Help text',
      options.replacementEvidence.intro,
      'body',
      C.secondary,
      1278,
    ));
    group.appendChild(createEvidenceReviewRow(
      components,
      'image-link',
      options.replacementEvidence.closeUpQuestion,
      options.replacementEvidence.closeUpLabel,
    ));
    group.appendChild(createEvidenceReviewRow(
      components,
      'image-link',
      options.replacementEvidence.surroundingsQuestion,
      options.replacementEvidence.surroundingsLabel,
    ));
    if (options.replacementReview) {
      group.appendChild(createEvidenceReviewRow(
        components,
        'dropdown',
        'Do you accept the resubmitted photographs for this location?',
        options.replacementReview.decision,
      ));
      if (options.replacementReview.decision === 'No') {
        group.appendChild(createEvidenceReviewRow(
          components,
          'textarea',
          'What is wrong with the photographs for this location?\nSay which photograph is affected - the close-up, the one showing the notice in its surroundings or both. Tell the applicant what they need to provide instead. This will be sent to the applicant, so keep it factual and clear.',
          options.replacementReview.rejectionComments,
        ));
      }
    }
  }
  return group;
}

function createPublicNoticeEvidenceReviewScreen(page, components, state) {
  const description = DESCRIPTIONS.publicNoticeEvidenceReview;
  const screenHeight = state.frameHeight || 1480;
  const screen = fixedFrame(state.frameName, 1640, screenHeight, C.canvas);
  screen.clipsContent = true;
  addShell(screen, components, true, screenHeight);

  const headerCard = verticalFrame('Task header card', 1320, 12, 20, C.white);
  headerCard.x = 268;
  headerCard.y = 125;
  applyCard(headerCard);
  const headingLine = horizontalFrame('Task title', 1280, 32, 6, 0);
  headingLine.primaryAxisSizingMode = 'AUTO';
  headingLine.appendChild(makeText('Page heading', description.pageHeading, 'title', C.text));
  headingLine.appendChild(makeText('Save state', `- ${state.saveState}`, 'body', C.secondary));
  headerCard.appendChild(headingLine);
  headerCard.appendChild(makeText('Record type', description.recordType, 'body', C.text));
  screen.appendChild(headerCard);

  const body = verticalFrame('Task form card', 1320, 24, 20, C.white);
  body.x = 268;
  body.y = 238;
  applyCard(body);
  const introduction = verticalFrame('Evidence introduction', 1278, 8, 0);
  introduction.appendChild(makeText('Section heading', description.sectionHeading, 'section', C.text, 1278));
  for (const line of state.introLines || [description.intro]) {
    introduction.appendChild(makeText('Help text', line, 'body', C.secondary, 1278));
  }
  body.appendChild(introduction);

  description.locations.forEach((location, index) => {
    const divider = components.divider.createInstance();
    divider.name = 'Location divider';
    body.appendChild(divider);
    body.appendChild(createEvidenceLocation(components, index + 1, location, state.reviews[index], {
      reviewLocked: state.reviewLocked,
      acceptanceWording: state.acceptanceWording,
      replacementEvidence: state.replacementEvidence?.locationIndex === index
        ? state.replacementEvidence
        : null,
      replacementReview: state.replacementEvidence?.locationIndex === index
        ? state.replacementReview
        : null,
    }));
  });

  const finalDivider = components.divider.createInstance();
  finalDivider.name = 'Section divider';
  body.appendChild(finalDivider);
  const completion = horizontalFrame('Completion field', 1278, 32, 8, 0);
  const checkbox = components.checkbox.createInstance();
  checkbox.name = 'Checkbox';
  if (!state.completed) {
    const mark = checkbox.findOne(item => item.type === 'TEXT');
    const box = checkbox.findOne(item => item.type === 'RECTANGLE');
    if (mark) mark.visible = false;
    if (box) { box.fills = []; box.strokes = paint(C.secondary); box.strokeWeight = 1; }
  }
  completion.appendChild(checkbox);
  completion.appendChild(makeText('Question', description.completionLabel, 'body', C.text));
  body.appendChild(completion);
  screen.appendChild(body);
  page.appendChild(screen);
  return screen;
}

function nextRunNumber() {
  const pattern = /Run (\d+)/;
  let highest = 0;
  for (const page of figma.root.children) {
    const pageMatch = page.name.match(pattern);
    if (pageMatch) highest = Math.max(highest, Number(pageMatch[1]));
    for (const child of page.children) {
      const childMatch = child.name.match(pattern);
      if (childMatch) highest = Math.max(highest, Number(childMatch[1]));
    }
  }
  return highest + 1;
}

function getOrCreatePage(name) {
  let page = figma.root.children.find(item => item.name === name);
  if (!page) page = figma.createPage();
  page.name = name;
  return page;
}

function getOrCreateScreensPage() {
  const name = '01 - MAS D365 Screens';
  let page = figma.root.children.find(item => item.name === name);
  if (page) return page;

  page = figma.root.children.find(item => item.name === '01 · Screens');
  if (!page) page = figma.createPage();
  page.name = name;
  return page;
}

const SCREEN_GROUPS = [
  {
    id: 'case-list',
    label: 'Marine licence cases',
    screens: [
      { id: 'case-list', label: DESCRIPTIONS.caseList.frameName },
    ],
  },
  {
    id: 'public-register',
    label: 'Public register states',
    screens: [
      { id: 'public-register-initial', label: DESCRIPTIONS.publicRegister.frameName },
      ...DESCRIPTIONS.publicRegisterVariations.map((description, index) => ({
        id: `public-register-variation-${index}`,
        label: description.frameName,
      })),
    ],
  },
  {
    id: 'assessment-journey',
    label: 'First assessment journey',
    screens: [
      { id: 'case-summary-initial', label: DESCRIPTIONS.caseSummaryStates[0].frameName },
      ...DESCRIPTIONS.siteCheckStates.map((state, index) => ({
        id: `site-check-${index}`,
        label: state.frameName,
      })),
      { id: 'case-summary-unlocked', label: DESCRIPTIONS.caseSummaryStates[1].frameName },
    ],
  },
  {
    id: 'public-notice-evidence',
    label: 'Review public notice evidence',
    screens: DESCRIPTIONS.publicNoticeEvidenceReview.states.map((state, index) => ({
      id: `public-notice-evidence-${index}`,
      label: state.frameName,
    })),
  },
];

const ALL_SCREEN_IDS = SCREEN_GROUPS.flatMap(group => group.screens.map(screen => screen.id));

function renderScreenById(id, page, components) {
  if (id === 'case-list') return createCaseListScreen(page, components);
  if (id === 'public-register-initial') {
    return createPublicRegisterScreen(page, components, DESCRIPTIONS.publicRegister);
  }
  if (id.startsWith('public-register-variation-')) {
    const index = Number(id.slice('public-register-variation-'.length));
    const description = DESCRIPTIONS.publicRegisterVariations[index];
    if (description) return createPublicRegisterScreen(page, components, description);
  }
  if (id === 'case-summary-initial') {
    return createCaseSummaryScreen(page, components, DESCRIPTIONS.caseSummaryStates[0]);
  }
  if (id.startsWith('site-check-')) {
    const index = Number(id.slice('site-check-'.length));
    const state = DESCRIPTIONS.siteCheckStates[index];
    if (state) return createSiteCheckScreen(page, components, state);
  }
  if (id === 'case-summary-unlocked') {
    return createCaseSummaryScreen(page, components, DESCRIPTIONS.caseSummaryStates[1]);
  }
  if (id.startsWith('public-notice-evidence-')) {
    const index = Number(id.slice('public-notice-evidence-'.length));
    const state = DESCRIPTIONS.publicNoticeEvidenceReview.states[index];
    if (state) return createPublicNoticeEvidenceReviewScreen(page, components, state);
  }
  throw new Error(`Unknown screen selection: ${id}`);
}

async function generateScreens(screenIds) {
  const uniqueIds = [...new Set(screenIds)];
  if (!uniqueIds.length) throw new Error('Select at least one screen to generate.');
  const unknownId = uniqueIds.find(id => !ALL_SCREEN_IDS.includes(id));
  if (unknownId) throw new Error(`Unknown screen selection: ${unknownId}`);

  const runLabel = `Run ${String(nextRunNumber()).padStart(2, '0')}`;
  fonts = await loadPreferredFonts();
  styles = ensureStyles(runLabel);

  const componentsPage = getOrCreatePage('00 · D365 components');
  figma.currentPage = componentsPage;
  const components = createComponentLibrary(componentsPage, runLabel);
  const screensPage = getOrCreateScreensPage();
  figma.currentPage = screensPage;
  screensPage.backgrounds = paint('#EDEBE9');
  const batchX = nextHorizontalPosition(screensPage);
  const batchLabel = makeText(`Generated ${runLabel}`, `Generated ${runLabel}`, 'section', C.text);
  batchLabel.x = batchX;
  batchLabel.y = 32;
  screensPage.appendChild(batchLabel);

  const generatedScreens = [];
  let screenX = batchX;
  const appendScreen = screen => {
    screen.x = screenX;
    screen.y = 80;
    screenX += 1720;
    generatedScreens.push(screen);
  };
  uniqueIds.forEach(id => appendScreen(renderScreenById(id, screensPage, components)));

  figma.currentPage = screensPage;
  figma.viewport.scrollAndZoomIntoView(generatedScreens);
  figma.notify(`Added ${runLabel}: ${generatedScreens.length} editable ${generatedScreens.length === 1 ? 'screen' : 'screens'} to 01 - MAS D365 Screens. Existing layers were left unchanged.`);
  figma.closePlugin();
}

function reportFailure(error, notifyUi = false) {
  console.error(error);
  try {
    const page = getOrCreateScreensPage();
    figma.currentPage = page;
    const marker = verticalFrame('MAS D365 Screen Builder error', 760, 12, 20, C.errorBackground);
    marker.x = nextHorizontalPosition(page);
    marker.y = 80;
    marker.strokes = paint(C.red);
    marker.strokeWeight = 1;
    marker.appendChild(makeText('Error heading', 'MAS D365 Screen Builder failed', 'section', C.red));
    marker.appendChild(makeText('Error message', error.message || String(error), 'body', C.text, 720));
    page.appendChild(marker);
    figma.viewport.scrollAndZoomIntoView([marker]);
  } catch (markerError) {
    console.error(markerError);
  }
  if (notifyUi && figma.ui) {
    figma.ui.postMessage({ type: 'error', message: error.message || String(error) });
  }
  figma.notify(`MAS D365 Screen Builder failed: ${error.message}`, { error: true, timeout: 30000 });
  if (!notifyUi) figma.closePlugin();
}

function showPicker() {
  figma.showUI(__html__, { width: 420, height: 640, themeColors: true });
  figma.ui.postMessage({ type: 'catalog', groups: SCREEN_GROUPS });
  figma.ui.onmessage = async message => {
    if (message?.type === 'cancel') {
      figma.closePlugin();
      return;
    }
    if (message?.type !== 'generate') return;
    try {
      await generateScreens(Array.isArray(message.screenIds) ? message.screenIds : []);
    } catch (error) {
      reportFailure(error, true);
    }
  };
}

if (figma.command === 'choose-screens') {
  showPicker();
} else {
  generateScreens(ALL_SCREEN_IDS).catch(error => reportFailure(error));
}
