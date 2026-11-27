import { NOT_ACCEPTED } from '../../utils/publicNoticeEvidence';
import { asset } from '../../utils/asset';
import { applicationFor } from '../../utils/cases';
import type { Application } from '../../utils/cases';

// The applicant's site notice locations, as submitted on CDP. Names follow the
// applicant guidance: a place, then where exactly the notice was displayed.
// Each application has its own, with photos in public/cdp/evidence/<application>/.
const submitted: Partial<Record<Application, string[][]>> = {
  exmouth: [
    ['Exmouth Marina, noticeboard by the marina office', '16 November 2026'],
    ['Exmouth seafront, public noticeboard by the lifeboat station', '16 November 2026'],
    ['Exmouth Dock, sign post at the dock entrance', '17 November 2026'],
    ['Exmouth station car park, noticeboard by the Exe Estuary Trail', '17 November 2026'],
  ],
  brixham: [
    ['Brixham Fish Quay, public noticeboard by the market entrance', '9 November 2026'],
    ['Brixham harbour, noticeboard by the harbour office', '9 November 2026'],
    ['Brixham breakwater, sign post by the breakwater steps', '10 November 2026'],
    ['Brixham Marina, noticeboard by the walkway gate', '10 November 2026'],
  ],
};

/** Every application with public notice evidence has this many locations. */
export const EVIDENCE_LOCATION_COUNT = 4;

/** The public notice locations the applicant on this case sent photos for. */
export function evidenceLocationsFor(caseId: string) {
  const application = applicationFor(caseId);
  return (submitted[application] ?? []).map(([name, date], index) => ({
    name,
    date,
    closeUpHref: asset(`cdp/evidence/${application}/location-${index + 1}-close-up.svg`),
    surroundingsHref: asset(`cdp/evidence/${application}/location-${index + 1}-surroundings.svg`),
  }));
}

export type PublicNoticeEvidenceLocation = ReturnType<typeof evidenceLocationsFor>[number];

// MLA/2026/10013: the earlier review, now read-only history. Locations 1 and 4
// were not accepted; the rest were accepted.
export const resubmittedPublicNoticeEvidenceReviews = Array.from(
  { length: EVIDENCE_LOCATION_COUNT },
  (_, index) =>
    ({
      0: {
        decision: NOT_ACCEPTED,
        rejectionComments:
          'The close-up photograph does not clearly show the full notice and the surroundings photograph does not show where it was displayed. Provide clear replacement photographs showing the complete notice and its location.',
      },
      3: {
        decision: NOT_ACCEPTED,
        rejectionComments:
          'The close-up photograph is blurred and the notice text cannot be read. Provide a clear replacement close-up photograph of the notice.',
      },
    })[index] ?? { decision: 'Yes', rejectionComments: '' },
);

// MLA/2026/10013: replacement photographs for the two rejected locations, keyed
// by location index.
const replacement = (number: number) => ({
  submittedDate: '24 November 2026',
  closeUpHref: asset(`cdp/evidence/brixham/location-${number}-replacement-close-up.svg`),
  surroundingsHref: asset(`cdp/evidence/brixham/location-${number}-replacement-surroundings.svg`),
});
export const replacementPublicNoticeEvidence: Record<number, ReturnType<typeof replacement>> = {
  0: replacement(1),
  3: replacement(4),
};
export const resubmittedLocationIndexes = Object.keys(replacementPublicNoticeEvidence).map(Number);
