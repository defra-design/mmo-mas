export const publicNoticeEvidenceLocations = [
  {
    name: 'Teignmouth Harbour entrance noticeboard',
    date: '18 August 2026',
    closeUpHref: '/cdp/evidence/location-1-close-up.svg',
    surroundingsHref: '/cdp/evidence/location-1-surroundings.svg',
  },
  {
    name: 'Fish Quay public noticeboard',
    date: '18 August 2026',
    closeUpHref: '/cdp/evidence/location-2-close-up.svg',
    surroundingsHref: '/cdp/evidence/location-2-surroundings.svg',
  },
  {
    name: 'Back Beach access point',
    date: '19 August 2026',
    closeUpHref: '/cdp/evidence/location-3-close-up.svg',
    surroundingsHref: '/cdp/evidence/location-3-surroundings.svg',
  },
];

export type PublicNoticeEvidenceLocation = (typeof publicNoticeEvidenceLocations)[number];

export const resubmittedPublicNoticeEvidenceReviews = [
  {
    decision: 'No',
    rejectionComments:
      'The close-up photograph does not clearly show the full notice and the surroundings photograph does not show where it was displayed. Provide clear replacement photographs showing the complete notice and its location.',
  },
  { decision: 'Yes', rejectionComments: '' },
  { decision: 'Yes', rejectionComments: '' },
];

export const replacementPublicNoticeEvidence = {
  submittedDate: '27 August 2026',
  closeUpHref: '/cdp/evidence/location-1-replacement-close-up.svg',
  surroundingsHref: '/cdp/evidence/location-1-replacement-surroundings.svg',
};
