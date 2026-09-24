import { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { sanitizeRichText } from '../utils/richText';
import RichTextToolbar from './RichTextToolbar';
import type { EditorFormatState } from './RichTextToolbar';

const useStyles = makeStyles({
  wrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', '#bdbdbd'),
    borderRadius: 0,
    overflow: 'hidden',
  },
  toolbarBorder: { height: '3px', backgroundColor: '#c9c9c9' },
  editor: {
    minHeight: '220px', maxHeight: '420px', overflowY: 'auto', outline: 'none',
    resize: 'vertical',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    ':focus-visible': { outline: `2px solid ${tokens.colorBrandStroke1}` },
    '& h1': { fontSize: '24px', marginTop: '0', marginBottom: '8px' },
    '& h2': { fontSize: '20px', marginTop: '0', marginBottom: '8px' },
    '& ul, & ol': { paddingLeft: '28px' },
    '& blockquote': { marginLeft: '40px' },
  },
});

type Props = { label: string; invalid?: boolean; onChange: (html: string) => void };
const commands = [
  'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript',
  'insertUnorderedList', 'insertOrderedList',
];

export default function RichTextEditor({ label, invalid = false, onChange }: Props) {
  const styles = useStyles();
  const editor = useRef<HTMLDivElement>(null);
  const selection = useRef<Range | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [format, setFormat] = useState<EditorFormatState>({
    block: 'p', active: {}, alignment: 'justifyLeft', hasLink: false, canOutdent: false,
  });

  const rememberSelection = useCallback(() => {
    const selected = window.getSelection();
    if (editor.current && selected?.rangeCount && editor.current.contains(selected.anchorNode)) {
      selection.current = selected.getRangeAt(0).cloneRange();
    }
  }, []);

  const updateFormat = useCallback(() => {
    const selected = window.getSelection();
    if (!editor.current || !selected?.anchorNode || !editor.current.contains(selected.anchorNode)) return;
    rememberSelection();
    const anchor = selected.anchorNode instanceof Element
      ? selected.anchorNode : selected.anchorNode.parentElement;
    const active = Object.fromEntries(commands.map(command => [command, document.queryCommandState(command)]));
    const alignment = ['justifyCenter', 'justifyRight', 'justifyFull']
      .find(command => document.queryCommandState(command)) ?? 'justifyLeft';
    const block = anchor?.closest('h1, h2')?.tagName.toLowerCase() ?? 'p';
    setFormat({
      block, active, alignment,
      hasLink: Boolean(anchor?.closest('a')),
      canOutdent: Boolean(anchor?.closest('blockquote, [style*="margin-left"]')),
    });
  }, [rememberSelection]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateFormat);
    return () => document.removeEventListener('selectionchange', updateFormat);
  }, [updateFormat]);

  const run = (command: string, value?: string) => {
    editor.current?.focus();
    if (selection.current) {
      const selected = window.getSelection();
      selected?.removeAllRanges();
      selected?.addRange(selection.current);
    }
    document.execCommand(command, false, value);
    if (command === 'removeFormat') document.execCommand('formatBlock', false, 'p');
    updateFormat();
    onChange(editor.current?.innerHTML ?? '');
  };

  const insertLink = (text: string, url: string) => {
    if (selection.current?.toString() === text) {
      run('createLink', url);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    run('insertHTML', link.outerHTML);
  };

  return (
    <div className={styles.wrapper}>
      <RichTextToolbar
        expanded={expanded} onToggleExpanded={() => setExpanded(value => !value)}
        format={format} run={run} rememberSelection={rememberSelection}
        getSelectedText={() => selection.current?.toString() ?? ''}
        insertLink={insertLink}
      />
      <div className={styles.toolbarBorder} aria-hidden="true" />
      <div
        ref={editor} className={styles.editor} contentEditable role="textbox"
        aria-label={label} aria-multiline="true" aria-invalid={invalid}
        suppressContentEditableWarning
        onInput={event => { onChange(event.currentTarget.innerHTML); updateFormat(); }}
        onKeyUp={updateFormat} onMouseUp={updateFormat}
        onBlur={rememberSelection}
        onPaste={event => {
          event.preventDefault();
          const html = event.clipboardData.getData('text/html');
          if (html) document.execCommand('insertHTML', false, sanitizeRichText(html));
          else document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
        }}
        onDrop={event => event.preventDefault()}
      />
    </div>
  );
}
