import { useState } from 'react';
import {
  Button, Field, Input, Popover, PopoverSurface, PopoverTrigger, ToolbarButton,
  makeStyles, mergeClasses, shorthands,
} from '@fluentui/react-components';
import { LinkRegular } from '@fluentui/react-icons';
import { safeRichTextUrl } from '../utils/richText';

const useStyles = makeStyles({
  trigger: { width: '30px', minWidth: '30px', height: '32px', ...shorthands.padding('0') },
  openTrigger: { backgroundColor: '#fff', ...shorthands.border('1px', 'solid', '#323130') },
  surface: { width: '260px', display: 'flex', flexDirection: 'column', gap: '10px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '8px' },
});

type Props = {
  getSelectedText: () => string;
  rememberSelection: () => void;
  onInsert: (text: string, url: string) => void;
};

export default function RichTextLinkPicker({ getSelectedText, rememberSelection, onInsert }: Props) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const insert = () => {
    const raw = url.trim();
    const normalized = safeRichTextUrl(raw.includes(':') ? raw : `https://${raw}`);
    if (!normalized) {
      setError('Enter a valid web or email address.');
      return;
    }
    onInsert(text.trim() || raw, normalized);
    setOpen(false);
    setText('');
    setUrl('');
    setError('');
  };

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)} positioning="below-start">
      <PopoverTrigger disableButtonEnhancement>
        <ToolbarButton
          className={mergeClasses(styles.trigger, open && styles.openTrigger)}
          appearance="subtle" icon={<LinkRegular />}
          aria-label="Insert link" title="Insert link"
          onMouseDown={rememberSelection}
          onClick={() => setText(getSelectedText())}
        />
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <Field label="Display text"><Input value={text} onChange={(_, data) => setText(data.value)} /></Field>
        <Field label="Link URL" validationState={error ? 'error' : 'none'} validationMessage={error}>
          <Input value={url} onChange={(_, data) => { setUrl(data.value); setError(''); }} />
        </Field>
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button appearance="primary" onClick={insert}>Insert</Button>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
