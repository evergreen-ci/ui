import { useCallback, useMemo } from "react";
import { Analytics, ActionType, AnalyticsObject } from "./types";
import { addPageAction } from "./utils";

/**
 * `useAnalyticsRoot` is a hook that returns a function to send an event to our analytics provider
 * @param object - The analytics object to send with the event this is typically the page name or component name we are tracking
 * @returns - The sendEvent function to send an event to our analytics provider
 */
export const useAnalyticsRoot = <Action extends ActionType>(
  object: AnalyticsObject,
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      addPageAction<Action>(action, { object });
    },
    [object],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
