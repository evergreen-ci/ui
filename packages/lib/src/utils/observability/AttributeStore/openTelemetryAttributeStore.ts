import { AttributeValue } from "@opentelemetry/api";
import { OpenTelemetryAttributeStore } from ".";

describe("AttributeStore", () => {
  let provider: OpenTelemetryAttributeStore;

  beforeEach(() => {
    provider = new OpenTelemetryAttributeStore();
  });

  test("should initialize with an empty attributes map", () => {
    expect(provider.getGlobalAttributes()).toEqual({});
  });

  test("should set a global attribute", () => {
    const key = "testKey";
    const value: AttributeValue = "testValue";

    provider.setGlobalAttribute(key, value);

    expect(provider.getGlobalAttribute(key)).toBe(value);
    expect(provider.getGlobalAttributes()).toEqual({ [key]: value });
  });

  test("should remove a global attribute", () => {
    const key = "testKey";
    const value: AttributeValue = "testValue";

    provider.setGlobalAttribute(key, value);
    provider.removeGlobalAttribute(key);

    expect(provider.getGlobalAttribute(key)).toBeUndefined();
    expect(provider.getGlobalAttributes()).toEqual({});
  });

  test("should handle removing a non-existent global attribute gracefully", () => {
    const key = "nonExistentKey";

    expect(provider.removeGlobalAttribute(key)).toBeUndefined();
    expect(provider.getGlobalAttributes()).toEqual({});
  });

  test("should get all global attributes", () => {
    const key1 = "testKey1";
    const value1: AttributeValue = "testValue1";
    const key2 = "testKey2";
    const value2: AttributeValue = "testValue2";

    provider.setGlobalAttribute(key1, value1);
    provider.setGlobalAttribute(key2, value2);

    expect(provider.getGlobalAttributes()).toEqual({
      [key1]: value1,
      [key2]: value2,
    });
  });

  test("should return undefined for a non-existent global attribute", () => {
    const key = "nonExistentKey";

    expect(provider.getGlobalAttribute(key)).toBeUndefined();
  });
});
