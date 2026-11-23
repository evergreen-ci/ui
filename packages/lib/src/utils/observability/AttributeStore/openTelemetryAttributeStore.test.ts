import { Attributes } from "@opentelemetry/api";
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
    const value: Attributes[string] = "testValue";

    provider.setGlobalAttribute(key, value);

    expect(provider.getGlobalAttribute(key)).toBe(value);
    expect(provider.getGlobalAttributes()).toEqual({ [key]: value });
  });

  test("should remove a global attribute", () => {
    const key = "testKey";
    const value: Attributes[string] = "testValue";

    provider.setGlobalAttribute(key, value);
    provider.removeGlobalAttribute(key);

    expect(provider.getGlobalAttribute(key)).toBeUndefined();
    expect(provider.getGlobalAttributes()).toEqual({});
  });

  // Guards a regression where falsy values (e.g. mainline version.is_patch=false)
  // were never deleted and leaked onto every subsequent span/event.
  test("should remove falsy global attributes", () => {
    const key = "version.is_patch";
    const falsyValues: Attributes[string][] = [false, 0, ""];

    falsyValues.forEach((value) => {
      provider.setGlobalAttribute(key, value);
      provider.removeGlobalAttribute(key);

      expect(provider.getGlobalAttribute(key)).toBeUndefined();
      expect(provider.getGlobalAttributes()).toEqual({});
    });
  });

  test("should handle removing a non-existent global attribute gracefully", () => {
    const key = "nonExistentKey";

    expect(provider.removeGlobalAttribute(key)).toBeUndefined();
    expect(provider.getGlobalAttributes()).toEqual({});
  });

  test("should get all global attributes", () => {
    const key1 = "testKey1";
    const value1: Attributes[string] = "testValue1";
    const key2 = "testKey2";
    const value2: Attributes[string] = "testValue2";

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

  test("should preserve scalar and array attribute values", () => {
    const attributes: Attributes = {
      string: "testValue",
      number: 123,
      boolean: true,
      strings: ["first", null, undefined, "last"],
      numbers: [1, null, undefined, 2],
      booleans: [true, null, undefined, false],
      emptyArray: [],
      optional: undefined,
    };

    Object.entries(attributes).forEach(([key, value]) => {
      provider.setGlobalAttribute(key, value);

      expect(provider.getGlobalAttribute(key)).toBe(value);
    });

    expect(provider.getGlobalAttributes()).toEqual(attributes);
  });
});
