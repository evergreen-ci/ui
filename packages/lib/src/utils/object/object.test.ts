import { deleteNestedKey } from ".";

describe("deleteNestedKey", () => {
  it("replaces key with redacted string when it's defined", () => {
    const obj = {
      age: 30,
      city: "New York",
      name: "John",
      sibling: {
        age: 5,
        city: "New York",
        zipCode: 10001,
      },
    };
    const expected = {
      age: "REDACTED",
      city: "New York",
      name: "John",
      sibling: {
        age: "REDACTED",
        city: "New York",
        zipCode: 10001,
      },
    };
    expect(deleteNestedKey(obj, "age", "REDACTED")).toStrictEqual(expected);
  });

  it("deletes many keys when provided as an array of keys to update", () => {
    const obj = {
      age: 30,
      city: "New York",
      name: "John",
      sibling: {
        age: 5,
        city: "New York",
        zipCode: 10001,
      },
    };
    const expected = {
      sibling: {},
    };
    expect(
      deleteNestedKey(obj, ["age", "city", "name", "zipCode"]),
    ).toStrictEqual(expected);
  });

  it("deletes a top-level key", () => {
    const obj = {
      age: 30,
      city: "New York",
      name: "John",
    };
    const expected = {
      city: "New York",
      name: "John",
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("deletes a nested key", () => {
    const obj = {
      address: {
        age: 5,
        city: "New York",
        zipCode: 10001,
      },
      name: "John",
    };
    const expected = {
      address: {
        city: "New York",
        zipCode: 10001,
      },
      name: "John",
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("handles multiple nested levels", () => {
    const obj = {
      address: {
        city: "New York",
        details: {
          age: 5,
          zipCode: 10001,
        },
      },
      age: 30,
      name: "John",
    };
    const expected = {
      address: {
        city: "New York",
        details: {
          zipCode: 10001,
        },
      },
      name: "John",
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("does not delete non-matching keys", () => {
    const obj = {
      address: {
        city: "New York",
        zipCode: 10001,
      },
      age: 30,
      name: "John",
    };
    const expected = { ...obj };
    expect(deleteNestedKey(obj, "height")).toStrictEqual(expected);
  });
});
