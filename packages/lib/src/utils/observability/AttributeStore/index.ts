import { AttributeValue } from "@opentelemetry/api";
import { AttributeStore } from "./types";

/**
 * OpenTelemetryAttributeStore is a class that provides a way to set and remove global attributes
 * for OpenTelemetry in the window object.
 * We can use this to add global attributes to all spans and traces
 */
class OpenTelemetryAttributeStore implements AttributeStore {
  private attributesMap: Map<string, AttributeValue>;

  constructor() {
    this.attributesMap = new Map();
  }

  setGlobalAttribute(key: string, value: AttributeValue): void {
    this.attributesMap.set(key, value);
  }

  removeGlobalAttribute(key: string): void {
    const value = this.attributesMap.get(key);
    if (value) {
      this.attributesMap.delete(key);
    }
  }

  getGlobalAttributes(): Record<string, AttributeValue> {
    const attributes: Record<string, AttributeValue> = {};
    this.attributesMap.forEach((value, key) => {
      attributes[key] = value;
    });
    return attributes;
  }

  getGlobalAttribute(key: string): AttributeValue | undefined {
    return this.attributesMap.get(key);
  }
}

export { OpenTelemetryAttributeStore };
