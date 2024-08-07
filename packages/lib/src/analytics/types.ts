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
  | "System Event";

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
 * `AnalyticsProperties` is an object that represents the properties and additional metadata to send with an event to our analytics provider.
 */
export interface AnalyticsProperties {
  [key: string]: string | number;
}

/**
 * `AnalyticsObject` is a string that represents the object to send with an event to our analytics provider.
 * @example - "Page Name"
 * @example - "Component Name"
 */
export type AnalyticsObject = string;

/**
 * `Analytics` is an object that represents the analytics provider and the function to send an event to the provider.
 */
export interface Analytics<Action extends ActionType> {
  sendEvent: (action: Action) => void;
}
