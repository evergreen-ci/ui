import type { AttributeValue } from "@opentelemetry/api";

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

export interface ActionType {
  name: `${ActionTypePrefixes}${string}`;
}

export interface Properties {
  [key: string]: AttributeValue | undefined;
}

export interface RequiredProperties<T> {
  object: T;
}
