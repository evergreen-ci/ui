import { matchPath } from "react-router-dom";
import { RouteConfig } from "./types";
/**
 * `calculateRouteName` is a utility function that calculates the route name of a request based on the path name and the list of react router routes.
 * @param pathName - The path name of the request
 * @param routeConfig - The route configuration of the app
 * @returns - The route name of the request
 */
const calculateRouteName = (pathName: string, routeConfig: RouteConfig) => {
  const matchedRoute = Object.entries(routeConfig).find(([, path]) =>
    matchPath(path, pathName),
  );
  if (matchedRoute) {
    return {
      name: matchedRoute[0],
      path: matchedRoute[1],
    };
  }
  return undefined;
};

export { calculateRouteName };
