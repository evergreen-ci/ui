import { useCallback, useMemo } from "react";
import { Analytics, ActionType, AnalyticsProperties } from "./types";
import { sendEventTrace } from "./utils";

/**
 *
 * This is simply a clever named type to help with the typing of the `useAnalyticsRoot` hook.
 * `AnalyticsIdentifier` is a string that represents the object to send with an event to our analytics provider.
 * @example - "Page Name"
 * @example - "Component Name"
 */
type AnalyticsIdentifier = string;

/**
 * `useAnalyticsRoot` is a hook that returns a function to send an event to our analytics provider
 * @param analyticsIdentifier - The identifier to send with the event this is typically the page name or component name we are tracking
 * @param attributes - The additional properties that will be passed into our analytics event.
 * @returns - The sendEvent function to send an event to our analytics provider
 */
export const useAnalyticsRoot = <
  Action extends ActionType,
  Identifier extends AnalyticsIdentifier,
>(
  analyticsIdentifier: Identifier,
  attributes: AnalyticsProperties = {},
): Analytics<Action> => {
  const sendEvent: Analytics<Action>["sendEvent"] = useCallback(
    (action) => {
      sendEventTrace(action, {
        "analytics.identifier": analyticsIdentifier,
        ...attributes,
      });
    },
    [analyticsIdentifier, attributes],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
