import { diff } from "deep-object-diff";
import { formatArrayElements, getChangedPaths } from "./utils";

describe("formatArrayElements", () => {
  it("matches on numbers indicating array position", () => {
    expect(formatArrayElements("foo.1.bar")).toEqual("foo[1].bar");
  });

  it("matches on array elements that end the string", () => {
    expect(formatArrayElements("admins.1")).toEqual("admins[1]");
    expect(formatArrayElements("admins.12")).toEqual("admins[12]");
  });

  it("does not match on numbers in variable names", () => {
    expect(formatArrayElements("foo.test123")).toEqual("foo.test123");
  });
});

describe("getChangedPaths", () => {
  it("returns changed top-level keys", () => {
    const oldObj = { a: 1, b: 2 };
    const newObj = { a: 1, b: 3 };
    const result = diff(oldObj, newObj);

    expect(getChangedPaths(result)).toEqual(["b"]);
  });

  it("returns nested changed keys in dot notation", () => {
    const oldObj = {
      user: {
        name: "John",
        location: {
          city: "NYC",
        },
      },
    };
    const newObj = {
      user: {
        name: "Jane",
        location: {
          city: "LA",
        },
      },
    };

    const result = diff(oldObj, newObj);
    expect(getChangedPaths(result)).toEqual([
      "user.name",
      "user.location.city",
    ]);
  });

  it("returns added fields as changed paths", () => {
    const oldObj = {};
    const newObj = {
      foo: "bar",
      nested: { key: 42 },
    };

    const result = diff(oldObj, newObj);
    expect(getChangedPaths(result)).toEqual(["foo", "nested.key"]);
  });

  it("returns deleted fields as changed paths", () => {
    const oldObj = {
      foo: "bar",
      nested: { key: 42 },
    };
    const newObj = {};

    const result = diff(oldObj, newObj);
    // deep-object-diff will return the minimal set of changes
    // so we only get the top-level keys that were deleted
    expect(getChangedPaths(result)).toEqual(["foo", "nested"]);
  });

  it("returns empty array if no changes", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const result = diff(obj, { ...obj });
    expect(getChangedPaths(result)).toEqual([]);
  });
});
