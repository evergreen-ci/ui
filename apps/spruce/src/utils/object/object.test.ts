import { omit, getObjectValueByPath, omitTypename } from "utils/object";

describe("omit", () => {
  it("returns an object without the supplied key(s)", () => {
    const inputObj: { a?: number } = {};
    expect(omit(inputObj, ["a"])).toMatchObject({});
    expect(omit({ a: 1 }, ["a"])).toMatchObject({});
    expect(omit({ a: 1, b: 1 }, ["b"])).toMatchObject({ a: 1 });
    expect(omit({ a: 1, b: 1, c: 1 }, ["b", "c"])).toMatchObject({ a: 1 });
  });
  it("returns a new object reference", () => {
    const inputObj: { b?: number } = {};
    const resultObj = omit(inputObj, ["b"]);
    expect(resultObj).toMatchObject(inputObj);
    expect(resultObj).not.toBe(inputObj);
  });
});

describe("getObjectValueByPath", () => {
  it("returns primitive value at the path", () => {
    expect(getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b.c")).toBe(1);
    expect(getObjectValueByPath({ a: { b: "test" } }, "a.b")).toBe("test");
  });
  it("returns object at the path", () => {
    expect(getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b")).toMatchObject({
      c: 1,
    });
  });
  it("returns undefined if path does not exist", () => {
    expect(getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b.d")).toBe(
      undefined,
    );
  });
  it("accepts array values", () => {
    expect(getObjectValueByPath({ a: { b: [1, 2] } }, "a.b.0")).toBe(1);
  });
  it("is type safe", () => {
    const valueNumber = getObjectValueByPath({ a: { b: { c: 1 } } }, "a.b.c");
    expect(valueNumber).toBe(1);
    const valueString = getObjectValueByPath({ a: { b: "test" } }, "a.b");
    expect(valueString).toBe("test");
  });
});

describe("omitTypename", () => {
  it("simple object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      __typename: "simpleObj",
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
    });
  });
  it("nested object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        __typename: "someOtherObj",
        fieldC: "test3",
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
      },
    });
  });
  it("deep nested object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          __typename: "someDeepObject",
          fieldD: "test4",
        },
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          fieldD: "test4",
        },
      },
    });
  });
  it("deep nested object with multiple __typename's", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        __typename: "someOtherObj",

        someDeepObject: {
          __typename: "someDeepObject",
          fieldD: "test4",
        },
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          fieldD: "test4",
        },
      },
    });
  });
  it("some object with multiple __typename's in an array", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        __typename: "someOtherObj",
        someArray: [
          {
            __typename: "someDeepObject",
            fieldD: "test4",
          },
          {
            __typename: "someDeepObject",
            fieldD: "test5",
          },
          {
            __typename: "someDeepObject",
            fieldD: "test6",
          },
        ],
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someArray: [
          {
            fieldD: "test4",
          },
          {
            fieldD: "test5",
          },
          {
            fieldD: "test6",
          },
        ],
      },
    });
  });
});
