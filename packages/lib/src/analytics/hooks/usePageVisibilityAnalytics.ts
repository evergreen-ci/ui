import { useEffect, useMemo, useRef } from "react";
import { RouteConfig } from "../../utils/observability/ReactRouterSpanProcessor/types";
import { calculateRouteName } from "../../utils/observability/ReactRouterSpanProcessor/utils";
import { useAnalyticsRoot } from "./useAnalyticsRoot";

// Event names must start with "System Event" prefix per ActionType constraint
type Action =
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
    }
  | {
      // Foreground time on a route, flushed on tab-hide, navigation, or unmount.
      // A backgrounded-then-resumed visit emits one event per segment.
      name: "System Event route active";
      "visibility.duration_ms": number;
      "page.route_name": string;
    };

interface PageVisibilityAnalyticsOptions {
  attributes?: Record<string, string | number | boolean>;
  enabled?: boolean;
  minDurationMs?: number;
  // Together enable per-route active-duration tracking.
  pathname?: string;
  routeConfig?: RouteConfig;
}

export const usePageVisibilityAnalytics = ({
  attributes,
  enabled = true,
  minDurationMs = 1000,
  pathname,
  routeConfig,
}: PageVisibilityAnalyticsOptions = {}) => {
  // Memoize attributes to prevent sendEvent recreation on every render
  const stableAttributes = useMemo(
    () => attributes,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(attributes)],
  );

  const { sendEvent } = useAnalyticsRoot<Action, string>(
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
      visibilityStartTime.current = performance.now();
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

      const finalDuration = performance.now() - visibilityStartTime.current;

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

      const currentTime = performance.now();
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

  // Flush foreground time for the current route when it is left. Emitting on
  // "hidden" (not just on cleanup) captures tab close/refresh/bfcache, where
  // React cleanup never runs. Route name is set explicitly because on navigation
  // the span processor would otherwise stamp the destination route.
  useEffect(() => {
    if (!enabled || !pathname || !routeConfig) {
      return;
    }

    const routeName =
      calculateRouteName(pathname, routeConfig)?.name ?? pathname;

    let activeMs = 0;
    let resumeTime: number | null =
      document.visibilityState === "visible" ? performance.now() : null;

    const emitActiveDuration = () => {
      if (resumeTime !== null) {
        activeMs += performance.now() - resumeTime;
        resumeTime = null;
      }
      if (activeMs >= minDurationMs) {
        sendEvent({
          name: "System Event route active",
          "visibility.duration_ms": activeMs,
          "page.route_name": routeName,
        });
        // Reset so a later flush can't double-count already-emitted time.
        activeMs = 0;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resumeTime = performance.now();
      } else {
        emitActiveDuration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      emitActiveDuration();
    };
  }, [enabled, pathname, routeConfig, sendEvent, minDurationMs]);

  return {
    isVisible: document.visibilityState === "visible",
  };
};
