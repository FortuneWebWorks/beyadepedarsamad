import type { Metadata, Viewport } from "next";
import { iranSans, iranSansFaNum } from "@/lib/fonts";
import { memorial, SITE_URL } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: memorial.documentTitle,
  description: memorial.description,
  applicationName: memorial.documentTitle,
  keywords: ["یادگاری", "حاج صمد هاشمی", "خاطره", "خانواده", "yadegar"],
  authors: [{ name: memorial.name }],
  creator: memorial.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: memorial.documentTitle,
    title: memorial.documentTitle,
    description: memorial.description,
  },
  twitter: {
    card: "summary",
    title: memorial.documentTitle,
    description: memorial.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

/**
 * Resolves the saved theme before first paint. Without this the page renders
 * light, then snaps to dark on hydration.
 */
const themeInit = `(function(){try{var s=localStorage.getItem("theme");var d=document.documentElement;d.dataset.theme=s==="dark"||s==="light"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){document.documentElement.dataset.theme="light"}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Warm up the connection to the two CDNs this page depends on. */}
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="" />
        <link rel="preconnect" href="https://drive.google.com" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${iranSans.variable} ${iranSansFaNum.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-accent-contrast focus:shadow-lift"
        >
          پرش به محتوای اصلی
        </a>
        {children}
      </body>
    </html>
  );
}
