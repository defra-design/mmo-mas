// src/components/IndexPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components';
import { useTasks } from '../context/TaskContext';
import { asset } from '../utils/asset';
import TaskHint from './tasks/TaskHint';

const useStyles = makeStyles({
  page: {
    height: '100vh', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#fff',
    color: '#323130', fontFamily: '"Segoe UI", Arial, sans-serif', fontSize: '16px', lineHeight: '1.6',
    borderTop: '8px solid #009d45',
    '& a': { color: '#0078d4', textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '3px' },
    '& a:hover': { color: '#0078d4', textDecoration: 'none' },
    '& a:active': { color: '#0078d4' },
    '& a:focus-visible': { outline: '3px solid #0078d4', outlineOffset: '4px' },
  },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 32px 28px', '@media (max-width: 600px)': { padding: '28px 24px' } },
  logo: { height: '80px', maxWidth: '100%', marginBottom: '36px' },
  title: { fontSize: '40px', lineHeight: '1.15', fontWeight: 600, margin: '0 0 20px', maxWidth: '700px', '@media (max-width: 600px)': { fontSize: '32px' } },
  intro: { fontSize: '19px', lineHeight: '1.6', color: '#605e5c', maxWidth: '690px', margin: '0 0 22px' },
  sectionTitle: { fontSize: '24px', lineHeight: '1.3', fontWeight: 600, margin: '0 0 8px' },
  iteration: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 250px', gap: '40px',
    padding: '28px 0 32px', borderTop: '1px solid #d2d0ce',
    '@media (max-width: 700px)': { gridTemplateColumns: '1fr', gap: '16px' },
  },
  iterationHeading: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' },
  iterationTitle: { margin: 0, fontSize: '22px', fontWeight: 600, lineHeight: '1.3' },
  status: { borderRadius: '2px', ...shorthands.borderStyle('none'), padding: '3px 8px', height: 'auto', fontSize: '14px', fontWeight: 500, lineHeight: '20px' },
  inProgress: { backgroundColor: '#cfe4f8', color: '#0c2d4a' },
  tested: { backgroundColor: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground2 },
  description: { margin: '0 0 18px', maxWidth: '590px' },
  prototypeLink: { fontWeight: 'inherit' },
  shortcuts: {
    '& .fui-Accordion': { marginBottom: 0 },
    '& .fui-AccordionHeader button': { fontSize: '16px', lineHeight: '1.6', minHeight: '32px' },
    '& .fui-AccordionPanel > div': { fontSize: '16px', lineHeight: '1.6' },
  },
  explorationsTitle: { margin: '8px 0 8px', fontSize: '16px', fontWeight: 600 },
  explorationsList: { margin: 0, paddingLeft: 0, listStyleType: 'none', '& li + li': { marginTop: '8px' } },
  resources: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', paddingTop: '4px', fontSize: '15px' },
  resourceTitle: { margin: 0, fontSize: '16px', fontWeight: 600, color: '#323130' },
  pending: { color: '#605e5c' },
  caseGuidance: { margin: '16px 0 0', paddingLeft: '20px', maxWidth: '590px' },
  resetActions: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '36px' },
  resetButton: {
    ':hover': { backgroundColor: tokens.colorBrandBackgroundSelected },
    ':active': { backgroundColor: tokens.colorBrandBackgroundPressed },
  },
  success: { color: '#107c10', fontSize: '14px' },
  guide: { borderTop: '1px solid #d2d0ce', padding: '28px 0 32px' },
  guideLink: { display: 'inline-block', margin: '8px 0 12px', fontWeight: 600 },
  guideDescription: { margin: 0, maxWidth: '650px', color: '#605e5c' },
  footer: { borderTop: '1px solid #d2d0ce', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px 28px', fontSize: '14px' },
});

const playbackUrls: Record<number, string> = {
  1: 'https://defra.sharepoint.com/:p:/r/teams/Team4307/Change%20Delivery%20%20Implementation/MMO%20CHANGE%20PROGRAMME/MPLP%20(Marine%20Planning%20%26%20Licensing%20Programme)/7%20Low%20Complexity%20Marine%20Licences/User%20research/Marine%20Applications%20System%20(internal%20facing%20research)/MAS%20Round%202%20testing.pptx?d=w9ec5d7d94e004be29adca68b6fd8cdc1&csf=1&web=1&e=nfOZqp',
  2: 'https://defra.sharepoint.com/:p:/r/teams/Team4307/Change%20Delivery%20%20Implementation/MMO%20CHANGE%20PROGRAMME/MPLP%20(Marine%20Planning%20%26%20Licensing%20Programme)/7%20Low%20Complexity%20Marine%20Licences/User%20research/Marine%20Applications%20System%20(internal%20facing%20research)/MAS%20round%203/MAS%20Round%203-%20Usability_testing_playback_deck.pptx?d=w7004debe41d34501b11a61474b0e08af&csf=1&web=1&e=oWUJPf',
};

export default function IndexPage() {
  const styles = useStyles();
  const { resetAll } = useTasks();
  const [justReset, setJustReset] = useState(false);
  const handleReset = () => {
    if (window.confirm('Reset all prototype data and start afresh? This clears the Site check answers and task statuses.')) {
      resetAll();
      setJustReset(true);
      setTimeout(() => setJustReset(false), 3000);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header>
          <img className={styles.logo} src={asset('images/Marine_Management_Organisation_logo.svg')} alt="Marine Management Organisation" />
          <h1 className={styles.title}>Marine Applications System (MAS) prototype</h1>
          <p className={styles.intro}>MAS will replace the legacy MCMS system, providing a new caseworker service built in Microsoft Dynamics 365.</p>
        </header>
        <main>
          <div className={styles.resetActions}>
            <Button className={styles.resetButton} appearance="primary" size="large" onClick={handleReset}>Clear saved data</Button>
            <span className={styles.success} role="status">{justReset ? 'Prototype data cleared' : ''}</span>
          </div>
          <section aria-labelledby="iterations-heading">
            <h2 id="iterations-heading" className={styles.sectionTitle}>Receive and assess stage</h2>
            {[2, 1].map(iteration => (
              <article key={iteration} className={styles.iteration} aria-labelledby={`iteration-${iteration}`}>
                <div>
                  <div className={styles.iterationHeading}>
                    <h3 id={`iteration-${iteration}`} className={styles.iterationTitle}>
                      {iteration === 2 ? (
                        <Link className={styles.prototypeLink} to="/receive-assess">Iteration 2</Link>
                      ) : (
                        <a className={styles.prototypeLink} href="/iteration-1/receive-assess">Iteration 1</a>
                      )}
                    </h3>
                    <Badge className={mergeClasses(styles.status, iteration === 2 ? styles.inProgress : styles.tested)}>
                      {iteration === 2 ? 'In progress' : 'As usability-tested'}
                    </Badge>
                  </div>
                  <p className={styles.description}>
                    {iteration === 2
                      ? 'Develops the assessment journey with marine plan policy assessments, consultation preparation, public register decisions and public notice evidence review.'
                      : 'The first application review journey, with the Case list, applicant review tabs, Site check and Water Framework Directive tasks.'}
                  </p>
                  {iteration === 1 && (
                    <ul className={styles.caseGuidance}>
                      <li>MLA/2026/1002 is the active case. After completing the tasks, clear the saved data to start again.</li>
                    </ul>
                  )}
                  {iteration === 2 && (
                    <div className={styles.shortcuts}>
                      <TaskHint title="Shortcuts">
                        <Link to="/examples/start-consultation">The Start consultation task</Link>
                        <p>Loads an example with all assessment tasks and marine plan policies Done, and Start consultation To do.</p>
                      </TaskHint>
                    </div>
                  )}
                  {iteration === 2 && (
                    <section aria-labelledby="explorations-heading">
                      <h4 id="explorations-heading" className={styles.explorationsTitle}>Design explorations</h4>
                      <ul className={styles.explorationsList}>
                        <li><a href={asset('mockups/index.html')}>Start consultation task mockups</a></li>
                      </ul>
                    </section>
                  )}
                </div>
                <div className={styles.resources}>
                  <p className={styles.resourceTitle}>Design and research</p>
                  {iteration === 1 ? (
                    <a href={asset('docs/version-1-design-overview.html')}>Version 1 – design overview</a>
                  ) : <span className={styles.pending}>Design overview to follow</span>}
                  {playbackUrls[iteration] ? (
                    <a href={playbackUrls[iteration]} target="_blank" rel="noopener noreferrer">UR playback (opens in a new tab)</a>
                  ) : <span className={styles.pending}>UR playback link to be added</span>}
                </div>
              </article>
            ))}
          </section>
          <section className={styles.guide} aria-labelledby="guide-heading">
            <h2 id="guide-heading" className={styles.sectionTitle}>For designers and developers</h2>
            <a className={styles.guideLink} href="https://github.com/defra-design/mmo-mas/blob/main/docs/design-and-development-guide.md" target="_blank" rel="noopener noreferrer">Design and development guide (opens in a new tab)</a>
            <p className={styles.guideDescription}>How the prototype fits together, where screens and data live, and how to make changes.</p>
          </section>
        </main>
        <footer className={styles.footer}>
          <Link to="/proof-of-concept">Earlier proof of concept</Link>
        </footer>
      </div>
    </div>
  );
}
