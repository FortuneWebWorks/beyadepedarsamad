/**
 * Small presentation helpers shared across components.
 *
 * This lives in `lib` rather than inside a component file so the audio player
 * and its scrub bar can both use it without importing each other.
 */

/** m:ss, and --:-- while the browser is still reading the file's metadata. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
