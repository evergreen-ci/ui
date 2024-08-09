import { useCallback, useMemo } from "react";
import {
  Analytics,
  ActionType,
  AnalyticsProperties,
  AnalyticsIdentifier,
} from "./types";
import { addNewRelicPageAction } from "./utils";

/**
 * `useAnalyticsRoot` is a hook that returns a function to send an event to our analytics provider
 * @param identifier - The identifier to send with the event this is typically the page name or component name we are tracking
 * @param attributes - The additional properties that will be passed into our analytics event.
 * @returns - The sendEvent function to send an event to our analytics provider
 */
export const useAnalyticsRoot = <
  Action extends ActionType,
  Identifier extends AnalyticsIdentifier,
>(
  identifier: Identifier,
  attributes: AnalyticsProperties = {},
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      addNewRelicPageAction<Action>(action, {
        // Map the identifier and attributes to the object field to maintain backwards compatibility
        // with the previous implementation of the analytics provider
        object: identifier,
        ...attributes,
      });
    },
    [identifier, attributes],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
