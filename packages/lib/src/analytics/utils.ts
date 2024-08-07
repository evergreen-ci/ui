import { parseQueryString } from "utils/query-string";
import { ActionType, AnalyticsProperties } from "./types";

/**
 * `addPageAction` is a function that sends an event to our analytics provider
 * @param action - The action to send to our analytics provider
 * @param action.name - The name of the action to send to our analytics provider
 * @param properties - The properties to send with the event
 */
export const addPageAction = <A extends ActionType>(
  { name, ...actionProps }: A,
  properties: AnalyticsProperties,
) => {
  const { newrelic } = window;
  const { search } = window.location;
  const attributesToSend = {
    ...properties,
    ...parseQueryString(search),
    ...actionProps,
  };

  if (typeof newrelic !== "object") {
    // These will only print when new relic is not available such as during local development
    console.log("ANALYTICS EVENT ", { name, attributesToSend });
    return;
  }

  newrelic.addPageAction(name, attributesToSend);
};
