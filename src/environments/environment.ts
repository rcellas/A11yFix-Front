/**
 * Development environment stub.
 *
 * This file is committed to the repository as a SAFE stub — it contains
 * no real credentials or secrets. It exists so TypeScript can resolve
 * the import path during CI type-checking (`tsc --noEmit`).
 *
 * In production Vercel builds:
 *   - `scripts/generate-env.js` generates `environment.prod.ts` from the
 *     `NG_API_URL` environment variable set in the Vercel dashboard.
 *   - `angular.json` fileReplacements swaps this file for `environment.prod.ts`.
 */
export const environment = {
  production: false,
  /** Overridden by environment.prod.ts in production via angular.json fileReplacements. */
  apiUrl: 'http://localhost:3000'
};
