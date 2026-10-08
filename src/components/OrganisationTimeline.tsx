// The OOB Timeline control on the Organisation form. Static in the prototype:
// the commands and note box are shown for fidelity but not wired, and the only
// entry is the auto-post D365 adds when the account is created.
import type { ReactElement } from 'react';
import {
  Button, Card, Input, makeStyles, shorthands, Text, tokens,
} from '@fluentui/react-components';
import {
  AddRegular, ArrowClockwiseRegular, BookmarkRegular, ChevronDownRegular, FilterRegular,
  MoreVerticalRegular, NoteEditRegular, SearchRegular, TextBulletListLtrRegular, BuildingRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: { ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL), gap: tokens.spacingVerticalM },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: tokens.fontWeightSemibold },
  commands: { display: 'flex' },
  search: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border('none'),
    '::after': { ...shorthands.border('none') },
  },
  note: {
    display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, color: tokens.colorNeutralForeground3,
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  recent: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  entry: { display: 'flex', gap: tokens.spacingHorizontalM, paddingLeft: tokens.spacingHorizontalS },
  entryIcon: { color: tokens.colorNeutralForeground3, marginTop: '2px' },
  meta: { color: tokens.colorNeutralForeground2, fontSize: tokens.fontSizeBase200 },
});

type Props = { name: string; createdOn: string };

export default function OrganisationTimeline({ name, createdOn }: Props) {
  const styles = useStyles();
  const icon = (label: string, glyph: ReactElement) =>
    <Button appearance="subtle" size="small" icon={glyph} aria-label={label} />;
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text className={styles.title}>Timeline</Text>
        <div className={styles.commands}>
          {icon('Create a timeline record', <AddRegular />)}
          {icon('Bookmark', <BookmarkRegular />)}
          {icon('Filter', <FilterRegular />)}
          {icon('Expand all records', <TextBulletListLtrRegular />)}
          {icon('Refresh timeline', <ArrowClockwiseRegular />)}
          {icon('More commands', <MoreVerticalRegular />)}
        </div>
      </div>
      <Input className={styles.search} appearance="filled-lighter" placeholder="Search timeline"
        contentBefore={<SearchRegular />} aria-label="Search timeline" />
      <div className={styles.note}><NoteEditRegular /><Text>Enter a note...</Text></div>
      <div className={styles.recent}><ChevronDownRegular /><Text>Recent</Text></div>
      <div className={styles.entry}>
        <BuildingRegular className={styles.entryIcon} />
        <div>
          <Text block>Auto-post on Organisation {name}</Text>
          <Text block className={styles.meta}>{createdOn}</Text>
          <Text block className={styles.meta}>Account created by MMO Marine Licensing</Text>
        </div>
      </div>
    </Card>
  );
}
