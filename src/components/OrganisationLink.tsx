// A read-only Organisation lookup value, as D365 shows it on a locked field: the
// record's icon and its name as a link that opens the Organisation form. Falls
// back to plain text when the prototype has no record for the name.
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles, tokens } from '@fluentui/react-components';
import { BuildingRegular } from '@fluentui/react-icons';
import { organisationByName } from '../utils/organisations';

const useStyles = makeStyles({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    maxWidth: '100%',
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    font: 'inherit',
    color: '#0078d4',
    textAlign: 'left',
  },
  icon: { color: tokens.colorNeutralForeground3, flexShrink: 0 },
  name: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline' },
});

type Props = { caseId: string; name: string };

export default function OrganisationLink({ caseId, name }: Props) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const organisation = organisationByName(name);
  if (!organisation) return <>{name}</>;
  return (
    <button
      type="button"
      className={styles.link}
      onClick={() => navigate(
        `/receive-assess/cases/${encodeURIComponent(caseId)}/organisations/${organisation.id}`,
        { state: { from: pathname } },
      )}
    >
      <BuildingRegular className={styles.icon} />
      <span className={styles.name}>{name}</span>
    </button>
  );
}
