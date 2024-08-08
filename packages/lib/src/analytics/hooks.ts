import { useCallback, useMemo } from "react";
import {
  Analytics,
  ActionType,
  AnalyticsObject,
  AnalyticsProperties,
} from "./types";
import { addNewRelicPageAction } from "./utils";

/**
 * `useAnalyticsRoot` is a hook that returns a function to send an event to our analytics provider
 * @param object - The analytics object to send with the event this is typically the page name or component name we are tracking
 * @param attributes - The additional properties that will be passed into our analytics event.
 * @returns - The sendEvent function to send an event to our analytics provider
 */
export const useAnalyticsRoot = <
  Action extends ActionType,
  Object extends AnalyticsObject,
>(
  object: Object,
  attributes: AnalyticsProperties = {},
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      addNewRelicPageAction<Action>(action, { object, ...attributes });
    },
    [object, attributes],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
