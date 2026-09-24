import { useRef } from 'react';
import {
  makeStyles, shorthands, tokens, Toolbar, ToolbarButton, Menu, MenuButton,
  MenuItem, MenuList, MenuPopover, MenuTrigger,
} from '@fluentui/react-components';
import {
  ArrowRedoRegular, ArrowUndoRegular, TextBoldRegular, TextBulletListRegular,
  TextClearFormattingRegular, TextItalicRegular, TextNumberListLtrRegular,
  TextUnderlineRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    borderRadius: tokens.borderRadiusSmall,
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  divider: {
    width: '1px', height: '24px', marginLeft: tokens.spacingHorizontalXS,
    marginRight: tokens.spacingHorizontalXS, backgroundColor: tokens.colorNeutralStroke1,
  },
  history: { marginLeft: 'auto', display: 'flex' },
  editor: {
    minHeight: '220px', maxHeight: '420px', overflowY: 'auto', outline: 'none',
    resize: 'vertical',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ':focus-visible': { outline: `2px solid ${tokens.colorBrandStroke1}` },
    '& h1': { fontSize: '24px', marginTop: '0', marginBottom: '8px' },
    '& h2': { fontSize: '20px', marginTop: '0', marginBottom: '8px' },
    '& ul, & ol': { paddingLeft: '28px' },
  },
});

type Props = { label: string; invalid?: boolean; onChange: (html: string) => void };

export default function RichTextEditor({ label, invalid = false, onChange }: Props) {
  const styles = useStyles();
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);

  const rememberSelection = () => {
    const selected = window.getSelection();
    if (editor.current && selected?.rangeCount && editor.current.contains(selected.anchorNode)) {
      selection.current = selected.getRangeAt(0).cloneRange();
    }
  };

  const run = (command: string, value?: string) => {
    editor.current?.focus();
    if (selection.current) {
      const selected = window.getSelection();
      selected?.removeAllRanges();
      selected?.addRange(selection.current);
    }
    document.execCommand(command, false, value);
    if (command === 'removeFormat') document.execCommand('formatBlock', false, 'p');
    rememberSelection();
    onChange(editor.current?.innerHTML ?? '');
  };

  const tool = (labelText: string, icon: React.ReactElement, command: string) => (
    <ToolbarButton
      appearance="subtle" icon={icon} aria-label={labelText} title={labelText}
      onMouseDown={event => event.preventDefault()}
      onClick={() => run(command)}
    />
  );

  return (
    <div className={styles.wrapper}>
      <Toolbar className={styles.toolbar} aria-label="Text formatting">
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton appearance="subtle" size="small" onMouseDown={rememberSelection}>
              Paragraph
            </MenuButton>
          </MenuTrigger>
          <MenuPopover><MenuList>
            <MenuItem onClick={() => run('formatBlock', 'p')}>Paragraph</MenuItem>
            <MenuItem onClick={() => run('formatBlock', 'h1')}>Heading 1</MenuItem>
            <MenuItem onClick={() => run('formatBlock', 'h2')}>Heading 2</MenuItem>
          </MenuList></MenuPopover>
        </Menu>
        <span className={styles.divider} aria-hidden="true" />
        {tool('Bold', <TextBoldRegular />, 'bold')}
        {tool('Italic', <TextItalicRegular />, 'italic')}
        {tool('Underline', <TextUnderlineRegular />, 'underline')}
        <span className={styles.divider} aria-hidden="true" />
        {tool('Bulleted list', <TextBulletListRegular />, 'insertUnorderedList')}
        {tool('Numbered list', <TextNumberListLtrRegular />, 'insertOrderedList')}
        <span className={styles.divider} aria-hidden="true" />
        {tool('Remove formatting', <TextClearFormattingRegular />, 'removeFormat')}
        <span className={styles.history}>
          {tool('Undo', <ArrowUndoRegular />, 'undo')}
          {tool('Redo', <ArrowRedoRegular />, 'redo')}
        </span>
      </Toolbar>
      <div
        ref={editor} className={styles.editor} contentEditable role="textbox"
        aria-label={label} aria-multiline="true" aria-invalid={invalid}
        suppressContentEditableWarning
        onInput={event => onChange(event.currentTarget.innerHTML)}
        onKeyUp={rememberSelection} onMouseUp={rememberSelection}
        onBlur={rememberSelection}
        onPaste={event => {
          event.preventDefault();
          document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
        }}
        onDrop={event => event.preventDefault()}
      />
    </div>
  );
}
