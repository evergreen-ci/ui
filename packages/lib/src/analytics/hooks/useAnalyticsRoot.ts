import { useCallback, useEffect, useMemo, useRef } from "react";
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
const EMPTY_ATTRIBUTES: AnalyticsProperties = {};

export const useAnalyticsRoot = <
  Action extends ActionType,
  Identifier extends AnalyticsIdentifier,
>(
  analyticsIdentifier: Identifier,
  attributes: AnalyticsProperties = EMPTY_ATTRIBUTES,
): Analytics<Action> => {
  const identifierRef = useRef(analyticsIdentifier);
  const attributesRef = useRef(attributes);

  useEffect(() => {
    identifierRef.current = analyticsIdentifier;
    attributesRef.current = attributes;
  });

  const sendEvent: Analytics<Action>["sendEvent"] = useCallback((action) => {
    sendEventTrace(action, {
      "analytics.identifier": identifierRef.current,
      ...attributesRef.current,
    });
  }, []);

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
