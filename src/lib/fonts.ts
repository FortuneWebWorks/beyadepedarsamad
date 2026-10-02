import localFont from "next/font/local";

/**
 * Only the three weights the design actually uses are shipped, as woff2 only.
 * Self-hosted through next/font so they are preloaded, hashed, and rendered
 * without a blocking `@import` round-trip.
 */
export const iranSans = localFont({
  src: [
    { path: "../fonts/iranSans/fonts/woff2/IRANSansWeb_Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/iranSans/fonts/woff2/IRANSansWeb.woff2", weight: "400", style: "normal" },
    { path: "../fonts/iranSans/fonts/woff2/IRANSansWeb_Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-iran",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
  // Persian web fonts have no usable Latin metrics; auto-adjusting would clip.
  adjustFontFallback: false,
});

/**
 * Persian-digit variant (۰۱۲۳). Kept to a single weight, not preloaded — it is
 * only used for small numerals well below the fold.
 */
export const iranSansFaNum = localFont({
  src: [
    { path: "../fonts/iranSans/numbers/fonts/woff2/IRANSansWeb(FaNum).woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-iran-fanum",
  display: "swap",
  fallback: ["Tahoma", "system-ui", "sans-serif"],
  preload: false,
  adjustFontFallback: false,
});
