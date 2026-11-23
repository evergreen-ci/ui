import { Attributes } from "@opentelemetry/api";
import { AttributeStore } from "./types";

/**
 * OpenTelemetryAttributeStore is a class that provides a way to set and remove global attributes
 * for OpenTelemetry in the window object.
 * We can use this to add global attributes to all spans and traces
 */
class OpenTelemetryAttributeStore implements AttributeStore {
  private attributesMap: Map<string, Attributes[string]>;

  constructor() {
    this.attributesMap = new Map();
  }

  setGlobalAttribute(key: string, value: Attributes[string]): void {
    this.attributesMap.set(key, value);
  }

  removeGlobalAttribute(key: string): void {
    this.attributesMap.delete(key);
  }

  getGlobalAttributes(): Attributes {
    const attributes: Attributes = {};
    this.attributesMap.forEach((value, key) => {
      attributes[key] = value;
    });
    return attributes;
  }

  getGlobalAttribute(key: string): Attributes[string] {
    return this.attributesMap.get(key);
  }
}

export { OpenTelemetryAttributeStore };
