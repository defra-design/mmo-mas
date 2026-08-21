// src/components/tasks/TaskHint.tsx
// Full-width guidance shown under a field, matching the WFD excluded-activity
// list. D365's OOB field description is a tooltip (or short hint); this richer
// HTML is custom-injected on the form in the real build. The info icon is the
// same Regular outline treatment as FieldLock — native D365 puts (i) on the
// field label, not beside the body copy.
//
// Two presentations, so both can be usability tested:
//   · default — the guidance sits open on the form behind an (i)
//   · `title` given — it collapses behind a "Help with ..." disclosure the
//     caseworker opens on demand (the GOV.UK details pattern, Fluent-styled)
// Both are the same injected HTML in the real build: the disclosure is a plain
// <details>/<summary> inside the web resource that already carries this copy, so
// it costs nothing beyond what the open version already costs.
import type { ReactNode } from 'react';
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
} from '@fluentui/react-components';
import { InfoRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  hint: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXXL,
  },
  // The open variant needs a big gap above it, or the guidance runs straight into
  // the field label as one block of text. Collapsed behind a disclosure it is a
  // single line and reads as distinct already, so it needs far less.
  spaceAbove: { marginTop: tokens.spacingVerticalXXL },
  spaceAboveDisclosure: { marginTop: tokens.spacingVerticalL },
  // Disclosure variant. Sits flush with the fields above it and reads as a link,
  // the way D365 renders an inline action on a form.
  disclosure: { marginBottom: tokens.spacingVerticalXXL },
  header: {
    '& button': {
      ...shorthands.padding('0'),
      color: tokens.colorBrandForegroundLink,
      fontSize: tokens.fontSizeBase300,
      fontWeight: tokens.fontWeightRegular,
      ':hover': {
        color: tokens.colorBrandForegroundLinkHover,
        textDecorationLine: 'underline',
        backgroundColor: 'transparent',
      },
      ':hover:active': { backgroundColor: 'transparent' },
    },
    // The expand chevron inherits the link colour.
    '& span': { color: 'inherit' },
  },
  // Indented under the disclosure so the open guidance reads as its content,
  // matching the GOV.UK details pattern's left rule without inventing one.
  panel: {
    marginTop: tokens.spacingVerticalM,
    marginLeft: '0',
  },
  icon: {
    flexShrink: 0,
    fontSize: '20px',
    color: tokens.colorNeutralForeground1,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: 0,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
    '& p': { margin: 0 },
    '& ul': {
      margin: 0,
      paddingLeft: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacingVerticalS,
    },
    '& li': { lineHeight: tokens.lineHeightBase300 },
  },
});

interface TaskHintProps {
  children: ReactNode;
  /** Extra space above the guidance — used when it sits under a short control. */
  spaceAbove?: boolean;
  /** When given, the guidance collapses behind a disclosure with this label
   *  (e.g. "Help with personal information") instead of sitting open. */
  title?: string;
}

export default function TaskHint({ children, spaceAbove, title }: TaskHintProps) {
  const styles = useStyles();

  if (title) {
    return (
      <Accordion
        collapsible
        className={mergeClasses(styles.disclosure, spaceAbove && styles.spaceAboveDisclosure)}
      >
        <AccordionItem value="help">
          {/* No help icon: the chevron already says it expands and the label
              already says "Help with ...", so an icon would only repeat them.
              This is the GOV.UK details treatment — disclosure plus link text. */}
          <AccordionHeader className={styles.header} expandIconPosition="start">
            {title}
          </AccordionHeader>
          <AccordionPanel className={styles.panel}>
            <div className={styles.body}>{children}</div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div className={mergeClasses(styles.hint, spaceAbove && styles.spaceAbove)}>
      <InfoRegular className={styles.icon} aria-hidden />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
