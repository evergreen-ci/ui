import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAnalyticsRoot } from "./useAnalyticsRoot";

// Event names must start with "System Event" prefix per ActionType constraint
type PageVisibilityAction =
  | {
      name: "System Event page visible";
      "visibility.duration_ms": number;
    }
  | {
      name: "System Event page hidden";
      "visibility.duration_ms": number;
    }
  | {
      name: "System Event session started";
      // "hidden" = browser tab/window is in background
      "visibility.initial_state": "visible" | "hidden";
    }
  | {
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
  const { pathname } = useLocation();

  // Track timing information
  const visibilityStartTime = useRef<number>(0);
  const totalVisibleTime = useRef<number>(0);
  const totalHiddenTime = useRef<number>(0);
  const stateChangeCount = useRef<number>(0);
  const lastVisibilityState = useRef<DocumentVisibilityState | null>(null);
  const sessionStarted = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Initialize timing on first mount
    if (visibilityStartTime.current === 0) {
      visibilityStartTime.current = Date.now();
    }
    if (lastVisibilityState.current === null) {
      lastVisibilityState.current = document.visibilityState;
    }

    // Track session start (only once per pathname)
    if (!sessionStarted.current) {
      sessionStarted.current = true;
      sendEvent({
        name: "System Event session started",
        "visibility.initial_state": document.visibilityState as
          | "visible"
          | "hidden",
      });
    }

    const handleVisibilityChange = () => {
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
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Track session end (always send, not just when stateChangeCount > 0)
      const finalDuration = Date.now() - visibilityStartTime.current;

      // Add final duration to appropriate counter
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

      // Reset state for next page/render
      visibilityStartTime.current = 0;
      totalVisibleTime.current = 0;
      totalHiddenTime.current = 0;
      stateChangeCount.current = 0;
      lastVisibilityState.current = null;
      sessionStarted.current = false;
    };
  }, [enabled, sendEvent, minDurationMs, pathname]);

  return {
    isVisible: document.visibilityState === "visible",
  };
};
