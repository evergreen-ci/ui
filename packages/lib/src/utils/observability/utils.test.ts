import { detectGraphqlQuery } from "./utils";

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
