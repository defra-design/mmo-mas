import { NOT_ACCEPTED } from '../../utils/publicNoticeEvidence';

// The applicant's site notice locations, as submitted on CDP. Names follow the
// applicant guidance: a place, then where exactly the notice was displayed.
// The places are illustrative English coastal locations.
const submitted = [
  ['Whitby harbour, noticeboard by the swing bridge', '18 August 2026'],
  ['Brixham Fish Quay, public noticeboard by the market entrance', '18 August 2026'],
  ['Padstow harbour, sign post by the north quay steps', '19 August 2026'],
  ['Scarborough lifeboat station, noticeboard by the slipway', '19 August 2026'],
];

export const publicNoticeEvidenceLocations = submitted.map(([name, date], index) => ({
  name,
  date,
  closeUpHref: `/cdp/evidence/location-${index + 1}-close-up.svg`,
  surroundingsHref: `/cdp/evidence/location-${index + 1}-surroundings.svg`,
}));

export type PublicNoticeEvidenceLocation = (typeof publicNoticeEvidenceLocations)[number];

// MLA/2026/10013: the earlier review, now read-only history. Locations 1 and 4
// were not accepted; the rest were accepted.
export const resubmittedPublicNoticeEvidenceReviews = publicNoticeEvidenceLocations.map(
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
  submittedDate: '27 August 2026',
  closeUpHref: `/cdp/evidence/location-${number}-replacement-close-up.svg`,
  surroundingsHref: `/cdp/evidence/location-${number}-replacement-surroundings.svg`,
});
export const replacementPublicNoticeEvidence: Record<number, ReturnType<typeof replacement>> = {
  0: replacement(1),
  3: replacement(4),
};
export const resubmittedLocationIndexes = Object.keys(replacementPublicNoticeEvidence).map(Number);
