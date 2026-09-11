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
