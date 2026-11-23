import { Attributes } from "@opentelemetry/api";

/**
 * `AttributeStore` is an interface that provides a way to set and remove global attributes for use in OpenTelemetry spans.
 */
interface AttributeStore {
  /** `setGlobalAttribute` saves a new span attribute key and value to the store */
  setGlobalAttribute: (key: string, value: Attributes[string]) => void;
  /** `removeGlobalAttribute` deletes a span attribute from the store */
  removeGlobalAttribute: (key: string) => void;
  /** `getGlobalAttributes` returns a Record with all of the key/value attributes in the store */
  getGlobalAttributes: () => Attributes;
  /** `getGlobalAttribute` returns a attribute value from the store for a key */
  getGlobalAttribute: (key: string) => Attributes[string];
}

export type { AttributeStore };
