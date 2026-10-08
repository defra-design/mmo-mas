// D365's OOB "Edit multiple records" (bulk edit) panel, opened by the subgrid's
// Edit command when more than one Consultee is selected. Every field starts
// empty; only the fields the caseworker fills in are written to the selected
// records, so required fields are not enforced here. Notes is always shown,
// because bulk edit does not run the form's show/hide business rule.
import { useState } from 'react';
import {
  Button, makeStyles, OverlayDrawer, DrawerBody, DrawerFooter, DrawerHeader,
  DrawerHeaderTitle, Text, tokens,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';
import OrganisationLookup from './OrganisationLookup';
import OutcomeDropdown from './OutcomeDropdown';
import TaskRow from './TaskRow';
import TaskTextarea from './TaskTextarea';
import type { ConsulteeRow } from '../../context/TaskContext';
import { useTasks } from '../../context/TaskContext';

export type ConsulteeChanges = Partial<Omit<ConsulteeRow, 'id'>>;

const CONSULTATION_TYPES = ['Application notification', 'Request for advice'];

const useStyles = makeStyles({
  intro: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  formLabel: { fontWeight: tokens.fontWeightSemibold },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalXXL,
  },
  control: { flexGrow: 1, flexBasis: 0, minWidth: '140px' },
  footer: { justifyContent: 'flex-end' },
});

type Props = {
  count: number;
  onCancel: () => void;
  onSave: (changes: ConsulteeChanges) => void;
};

export default function ConsulteeBulkEdit({ count, onCancel, onSave }: Props) {
  const styles = useStyles();
  const { recentOrganisations, addRecentOrganisation } = useTasks();
  const [changes, setChanges] = useState<ConsulteeChanges>({});
  const set = (field: keyof ConsulteeChanges, value: string) =>
    setChanges(previous => ({ ...previous, [field]: value || undefined }));

  return (
    <OverlayDrawer open position="end" size="medium" onOpenChange={(_, data) => !data.open && onCancel()}>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" aria-label="Close" icon={<DismissRegular />} onClick={onCancel} />}
        >
          Edit {count} records
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.intro}>
          <Text>Enter changes in the fields you want to edit.</Text>
          <div>
            <Text block className={styles.formLabel}>Form</Text>
            <Text block>Consultee</Text>
          </div>
        </div>
        <div className={styles.fields}>
          <TaskRow label="Organisation" required>
            <div className={styles.control}>
              <OrganisationLookup
                value={changes.organisation ?? ''}
                recent={recentOrganisations}
                onSelect={value => {
                  set('organisation', value);
                  if (value.trim()) addRecentOrganisation(value);
                }}
              />
            </div>
          </TaskRow>
          <TaskRow label="Consultation type" required>
            <div className={styles.control}>
              <OutcomeDropdown
                value={changes.consultationType ?? ''}
                options={CONSULTATION_TYPES}
                onSelect={value => set('consultationType', value)}
              />
            </div>
          </TaskRow>
          <TaskRow label="Notes for the organisation" top>
            <TaskTextarea value={changes.notes ?? ''} onChange={value => set('notes', value)} />
          </TaskRow>
        </div>
      </DrawerBody>
      <DrawerFooter className={styles.footer}>
        <Button appearance="primary" onClick={() => onSave(changes)}>Save</Button>
        <Button appearance="secondary" onClick={onCancel}>Cancel</Button>
      </DrawerFooter>
    </OverlayDrawer>
  );
}
