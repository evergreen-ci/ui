import { AttributeValue } from "@opentelemetry/api";

interface OpenTelemetryGlobalAttributeWindowProvider {
  /** `setGlobalAttribute` saves a new span attribute key and value to the store */
  setGlobalAttribute: (key: string, value: AttributeValue) => void;
  /** `removeGlobalAttribute` deletes a span attribute from the store */
  removeGlobalAttribute: (key: string) => void;
  /** `getGlobalAttributes` returns a Record with all of the key/value attributes in the store */
  getGlobalAttributes: () => Record<string, AttributeValue>;
  /** `getGlobalAttribute` returns a attribute value from the store for a key */
  getGlobalAttribute: (key: string) => AttributeValue | undefined;
}

export type { OpenTelemetryGlobalAttributeWindowProvider };
