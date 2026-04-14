import { useEffect, useMemo, useRef } from "react";
import { useAnalyticsRoot } from "./useAnalyticsRoot";

// Event names must start with "System Event" prefix per ActionType constraint
type PageVisibilityAction =
  | {
      // Fired when the user returns to the page (e.g. switches back to this tab).
      // duration_ms is how long the page was hidden before becoming visible.
      name: "System Event page visible";
      "visibility.duration_ms": number;
    }
  | {
      // Fired when the user leaves the page (e.g. switches tabs, minimizes window).
      // duration_ms is how long the page was visible before being hidden.
      name: "System Event page hidden";
      "visibility.duration_ms": number;
    }
  | {
      // Fired once on mount. Captures whether the page was already visible or
      // hidden (e.g. opened in a background tab) when the user first arrived.
      name: "System Event session started";
      // "hidden" = browser tab/window is in background
      "visibility.initial_state": "visible" | "hidden";
    }
  | {
      // Fired on unmount (navigation away, page unload, etc.).
      // Summarizes total visible/hidden time and number of visibility changes
      // that exceeded the minDurationMs threshold for the entire session.
      name: "System Event session ended";
      "visibility.total_visible_ms": number;
      "visibility.total_hidden_ms": number;
      "visibility.visibility_changes": number;
    };

interface PageVisibilityAnalyticsOptions {
  attributes?: Record<string, string | number | boolean>;
  enabled?: boolean;
  minDurationMs?: number;
}

export const usePageVisibilityAnalytics = ({
  attributes,
  enabled = true,
  minDurationMs = 1000,
}: PageVisibilityAnalyticsOptions = {}) => {
  // Memoize attributes to prevent sendEvent recreation on every render
  const stableAttributes = useMemo(
    () => attributes,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(attributes)],
  );

  const { sendEvent } = useAnalyticsRoot<PageVisibilityAction, string>(
    "PageVisibility",
    stableAttributes,
  );

  // Track timing information
  const visibilityStartTime = useRef<number>(0);
  const totalVisibleTime = useRef<number>(0);
  const totalHiddenTime = useRef<number>(0);
  const stateChangeCount = useRef<number>(0);
  const lastVisibilityState = useRef<DocumentVisibilityState | null>(null);
  const sessionStarted = useRef(false);
  const sessionEnded = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const initSession = () => {
      visibilityStartTime.current = Date.now();
      lastVisibilityState.current = document.visibilityState;
      sessionStarted.current = true;
      sendEvent({
        name: "System Event session started",
        "visibility.initial_state": document.visibilityState as
          | "visible"
          | "hidden",
      });
    };

    initSession();

    const sendSessionEnded = () => {
      // Guard against double-firing (visibilitychange + React cleanup can both run)
      if (sessionEnded.current) return;
      sessionEnded.current = true;

      const finalDuration = Date.now() - visibilityStartTime.current;

      if (lastVisibilityState.current === "visible") {
        totalVisibleTime.current += finalDuration;
      } else {
        totalHiddenTime.current += finalDuration;
      }

      try {
        sendEvent({
          name: "System Event session ended",
          "visibility.total_visible_ms": totalVisibleTime.current,
          "visibility.total_hidden_ms": totalHiddenTime.current,
          "visibility.visibility_changes": stateChangeCount.current,
        });
      } catch {
        // Silently ignore analytics errors
      }

      // Reset state so a new session can start if the tab becomes visible again
      visibilityStartTime.current = 0;
      totalVisibleTime.current = 0;
      totalHiddenTime.current = 0;
      stateChangeCount.current = 0;
      lastVisibilityState.current = null;
      sessionStarted.current = false;
      sessionEnded.current = false;
    };

    const handleVisibilityChange = () => {
      // If the tab became visible again after a session ended (e.g. user
      // switched away and back), start a fresh session.
      if (document.visibilityState === "visible" && !sessionStarted.current) {
        initSession();
        return;
      }

      const currentTime = Date.now();
      const duration = currentTime - visibilityStartTime.current;

      // Always accumulate time, even for short durations
      if (document.visibilityState === "visible") {
        totalHiddenTime.current += duration;
      } else {
        totalVisibleTime.current += duration;
      }

      // Only send individual event if duration exceeds minimum threshold
      if (duration >= minDurationMs) {
        stateChangeCount.current += 1;

        if (document.visibilityState === "visible") {
          sendEvent({
            name: "System Event page visible",
            "visibility.duration_ms": duration,
          });
        } else {
          sendEvent({
            name: "System Event page hidden",
            "visibility.duration_ms": duration,
          });
        }
      }

      lastVisibilityState.current = document.visibilityState;
      visibilityStartTime.current = currentTime;

      // visibilitychange to "hidden" is the primary session-end signal.
      // It fires earlier than pagehide and is the most reliable moment in
      // Chrome to export a span before the page is frozen (bfcache) or discarded.
      if (document.visibilityState === "hidden") {
        sendSessionEnded();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // For SPA navigation: the component unmounts while the page is still
      // visible, so visibilitychange never fires. Cleanup handles it instead.
      sendSessionEnded();
    };
  }, [enabled, sendEvent, minDurationMs]);

  return {
    isVisible: document.visibilityState === "visible",
  };
};
