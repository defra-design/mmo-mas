// Resolve a static asset path (public/ file) against Vite's base URL.
//
// At the domain root the base is '/', so this is a no-op. When an iteration is
// frozen with `vite build --base=/iteration-N/`, the base becomes '/iteration-N/'
// and every asset resolves to that snapshot's own copy of cdp/, images/ and
// documents/ — rather than the live app at the domain root. This is what makes a
// frozen iteration self-contained; do not hard-code '/cdp/...' or '/images/...'.
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
