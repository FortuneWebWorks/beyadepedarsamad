"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

// Subscribing to the DOM rather than mirroring it into state avoids the
// setState-in-effect cycle, and keeps the button correct if the theme is
// changed from anywhere else on the page.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

// Server render has no <html data-theme>; assume light, which is what the
// inline script in the layout resolves to for most visitors anyway.
function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Private browsing — the choice just won't persist.
  }
}

/** Toggles `data-theme` on <html> and persists the choice. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "روشن کردن پس‌زمینه" : "تاریک کردن پس‌زمینه"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className={`grid size-10 place-items-center rounded-full border border-line bg-bg-elev/70 text-ink-soft backdrop-blur-md transition-[color,border-color,background-color,transform] duration-300 hover:border-accent/45 hover:text-accent active:scale-92 ${className}`}
    >
      <span className="relative block size-4.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          aria-hidden
          className={`absolute inset-0 size-full transition-[opacity,transform] duration-500 ${
            isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`absolute inset-0 size-full transition-[opacity,transform] duration-500 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          }`}
        >
          <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1Z" />
        </svg>
      </span>
    </button>
  );
}
