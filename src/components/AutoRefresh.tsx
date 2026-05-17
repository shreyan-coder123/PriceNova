"use client";

import { useEffect } from "react";

/**
 * Component that reloads the page every 15 seconds to simulate real-time data updates,
 * as requested to make the site feel like a "live" app.
 * It includes safety checks to avoid refreshing while the user is typing or a modal is open.
 */
export function AutoRefresh() {
  useEffect(() => {
    const interval = setInterval(() => {
      // Safety check: Don't refresh if the user is typing or if a modal/dialog is open
      // This prevents the refresh from clearing the user's payment info or search query while typing
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      const isModalOpen = document.querySelector('[role="dialog"]');

      if (!isInputFocused && !isModalOpen) {
        window.location.reload();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
