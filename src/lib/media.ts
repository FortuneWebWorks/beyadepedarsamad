/**
 * Google Drive serves resized media from lh3.googleusercontent.com. Requesting
 * that host directly (rather than /thumbnail?id=) skips a 302 round-trip and
 * lets us pick exact widths, so we can build real `srcSet`s.
 */
const CDN = "https://lh3.googleusercontent.com/d";

export function driveImage(id: string, width: number, height?: number): string {
  const size = height ? `w${width}-h${height}` : `w${width}`;
  return `${CDN}/${id}=${size}`;
}

/**
 * Full-resolution original, for the lightbox.
 */
export function driveImageFull(id: string): string {
  return `${CDN}/${id}=s0`;
}

/**
 * A responsive `srcSet` across the widths the layouts actually use.
 */
export function driveSrcSet(id: string, widths: number[], height?: number): string {
  return widths.map((w) => `${driveImage(id, w, height)} ${w}w`).join(", ");
}

/*
 * There used to be a `driveVideoEmbed` helper here, building an iframe URL for
 * Google's file preview. It is gone on purpose: that player accepts no external
 * commands, so `enablejsapi=1` + postMessage `playVideo`/`pauseVideo`/
 * `setCurrentTime` were silently ignored and the page could offer visitors no
 * play/pause, seek, volume or fullscreen of its own. The clips are transcoded
 * and served from `public/videos` instead, which is what makes those controls
 * (and keyboard access) possible. See the note on VideoItem in content.ts.
 */
