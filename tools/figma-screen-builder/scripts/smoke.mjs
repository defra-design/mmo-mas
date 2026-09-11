import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

let nextId = 1;
const removedNodeIds = [];

class MockNode {
  constructor(type) {
    this.id = `mock-${nextId++}`;
    this.type = type;
    this.name = type;
    this.children = [];
    this.parent = null;
    this.width = 100;
    this.height = 100;
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.fills = [];
    this.strokes = [];
    this.effects = [];
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  appendChild(child) {
    if (child.parent?.children) {
      child.parent.children = child.parent.children.filter(item => item !== child);
    }
    child.parent = this;
    this.children.push(child);
    return child;
  }

  findOne(predicate) {
    for (const child of this.children) {
      if (predicate(child)) return child;
      const nested = child.findOne?.(predicate);
      if (nested) return nested;
    }
    return null;
  }

  findAll(predicate) {
    const found = [];
    for (const child of this.children) {
      if (predicate(child)) found.push(child);
      found.push(...(child.findAll?.(predicate) || []));
    }
    return found;
  }

  remove() {
    removedNodeIds.push(this.id);
    if (this.parent?.children) {
      this.parent.children = this.parent.children.filter(item => item !== this);
    }
    this.parent = null;
  }

  clone() {
    const copy = new MockNode(this.type);
    for (const [key, value] of Object.entries(this)) {
      if (['id', 'children', 'parent', 'mainComponent'].includes(key)) continue;
      copy[key] = structuredClone(value);
    }
    for (const child of this.children) copy.appendChild(child.clone());
    return copy;
  }

  createInstance() {
    const instance = this.clone();
    instance.type = 'INSTANCE';
    instance.mainComponent = this;
    return instance;
  }

  rescale(factor) {
    const scale = node => {
      node.width *= factor;
      node.height *= factor;
      node.x *= factor;
      node.y *= factor;
      for (const child of node.children) scale(child);
    };
    scale(this);
  }
}

const root = new MockNode('DOCUMENT');
const textStyles = [];
const paintStyles = [];
const notifications = [];
const uiMessages = [];
let shownUi = null;
let finish;
const done = new Promise(resolve => { finish = resolve; });

const figma = {
  command: process.env.FIGMA_COMMAND || 'generate-all',
  root,
  currentPage: null,
  viewport: { scrollAndZoomIntoView() {} },
  ui: {
    onmessage: null,
    postMessage(message) { uiMessages.push(message); },
  },
  showUI(html, options) { shownUi = { html, options }; },
  async loadFontAsync() {},
  getLocalTextStyles: () => textStyles,
  getLocalPaintStyles: () => paintStyles,
  createTextStyle() {
    const style = { id: `text-style-${nextId++}`, name: '' };
    textStyles.push(style);
    return style;
  },
  createPaintStyle() {
    const style = { id: `paint-style-${nextId++}`, name: '', paints: [] };
    paintStyles.push(style);
    return style;
  },
  createPage() {
    const page = new MockNode('PAGE');
    root.appendChild(page);
    if (!this.currentPage) this.currentPage = page;
    return page;
  },
  createSceneNode(type) {
    const node = new MockNode(type);
    this.currentPage?.appendChild(node);
    return node;
  },
  createFrame() { return this.createSceneNode('FRAME'); },
  createComponent() { return this.createSceneNode('COMPONENT'); },
  createRectangle() { return this.createSceneNode('RECTANGLE'); },
  createNodeFromSvg() {
    const frame = this.createSceneNode('FRAME');
    frame.appendChild(new MockNode('VECTOR'));
    return frame;
  },
  createText() {
    const text = this.createSceneNode('TEXT');
    text.characters = '';
    return text;
  },
  notify(message) { notifications.push(String(message)); },
  closePlugin() { finish(); },
};

const retainedComponentsPage = figma.createPage();
retainedComponentsPage.name = '00 · D365 components';
const retainedComponentNote = new MockNode('TEXT');
retainedComponentNote.name = 'User component note';
retainedComponentsPage.appendChild(retainedComponentNote);

const retainedScreensPage = figma.createPage();
retainedScreensPage.name = '01 · Screens';
const sameNameCopy = new MockNode('FRAME');
sameNameCopy.name = '01 · Marine licence cases';
retainedScreensPage.appendChild(sameNameCopy);
const retainedCopy = new MockNode('FRAME');
retainedCopy.name = '01 · Marine licence cases copy';
retainedScreensPage.appendChild(retainedCopy);
const retainedReference = new MockNode('RECTANGLE');
retainedReference.name = 'Pasted reference screenshot';
retainedScreensPage.appendChild(retainedReference);

const retainedWorkflowPage = figma.createPage();
retainedWorkflowPage.name = '02 · Workflow';
const retainedWorkflowNote = new MockNode('TEXT');
retainedWorkflowNote.name = 'User workflow note';
retainedWorkflowPage.appendChild(retainedWorkflowNote);

for (const name of ['00 · D365 components · Run 01', '01 · Screens · Run 01', '02 · Workflow · Run 01']) {
  const priorRunPage = figma.createPage();
  priorRunPage.name = name;
  const priorRunContent = new MockNode('FRAME');
  priorRunContent.name = 'Prior generated content';
  priorRunPage.appendChild(priorRunContent);
}
const pageCountBeforeGeneration = root.children.length;

const code = await readFile(new URL('../code.js', import.meta.url), 'utf8');
vm.runInNewContext(code, {
  figma,
  console,
  structuredClone,
  setTimeout,
  clearTimeout,
  __html__: '<html>picker</html>',
});
if (figma.command === 'choose-screens') {
  if (!shownUi || shownUi.options?.themeColors !== true) throw new Error('Picker UI was not opened correctly');
  const catalog = uiMessages.find(message => message.type === 'catalog');
  if (catalog?.groups?.flatMap(group => group.screens).length !== 10) {
    throw new Error('Picker did not receive the ten-screen catalog');
  }
  await figma.ui.onmessage({
    type: 'generate',
    screenIds: catalog.groups.flatMap(group => group.screens.map(screen => screen.id)),
  });
}
await Promise.race([
  done,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Plugin smoke test timed out')), 3000)),
]);

const failure = notifications.find(message => message.includes('failed:'));
if (failure) throw new Error(failure);
const componentsPage = root.children.find(page => page.name === '00 · D365 components');
const screensPage = root.children.find(page => page.name === '01 - MAS D365 Screens');
const workflowPage = root.children.find(page => page.name === '02 · Workflow');
if (!componentsPage || !screensPage || !workflowPage) throw new Error('Expected working pages were not found');
if (root.children.length !== pageCountBeforeGeneration) throw new Error('Generation created extra pages');
if (root.children.some(page => page.name === '01 · Screens')) throw new Error('Legacy screen page was not renamed');
if (componentsPage.children.filter(node => node.type === 'COMPONENT').length < 20) {
  throw new Error('Reusable component library is incomplete');
}
const canonicalScreenNames = new Set([
  '01 · Marine licence cases',
  '02 · Public register task · Initial state',
  '03 · Public register task · Conditional fields shown',
  '04 · Case summary · Site check to do',
  '05 · Site check · Initial state',
  '06 · Site check · Validation errors',
  '07 · Site check · Completed',
  '08 · Case summary · Tasks unlocked',
  '09 · MLA/2026/10014 · Review public notice evidence · Default',
  '10 · MLA/2026/10014 · Review public notice evidence · Mixed decisions',
]);
if (screensPage.children.filter(node => canonicalScreenNames.has(node.name)).length !== 11) {
  throw new Error('Expected ten generated screen frames plus the retained same-name copy');
}
if (!screensPage.children.some(node => node.name === 'Generated Run 02')) throw new Error('Missing screen run label');
if (workflowPage.children.length !== 1 || workflowPage.children[0] !== retainedWorkflowNote) {
  throw new Error('Generation changed the retained workflow page');
}
if (!retainedScreensPage.children.includes(sameNameCopy)
  || !retainedScreensPage.children.includes(retainedCopy)
  || !retainedScreensPage.children.includes(retainedReference)
  || !retainedComponentsPage.children.includes(retainedComponentNote)
  || !retainedWorkflowPage.children.includes(retainedWorkflowNote)) {
  throw new Error('Generation changed an existing page');
}
if (removedNodeIds.length) throw new Error('Generation removed an existing node');
const contentNames = new Set(screensPage.findAll(node => node.type === 'TEXT').map(node => node.name));
for (const name of ['Page heading', 'Section heading', 'Question', 'Help text', 'Field value', 'Primary action']) {
  if (!contentNames.has(name)) throw new Error(`Missing editable content layer: ${name}`);
}
const conditionalScreen = screensPage.children.find(
  node => node.name === '03 · Public register task · Conditional fields shown',
);
const selectedChoice = conditionalScreen?.findOne(
  node => node.type === 'TEXT' && node.characters === 'Commercial or industrial confidentiality',
);
const selectedChoiceColor = selectedChoice?.fills[0]?.color;
const primaryText = { r: 50 / 255, g: 49 / 255, b: 48 / 255 };
if (
  !selectedChoiceColor ||
  Math.abs(selectedChoiceColor.r - primaryText.r) > 0.001 ||
  Math.abs(selectedChoiceColor.g - primaryText.g) > 0.001 ||
  Math.abs(selectedChoiceColor.b - primaryText.b) > 0.001
) {
  throw new Error('Selected dropdown value does not use primary text colour');
}
if (conditionalScreen.findAll(node => node.name === 'Resize handle').length !== 3) {
  throw new Error('Conditional multiline fields are missing resize handles');
}
const questionRow = componentsPage.children.find(
  node => node.type === 'COMPONENT' && node.name === 'D365 / Form question row / Multiline text',
);
const questionText = questionRow?.findOne(node => node.type === 'TEXT' && node.name === 'Question');
const editableValue = questionRow?.findOne(node => node.type === 'TEXT' && node.name === 'Field value');
const resizeHandle = questionRow?.findOne(node => node.name === 'Resize handle');
if (
  !questionRow || questionRow.counterAxisSizingMode !== 'AUTO' ||
  questionText?.textAutoResize !== 'HEIGHT' || editableValue?.textAutoResize !== 'HEIGHT'
) {
  throw new Error('Editable question rows are not configured to grow with longer content');
}
if (resizeHandle?.constraints?.horizontal !== 'MAX' || resizeHandle?.constraints?.vertical !== 'MAX') {
  throw new Error('Textarea resize handle is not anchored to the lower-right corner');
}
const dropdownComponent = componentsPage.children.find(
  node => node.type === 'COMPONENT' && node.name === 'D365 / Dropdown field',
);
const dropdownValue = dropdownComponent?.findOne(node => node.type === 'TEXT' && node.name === 'Field value');
if (dropdownValue?.textTruncation !== 'ENDING' || dropdownValue?.maxLines !== 1) {
  throw new Error('Long selected dropdown values are not safely constrained');
}
const helpComponent = componentsPage.children.find(
  node => node.type === 'COMPONENT' && node.name === 'D365 / Help link',
);
const helpText = helpComponent?.findOne(node => node.type === 'TEXT' && node.name === 'Help text');
if (helpComponent?.counterAxisSizingMode !== 'AUTO' || helpText?.textAutoResize !== 'HEIGHT') {
  throw new Error('Help links are not configured to wrap and grow vertically');
}
const validationComponent = componentsPage.children.find(
  node => node.type === 'COMPONENT' && node.name === 'D365 / Validation message',
);
const validationText = validationComponent?.findOne(
  node => node.type === 'TEXT' && node.name === 'Validation message',
);
if (!validationComponent || validationText?.textAutoResize !== 'HEIGHT') {
  throw new Error('Reusable validation messages are missing or cannot wrap');
}
const initialSummary = screensPage.children.find(
  node => node.name === '04 · Case summary · Site check to do',
);
const unlockedSummary = screensPage.children.find(
  node => node.name === '08 · Case summary · Tasks unlocked',
);
const initialStatuses = initialSummary?.findAll(
  node => node.type === 'TEXT' && node.name === 'Task status',
).map(node => node.characters);
const unlockedStatuses = unlockedSummary?.findAll(
  node => node.type === 'TEXT' && node.name === 'Task status',
).map(node => node.characters);
if (
  initialStatuses?.filter(value => value === 'Cannot start yet').length !== 5 ||
  initialStatuses?.filter(value => value === 'To do').length !== 1
) {
  throw new Error('Initial case summary does not show the correct gated task states');
}
if (
  unlockedStatuses?.filter(value => value === 'To do').length !== 5 ||
  unlockedStatuses?.filter(value => value === 'Done').length !== 1
) {
  throw new Error('Unlocked case summary does not show the Site check transition');
}
const validationScreen = screensPage.children.find(
  node => node.name === '06 · Site check · Validation errors',
);
const validationMessages = validationScreen?.findAll(
  node => node.type === 'TEXT' && node.name === 'Validation message',
).map(node => node.characters);
if (
  validationScreen?.findAll(node => node.name === 'Form notification').length !== 1 ||
  !validationMessages?.includes('Coordinates and shape: Required fields must be filled in.') ||
  !validationMessages?.includes('WFD assessment area: Required fields must be filled in.')
) {
  throw new Error('Site check validation state is incomplete');
}

const defaultEvidenceReview = screensPage.children.find(
  node => node.name === '09 · MLA/2026/10014 · Review public notice evidence · Default',
);
const mixedEvidenceReview = screensPage.children.find(
  node => node.name === '10 · MLA/2026/10014 · Review public notice evidence · Mixed decisions',
);
const defaultEvidenceValues = defaultEvidenceReview?.findAll(
  node => node.type === 'TEXT' && node.name === 'Field value',
).map(node => node.characters);
const mixedEvidenceValues = mixedEvidenceReview?.findAll(
  node => node.type === 'TEXT' && node.name === 'Field value',
).map(node => node.characters);
if (defaultEvidenceValues?.filter(value => value === '---').length !== 3) {
  throw new Error('Default public notice evidence review does not show three empty decisions');
}
if (
  mixedEvidenceValues?.filter(value => value === 'Reject').length !== 1 ||
  mixedEvidenceValues?.filter(value => value === 'Accept').length !== 2 ||
  !mixedEvidenceValues?.some(value => value.includes('Provide a wider photograph'))
) {
  throw new Error('Mixed public notice evidence review does not show one rejection and two acceptances');
}
if (
  defaultEvidenceReview?.findOne(node => node.name === 'Checkbox mark')?.visible !== false ||
  mixedEvidenceReview?.findOne(node => node.name === 'Checkbox mark')?.visible === false
) {
  throw new Error('Public notice evidence completion states are incorrect');
}

console.log(`${figma.command} smoke test appended Run 02 without changing existing layers`);
