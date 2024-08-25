import { AttributeValue } from "@opentelemetry/api";

interface OpenTelemetryGlobalAttributeWindowProvider {
  globalAttributes: Set<AttributeValue>;
  setGlobalAttribute: (key: string, value: AttributeValue) => void;
  removeGlobalAttribute: (key: string) => void;
  getGlobalAttributes: () => Record<string, AttributeValue>;
  getGlobalAttribute: (key: string) => AttributeValue | undefined;
}

export type { OpenTelemetryGlobalAttributeWindowProvider };
