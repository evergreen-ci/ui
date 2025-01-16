import { detectGraphqlQuery, calculateRouteName } from "./utils";

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

  describe("calculateRouteName", () => {
    const routeConfig = {
      home: "/",
      about: "/about",
      contact: "/contact",
    };

    it("should return the route name and path for a matching route", () => {
      const pathName = "/about";
      const result = calculateRouteName(pathName, routeConfig);
      expect(result).toEqual({ name: "about", path: "/about" });
    });

    it("should return undefined for a non-matching route", () => {
      const pathName = "/non-existent";
      const result = calculateRouteName(pathName, routeConfig);
      expect(result).toBeUndefined();
    });

    it("should return the route name and path for the root route", () => {
      const pathName = "/";
      const result = calculateRouteName(pathName, routeConfig);
      expect(result).toEqual({ name: "home", path: "/" });
    });

    it("should return undefined for an empty path name", () => {
      const pathName = "";
      const result = calculateRouteName(pathName, routeConfig);
      expect(result).toBeUndefined();
    });
  });
});
