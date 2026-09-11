import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * -----------------------------------------------------------------------------
 * Ensures that whenever a user navigates or is redirected to a new route in the SPA,
 * the window and document scroll positions are immediately reset to (0, 0).
 *
 * Prevents the common React Router issue where the previous scroll offset
 * is retained or starts halfway down the page on redirect.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Disable browser's default scroll restoration so it doesn't fight route transitions
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // If an anchor hash exists (e.g. /page#section), scroll to that element
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // For all page navigations and redirects: immediately snap to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Also check any main container
    const mainEl = document.querySelector("main");
    if (mainEl && mainEl.scrollTop > 0) {
      mainEl.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}
