import type { AttributeValue } from "@opentelemetry/api";

/**
 * `ActionTypePrefixes` is a union type of all the prefixes that can be used to create an `ActionType`.
 */
type ActionTypePrefixes =
  | "Changed"
  | "Clicked"
  | "Created"
  | "Deleted"
  | "Redirected"
  | "Filtered"
  | "Saved"
  | "Sorted"
  | "Toggled"
  | "Viewed"
  | "Used"
  | "System Event"
  | "Interacted with";

/**
 * `ActionType` is a type that represents an action that can be sent to our analytics provider.
 * @param name - The name of the action to send to our analytics provider
 * @example - { name: "Clicked Button" }
 * @example - { name: "Changed Input" }
 */
export interface ActionType {
  name: `${ActionTypePrefixes}${string}`;
}

/**
 * `sendEvent` is the function call to send an analytics event. It requires an Action
 */
type sendEvent<Action extends ActionType> = (action: Action) => void;

/**
 * `AnalyticsProperties` is an object that represents the properties and additional metadata to send with an event to our analytics provider.
 *
 */
export interface AnalyticsProperties {
  [key: string]: AttributeValue;
}

/**
 * `Analytics` is an object that represents the analytics provider and the function to send an event to the provider.
 */
export interface Analytics<Action extends ActionType> {
  sendEvent: sendEvent<Action>;
}

/**
 * `ExtractAnalyticsSendEvent` is a utility type that can be used to extract the sendEvent function from an analytics hook.
 */
export type ExtractAnalyticsSendEvent<A extends () => Analytics<any>> =
  ReturnType<A>["sendEvent"];
