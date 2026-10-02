/**
 * Every piece of copy and every media reference on the page lives here.
 *
 * ✍️  EDITING GUIDE
 *  - `title` fields are used for visible captions *and* alt/aria text, so
 *    screen-reader users get the same description sighted users do.
 *  - Media ids are Google Drive file ids. To swap a file: upload it to Drive,
 *    set sharing to "anyone with the link", copy the id out of the URL, and
 *    paste it below. Nothing else needs to change.
 */

/** Public URL of the live site — used for canonical + Open Graph tags. */
export const SITE_URL = "https://yadegarepedar.ir";

export const memorial = {
  /** Small label above the name. */
  kicker: "یادگاری",
  /** The person's name. */
  name: "حاج صمد هاشمی",
  /** One line under the name. Keep it short. */
  tagline: "به یادِ مردی که نامش نکویی بود",
  /** Closing line at the very bottom of the page. */
  footerNote: "با مهر و احترام",
  /** Persian digits version of `name`, used in the page title bar. */
  documentTitle: "یادگاری حاج صمد هاشمی",
  description:
    "گنجینه‌ای از صداها، فیلم‌ها و تصاویر ماندگار حاج صمد هاشمی؛ مجموعه‌ای از خاطرات خانوادگی برای یادِ همیشگی.",
};

export const poem = {
  lines: [
    "سعدیا مرد نکونام نمیرد هرگز",
    "مرده آن است که نامش به نکویی نبرند",
  ],
  author: "سعدی",
};

export type VoiceItem = {
  id: string;
  src: string;
  title: string;
};

export type MediaItem = {
  id: string;
  title: string;
};

/**
 * A playable clip.
 *
 * `src`/`poster` point at files in `public/videos`, not at Google Drive. The
 * Drive preview embed was dropped because it exposes no scriptable controls:
 * posting `playVideo`/`pauseVideo`/`setCurrentTime` to it with `enablejsapi=1`
 * produced no reaction, so there was no way to give visitors play/pause,
 * seeking, volume or fullscreen from the page itself. Serving the files
 * directly also removes the Drive rate-limiting that made thumbnails flaky.
 *
 * To swap a clip: replace the file in `public/videos/`, keep the name, and
 * update `src`/`poster` below. Re-encoding keeps these web-friendly:
 *
 *   ffmpeg -i in.mov -vf "scale='min(1280,iw)':-2 \
 *     -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset veryslow \
 *     -c:a aac -b:a 96k -ac 2 -movflags +faststart out.mp4
 *
 * The originals were HEVC, which Safari plays but Chrome and Firefox do not —
 * the H.264 encode is what makes this work cross-browser.
 */
export type VideoItem = {
  id: string;
  title: string;
  src: string;
  poster: string;
  /** Intrinsic pixel size, handed to the <video> element so the browser
   *  reserves the correct box before metadata arrives. Without it the grid
   *  reflows as each clip reports its size, and portrait footage that is
   *  forced into a fixed ratio gets letterboxed. */
  width: number;
  height: number;
};

export const voices: VoiceItem[] = [
  { id: "voice-1", src: "/voice.m4a", title: "یادگاری صوتی نخست" },
  { id: "voice-2", src: "/voice2.m4a", title: "یادگاری صوتی دوم" },
];

export const videos: VideoItem[] = [
  {
    id: "14bkWbO93H4ft-fKcfvj6oHDj--KbZlDW",
    title: "خاطرهٔ تصویری یکم",
    src: "/videos/memorial-1.mp4",
    poster: "/videos/memorial-1.jpg",
    width: 1280,
    height: 958,
  },
  {
    id: "16nx3O3voipyC0iGKhAEqxJVNTmmClVFa",
    title: "خاطرهٔ تصویری دوم",
    src: "/videos/memorial-2.mp4",
    poster: "/videos/memorial-2.jpg",
    width: 464,
    height: 832,
  },
  {
    id: "1mYNM8YOoGaRumhw2ubsrGKlIGNEEB-MA",
    title: "خاطرهٔ تصویری سوم",
    src: "/videos/memorial-3.mp4",
    poster: "/videos/memorial-3.jpg",
    width: 1080,
    height: 1350,
  },
  {
    id: "1aauOcjXU02GcsBxdCf4jnmlEMdqiQKjv",
    title: "خاطرهٔ تصویری چهارم",
    src: "/videos/memorial-4.mp4",
    poster: "/videos/memorial-4.jpg",
    width: 1080,
    height: 1346,
  },
];

export const photos: MediaItem[] = [
  { id: "1bEMY-G9XdkuL6CrLtiFpgnHcrZpLo43Z", title: "تصویر یادگاری یکم" },
  { id: "10Ivr--92SBo0Hf8F4MGFttK1h3IBaKL7", title: "تصویر یادگاری دوم" },
  { id: "1Y8Lu4b29JPWhmwnvQpe1TY0BFe7pzF0-", title: "تصویر یادگاری سوم" },
];

/** Section labels, rendered as numbered headings. */
export const sections = {
  poem: { index: "۰۱", title: "سخنِ ماندگار" },
  voices: { index: "۰۲", title: "صدای یادگاری" },
  videos: { index: "۰۳", title: "خاطرات تصویری" },
  photos: { index: "۰۴", title: "گنجینهٔ تصاویر" },
};
