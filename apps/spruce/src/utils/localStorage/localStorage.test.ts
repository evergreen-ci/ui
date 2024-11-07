import { getObject, setObject } from ".";

describe("getObject", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("gets object", () => {
    localStorage.setItem("foo", JSON.stringify({ bar: "baz" }));
    expect(getObject("foo")).toMatchObject({ bar: "baz" });
  });

  it("catches error and returns empty object when fetching malformed object", () => {
    localStorage.setItem("invalid", "{");
    expect(() => getObject("invalid")).not.toThrowError();
    expect(getObject("invalid")).toMatchObject({});
  });

  it("returns empty object when looking up missing key", () => {
    expect(getObject("nonexistent")).toMatchObject({});
  });
});

describe("setObject", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("stores object as a JSON-encoded string", () => {
    setObject("foo", { bar: "baz" });
    expect(localStorage.getItem("foo")).toEqual('{"bar":"baz"}');
  });
});
