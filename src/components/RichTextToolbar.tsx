import type { ReactElement } from 'react';
import {
  makeStyles, mergeClasses, shorthands, Toolbar, ToolbarButton, Menu, MenuButton,
  MenuItem, MenuList, MenuPopover, MenuTrigger,
} from '@fluentui/react-components';
import {
  ChevronUpRegular, LinkDismissRegular, MoreHorizontalRegular,
  TextAlignCenterRegular, TextAlignJustifyRegular, TextAlignLeftRegular,
  TextAlignRightRegular, TextBoldRegular, TextBulletListRegular,
  TextClearFormattingRegular, TextIndentDecreaseLtrRegular,
  TextIndentIncreaseLtrRegular, TextItalicRegular, TextNumberListLtrRegular,
  TextStrikethroughRegular, TextSubscriptRegular, TextSuperscriptRegular,
  TextUnderlineRegular,
} from '@fluentui/react-icons';
import RichTextColorPicker from './RichTextColorPicker';
import RichTextLinkPicker from './RichTextLinkPicker';

export type EditorFormatState = {
  block: string;
  active: Record<string, boolean>;
  alignment: string;
  hasLink: boolean;
  canOutdent: boolean;
};

const useStyles = makeStyles({
  toolbar: {
    display: 'flex', alignItems: 'center', flexWrap: 'nowrap', width: '100%',
    minHeight: '42px', gap: '1px', backgroundColor: '#f5f5f5',
    ...shorthands.padding('3px', '6px'),
  },
  secondRow: { borderTop: '1px solid #d3d3d3' },
  button: {
    width: '30px', minWidth: '30px', height: '32px', fontSize: '18px',
    color: '#333', borderRadius: 0, ...shorthands.padding('0'),
    ...shorthands.border('1px', 'solid', 'transparent'),
    ':hover': { backgroundColor: '#fff' },
  },
  selected: {
    backgroundColor: '#fff',
    ...shorthands.border('1px', 'solid', '#323130'),
    ':hover': { backgroundColor: '#fff' },
  },
  divider: { width: '1px', height: '27px', backgroundColor: '#a9a9a9', marginLeft: '4px', marginRight: '4px' },
  formatButton: { width: '96px', minWidth: '96px', height: '32px', justifyContent: 'space-between', borderRadius: 0 },
  fontSizeButton: { width: '30px', minWidth: '30px', height: '32px', borderRadius: 0 },
  spacer: { flexGrow: 1 },
});

type Props = {
  expanded: boolean;
  onToggleExpanded: () => void;
  format: EditorFormatState;
  run: (command: string, value?: string) => void;
  rememberSelection: () => void;
  getSelectedText: () => string;
  insertLink: (text: string, url: string) => void;
};

export default function RichTextToolbar({
  expanded, onToggleExpanded, format, run, rememberSelection, getSelectedText, insertLink,
}: Props) {
  const styles = useStyles();

  const divider = () => <span className={styles.divider} aria-hidden="true" />;
  const tool = (label: string, icon: ReactElement, command: string, options?: { active?: boolean; disabled?: boolean }) => (
    <ToolbarButton
      key={label} className={mergeClasses(styles.button, options?.active && styles.selected)}
      appearance="subtle" icon={icon} aria-label={label} title={label}
      aria-pressed={options?.active} disabled={options?.disabled}
      onMouseDown={event => event.preventDefault()}
      onClick={() => run(command)}
    />
  );
  const formatMenu = (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton className={styles.formatButton} appearance="subtle" onMouseDown={rememberSelection}>
          {format.block === 'h1' ? 'Heading 1' : format.block === 'h2' ? 'Heading 2' : 'Normal'}
        </MenuButton>
      </MenuTrigger>
      <MenuPopover><MenuList>
        <MenuItem onClick={() => run('formatBlock', 'p')}>Normal</MenuItem>
        <MenuItem onClick={() => run('formatBlock', 'h1')}>Heading 1</MenuItem>
        <MenuItem onClick={() => run('formatBlock', 'h2')}>Heading 2</MenuItem>
      </MenuList></MenuPopover>
    </Menu>
  );
  const links = <>
    <RichTextLinkPicker
      getSelectedText={getSelectedText} rememberSelection={rememberSelection} onInsert={insertLink}
    />
    {tool('Remove link', <LinkDismissRegular />, 'unlink', { disabled: !format.hasLink })}
  </>;
  const lists = <>
    {tool('Bulleted list', <TextBulletListRegular />, 'insertUnorderedList', { active: format.active.insertUnorderedList })}
    {tool('Numbered list', <TextNumberListLtrRegular />, 'insertOrderedList', { active: format.active.insertOrderedList })}
  </>;

  return <>
    <Toolbar className={styles.toolbar} aria-label="Text formatting">
      {formatMenu}{divider()}
      {tool('Bold', <TextBoldRegular />, 'bold', { active: format.active.bold })}
      {tool('Italic', <TextItalicRegular />, 'italic', { active: format.active.italic })}
      {tool('Underline', <TextUnderlineRegular />, 'underline', { active: format.active.underline })}
      {expanded && <>
        {tool('Strikethrough', <TextStrikethroughRegular />, 'strikeThrough', { active: format.active.strikeThrough })}
        {tool('Superscript', <TextSuperscriptRegular />, 'superscript', { active: format.active.superscript })}
        {tool('Subscript', <TextSubscriptRegular />, 'subscript', { active: format.active.subscript })}
      </>}
      {divider()}
      {expanded && <>
        <RichTextColorPicker kind="text" rememberSelection={rememberSelection} onSelect={color => run('foreColor', color)} />
        <RichTextColorPicker kind="background" rememberSelection={rememberSelection} onSelect={color => run('hiliteColor', color)} />
        {divider()}
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton className={styles.fontSizeButton} appearance="subtle" aria-label="Font size" title="Font size" onMouseDown={rememberSelection} />
          </MenuTrigger>
          <MenuPopover><MenuList>
            {[['10', '1'], ['13', '2'], ['16', '3'], ['18', '4'], ['24', '5'], ['32', '6']].map(([size, value]) => (
              <MenuItem key={size} onClick={() => run('fontSize', value)}>{size} px</MenuItem>
            ))}
          </MenuList></MenuPopover>
        </Menu>
        {divider()}
      </>}
      {links}{divider()}
      {!expanded && <>
        {tool('Remove formatting', <TextClearFormattingRegular />, 'removeFormat')}
        {divider()}{lists}{divider()}
        <ToolbarButton
          className={styles.button} appearance="subtle" icon={<MoreHorizontalRegular />}
          aria-label="Expand toolbar" title="Expand toolbar" onClick={onToggleExpanded}
        />
      </>}
    </Toolbar>
    {expanded && (
      <Toolbar className={`${styles.toolbar} ${styles.secondRow}`} aria-label="More text formatting">
        {tool('Remove formatting', <TextClearFormattingRegular />, 'removeFormat')}{divider()}
        {tool('Align left', <TextAlignLeftRegular />, 'justifyLeft', { active: format.alignment === 'justifyLeft' })}
        {tool('Align centre', <TextAlignCenterRegular />, 'justifyCenter', { active: format.alignment === 'justifyCenter' })}
        {tool('Align right', <TextAlignRightRegular />, 'justifyRight', { active: format.alignment === 'justifyRight' })}
        {tool('Justify', <TextAlignJustifyRegular />, 'justifyFull', { active: format.alignment === 'justifyFull' })}
        {tool('Increase indent', <TextIndentIncreaseLtrRegular />, 'indent')}
        {tool('Decrease indent', <TextIndentDecreaseLtrRegular />, 'outdent', { disabled: !format.canOutdent })}
        {lists}{divider()}<span className={styles.spacer} aria-hidden="true" />
        <ToolbarButton
          className={styles.button} appearance="subtle"
          icon={<ChevronUpRegular />} aria-label="Collapse toolbar" title="Collapse toolbar"
          onClick={onToggleExpanded}
        />
      </Toolbar>
    )}
  </>;
}
