import { useEffect, useRef } from "react";
import { useAnalyticsRoot } from "./useAnalyticsRoot";

type PageVisibilityAction =
  | {
      name: "System Event page became visible";
      "visibility.duration_hidden_ms": number;
      "visibility.timestamp": string;
    }
  | {
      name: "System Event page became hidden";
      "visibility.duration_visible_ms": number;
      "visibility.timestamp": string;
    }
  | {
      name: "System Event page visibility session started";
      "visibility.initial_state": "visible" | "hidden";
      "visibility.timestamp": string;
    }
  | {
      name: "System Event page visibility session ended";
      "visibility.total_visible_ms": number;
      "visibility.total_hidden_ms": number;
      "visibility.state_changes": number;
      "visibility.timestamp": string;
    };

interface UsePageVisibilityAnalyticsOptions {
  /**
   * The identifier for the page or component being tracked
   */
  identifier: string;
  /**
   * Additional attributes to include with every event
   */
  attributes?: Record<string, string | number | boolean>;
  /**
   * Whether to track the visibility changes
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to track session start/end events
   * @default true
   */
  trackSession?: boolean;
  /**
   * Minimum duration in milliseconds before tracking a visibility change
   * Helps avoid tracking rapid tab switches
   * @default 1000
   */
  minDuration?: number;
}

/**
 * Hook that tracks page visibility changes and sends analytics events
 * @param options Configuration options for the visibility tracking
 * @param options.identifier The identifier for the page or component being tracked
 * @param options.attributes Additional attributes to include with every event
 * @param options.enabled Whether to track the visibility changes
 * @param options.trackSession Whether to track session start/end events
 * @param options.minDuration Minimum duration in milliseconds before tracking a visibility change
 * @returns Object with current visibility state and manual tracking methods
 * @example
 * ```typescript
 * const { isVisible } = usePageVisibilityAnalytics({
 *   identifier: "Dashboard",
 *   attributes: { "page.section": "overview" }
 * });
 * ```
 */
export const usePageVisibilityAnalytics = ({
  attributes = {},
  enabled = true,
  identifier,
  minDuration = 1000,
  trackSession = true,
}: UsePageVisibilityAnalyticsOptions) => {
  const { sendEvent } = useAnalyticsRoot<PageVisibilityAction, string>(
    identifier,
    attributes,
  );

  // Track timing information
  const visibilityStartTime = useRef<number>(0);
  const totalVisibleTime = useRef<number>(0);
  const totalHiddenTime = useRef<number>(0);
  const stateChangeCount = useRef<number>(0);
  const lastVisibilityState = useRef<DocumentVisibilityState | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize timing on first mount
    if (visibilityStartTime.current === 0) {
      visibilityStartTime.current = Date.now();
    }
    if (lastVisibilityState.current === null) {
      lastVisibilityState.current = document.visibilityState;
    }

    // Track session start
    if (trackSession) {
      sendEvent({
        name: "System Event page visibility session started",
        "visibility.initial_state": document.visibilityState as
          | "visible"
          | "hidden",
        "visibility.timestamp": new Date().toISOString(),
      });
    }

    const handleVisibilityChange = () => {
      const currentTime = Date.now();
      const duration = currentTime - visibilityStartTime.current;
      const timestamp = new Date().toISOString();

      // Only track if duration exceeds minimum threshold
      if (duration < minDuration) {
        visibilityStartTime.current = currentTime;
        return;
      }

      stateChangeCount.current += 1;

      if (document.visibilityState === "visible") {
        // Page became visible
        totalHiddenTime.current += duration;
        sendEvent({
          name: "System Event page became visible",
          "visibility.duration_hidden_ms": duration,
          "visibility.timestamp": timestamp,
        });
      } else {
        // Page became hidden
        totalVisibleTime.current += duration;
        sendEvent({
          name: "System Event page became hidden",
          "visibility.duration_visible_ms": duration,
          "visibility.timestamp": timestamp,
        });
      }

      lastVisibilityState.current = document.visibilityState;
      visibilityStartTime.current = currentTime;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Track session end
      if (trackSession && stateChangeCount.current > 0) {
        const finalDuration = Date.now() - visibilityStartTime.current;

        // Add final duration to appropriate counter
        if (lastVisibilityState.current === "visible") {
          totalVisibleTime.current += finalDuration;
        } else {
          totalHiddenTime.current += finalDuration;
        }

        sendEvent({
          name: "System Event page visibility session ended",
          "visibility.total_visible_ms": totalVisibleTime.current,
          "visibility.total_hidden_ms": totalHiddenTime.current,
          "visibility.state_changes": stateChangeCount.current,
          "visibility.timestamp": new Date().toISOString(),
        });
      }
    };
  }, [enabled, sendEvent, trackSession, minDuration]);

  return {
    isVisible: document.visibilityState === "visible",
  };
};
