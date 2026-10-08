// The applicant's site notice locations, as submitted on CDP. Names follow the
// applicant guidance: a place, then where exactly the notice was displayed.
const submitted = [
  ['Teignmouth harbour, noticeboard at the harbour entrance', '18 August 2026'],
  ['Teignmouth Fish Quay, public noticeboard by the quay steps', '18 August 2026'],
  ['Teignmouth Back Beach, sign post at the beach access point', '19 August 2026'],
  ['Teignmouth seafront, lamp post by the Eastcliff promenade entrance', '19 August 2026'],
  ['Teignmouth lifeboat station, noticeboard by the slipway', '19 August 2026'],
  ['Teignmouth harbour office, window by the main door', '19 August 2026'],
  ['Teignmouth New Quay, railings by the pedestrian gate', '20 August 2026'],
  ['Shaldon River Beach, post at the top of the slipway', '20 August 2026'],
  ['Shaldon ferry landing, noticeboard by the ticket kiosk', '20 August 2026'],
  ['The Ness car park, noticeboard by the pay machines', '20 August 2026'],
];

export const publicNoticeEvidenceLocations = submitted.map(([name, date], index) => ({
  name,
  date,
  closeUpHref: `/cdp/evidence/location-${index + 1}-close-up.svg`,
  surroundingsHref: `/cdp/evidence/location-${index + 1}-surroundings.svg`,
}));

export type PublicNoticeEvidenceLocation = (typeof publicNoticeEvidenceLocations)[number];

// MLA/2026/10013: the earlier review, now read-only history. Locations 1 and 5
// were answered No; the rest were accepted.
export const resubmittedPublicNoticeEvidenceReviews = publicNoticeEvidenceLocations.map(
  (_, index) =>
    ({
      0: {
        decision: 'No',
        rejectionComments:
          'The close-up photograph does not clearly show the full notice and the surroundings photograph does not show where it was displayed. Provide clear replacement photographs showing the complete notice and its location.',
      },
      4: {
        decision: 'No',
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
  4: replacement(5),
};
export const resubmittedLocationIndexes = Object.keys(replacementPublicNoticeEvidence).map(Number);
