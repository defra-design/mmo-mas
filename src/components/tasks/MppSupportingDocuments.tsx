// src/components/tasks/MppSupportingDocuments.tsx
// MOCKUP — the applicant's supporting documents for one policy, shown on the
// policy assessment form. Only rendered with ?docs=1 on the form's URL; nothing
// links to it yet, as developers are still to confirm it can be built.
// Follows the Review public notice evidence pattern: a heading per document,
// then read-only rows, with the file as a download link like WFD's
// "Assessment provided". Each row would be a column on a related
// "Supporting document" record in real D365.
import { makeStyles, shorthands, tokens, Link, Text } from '@fluentui/react-components';
import { ArrowDownloadRegular } from '@fluentui/react-icons';
import TaskRow from './TaskRow';
import TaskValue from './TaskValue';
import type { SupportingDocument } from '../../utils/marinePlanPolicies';

const useStyles = makeStyles({
  document: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },
  heading: { fontSize: tokens.fontSizeBase300, fontWeight: tokens.fontWeightSemibold },
  linkValue: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: '140px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusSmall,
  },
  link: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  icon: { flexShrink: 0 },
});

interface MppSupportingDocumentsProps {
  documents: SupportingDocument[];
}

export default function MppSupportingDocuments({ documents }: MppSupportingDocumentsProps) {
  const styles = useStyles();
  return (
    <>
      {documents.map((doc, i) => (
        <div key={doc.filename} className={styles.document}>
          <Text as="h3" className={styles.heading}>Supporting document {i + 1}</Text>
          <TaskRow label="Document" locked>
            <div className={styles.linkValue}>
              {/* A placeholder — the file would come from CDP. */}
              <Link className={styles.link} href="#" onClick={e => e.preventDefault()}>
                <ArrowDownloadRegular className={styles.icon} aria-hidden />
                {doc.filename}
              </Link>
            </div>
          </TaskRow>
          <TaskRow label="Document type" locked>
            <TaskValue>{doc.type}</TaskValue>
          </TaskRow>
          <TaskRow label="Where to find the evidence" locked>
            <TaskValue>{doc.location}</TaskValue>
          </TaskRow>
        </div>
      ))}
    </>
  );
}
