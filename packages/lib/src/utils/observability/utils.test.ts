import { getElementName, detectGraphqlQuery } from "./utils";

describe("getElementName", () => {
  it("returns the data-cy attribute if it exists", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    element.setAttribute("aria-label", "test-aria");
    element.setAttribute("data-cy", "test-cy");
    expect(getElementName(element)).toBe(`button[data-cy="test-cy"]`);
  });
  it("returns the aria-label attribute if data-cy does not exist", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    element.setAttribute("aria-label", "test-aria");
    expect(getElementName(element)).toBe(`button[aria-label="test-aria"]`);
  });
  it("returns the textContent if neither data-cy nor aria-label exist", () => {
    const element = document.createElement("button");
    element.textContent = "test";
    expect(getElementName(element)).toBe(`button[textContent="test"]`);
  });
  it("returns the tagName if none of the above exist", () => {
    const element = document.createElement("button");
    expect(getElementName(element)).toBe("button");
  });
});

describe("detectGraphqlQuery", () => {
  it("should return the operation name and query type for a valid query", () => {
    const body = JSON.stringify({
      operationName: "TestQuery",
      query: "query { test }",
    });
    const result = detectGraphqlQuery(body);
    expect(result).toEqual({ operationName: "TestQuery", queryType: "query" });
  });

  it("should return the operation name and query type for a valid mutation", () => {
    const body = JSON.stringify({
      operationName: "TestMutation",
      query: "mutation { test }",
    });
    const result = detectGraphqlQuery(body);
    expect(result).toEqual({
      operationName: "TestMutation",
      queryType: "mutation",
    });
  });

  it("should return undefined for a body without operationName", () => {
    const body = JSON.stringify({
      query: "query { test }",
    });
    const result = detectGraphqlQuery(body);
    expect(result).toBeUndefined();
  });

  it("should return undefined for a body that is not a valid JSON", () => {
    const body = "invalid json";
    expect(detectGraphqlQuery(body)).toBeUndefined();
  });

  it("should return undefined for a body that does not contain a query", () => {
    const body = JSON.stringify({
      operationName: "TestQuery",
    });
    const result = detectGraphqlQuery(body);
    expect(result).toBeUndefined();
  });
});
