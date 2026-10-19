// src/components/tasks/MppSupportingDocumentsHtml.tsx
// MOCKUP — the injected-HTML version of the policy's supporting documents on the
// policy assessment form (?docs=2; ?docs=1 is the D365 fields version). Like WFD's
// "Assessment provided", developers would inject this HTML rather than build
// D365 fields, so there's no padlock. One grey box per document, laid out as on
// the Marine plan policies review tab: the download link, then its type and
// where the evidence is.
import { makeStyles, shorthands, tokens, Body1, Link } from '@fluentui/react-components';
import { ArrowDownloadRegular } from '@fluentui/react-icons';
import TaskRow from './TaskRow';
import type { SupportingDocument } from '../../utils/marinePlanPolicies';

const useStyles = makeStyles({
  list: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  document: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  link: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  icon: { flexShrink: 0 },
  rows: {
    margin: `${tokens.spacingVerticalM} 0 0`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  // Label beside value; the value wraps under the label when narrow.
  row: { display: 'flex', flexWrap: 'wrap', columnGap: tokens.spacingHorizontalXXL, rowGap: '2px' },
  label: { flex: '0 0 200px', color: tokens.colorNeutralForeground2 },
  value: { flex: '1 1 200px', minWidth: 0, margin: 0 },
});

interface MppSupportingDocumentsHtmlProps {
  documents: SupportingDocument[];
}

export default function MppSupportingDocumentsHtml({ documents }: MppSupportingDocumentsHtmlProps) {
  const styles = useStyles();
  if (documents.length === 0) return null;
  return (
    <TaskRow label="Supporting documents">
      <div className={styles.list}>
        {documents.map(doc => (
          <div key={doc.filename} className={styles.document}>
            {/* A placeholder — the file would come from CDP. */}
            <Link className={styles.link} href="#" onClick={e => e.preventDefault()}>
              <ArrowDownloadRegular className={styles.icon} aria-hidden />
              {doc.filename}
            </Link>
            <dl className={styles.rows}>
              <div className={styles.row}>
                <dt className={styles.label}><Body1>Document type:</Body1></dt>
                <dd className={styles.value}><Body1>{doc.type}</Body1></dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.label}><Body1>Where to find the evidence:</Body1></dt>
                <dd className={styles.value}><Body1>{doc.location}</Body1></dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </TaskRow>
  );
}
