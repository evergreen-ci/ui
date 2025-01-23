import { calculateRouteName } from "./utils";

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
