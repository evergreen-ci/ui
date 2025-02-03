import { calculateRouteName, getRouteParams } from "./utils";

describe("calculateRouteName", () => {
  const routeConfig = {
    home: "/",
    about: "/about",
    contact: "/contact",
  };

  it("should return the route name and route for a matching route", () => {
    const pathName = "/about";
    const result = calculateRouteName(pathName, routeConfig);
    expect(result).toEqual({ name: "about", route: "/about" });
  });

  it("should return undefined for a non-matching route", () => {
    const pathName = "/non-existent";
    const result = calculateRouteName(pathName, routeConfig);
    expect(result).toBeUndefined();
  });

  it("should return the route name and route for the root route", () => {
    const pathName = "/";
    const result = calculateRouteName(pathName, routeConfig);
    expect(result).toEqual({ name: "home", route: "/" });
  });

  it("should return undefined for an empty path name", () => {
    const pathName = "";
    const result = calculateRouteName(pathName, routeConfig);
    expect(result).toBeUndefined();
  });
});

describe("getRouteParams", () => {
  it("should extract params from a URL based on the route", () => {
    const route = "/task/:taskId";
    const url = "/task/123";
    const result = getRouteParams(route, url);
    expect(result).toEqual({ taskId: "123" });
    const route2 = "/project/:projectIdentifier/waterfall";
    const url2 = "/project/evergreen-ui/waterfall";
    const result2 = getRouteParams(route2, url2);
    expect(result2).toEqual({ projectIdentifier: "evergreen-ui" });
  });
  it("should not extract params if the route does not match the URL", () => {
    const route = "/task/:taskId";
    const url = "/project/123";
    const result = getRouteParams(route, url);
    expect(result).toEqual({});
  });
  it("should handle multiple params in the route", () => {
    const route = "/task/:taskId/:tab";
    const url = "/task/123/logs";
    const result = getRouteParams(route, url);
    expect(result).toEqual({ taskId: "123", tab: "logs" });
  });
  it("should remove the question mark from optional params", () => {
    const route = "/task/:taskId/:tab?";
    const url = "/task/123/logs";
    const result = getRouteParams(route, url);
    expect(result).toEqual({ taskId: "123", tab: "logs" });
  });
  it("should handle no params in the route", () => {
    const route = "/task";
    const url = "/task";
    const result = getRouteParams(route, url);
    expect(result).toEqual({});
  });
});
