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
      route: matchedRoute[1],
    };
  }
  return undefined;
};

/**
 * `getRouteParams` is a utility function that extracts the route params from a URL based on the route.
 * @param route - The route to extract the params from
 * @param url - The URL to extract the params from
 * @returns - The route params of the URL
 */
const getRouteParams = (route: string, url: string) => {
  // If the route doesn't match the URL, return empty
  if (!matchPath(route, url)) {
    return {};
  }

  const routeParts = route.split("/");
  const urlParts = url.split("/");
  const params: { [key: string]: string } = {};

  routeParts.forEach((part, index) => {
    // Check if part is a route parameter (starts with ':')
    if (part.startsWith(":")) {
      let paramName = part.slice(1); // remove ':'
      const isOptional = isOptionalParam(paramName);

      // If it's optional, remove the trailing '?'
      if (isOptional) {
        paramName = paramName.slice(0, -1);
      }

      const paramValue = urlParts[index];

      // If param is optional and value is not provided, use empty string
      if (isOptional && paramValue === undefined) {
        params[paramName] = `""`;
      } else {
        params[paramName] = paramValue;
      }
    }
  });

  return params;
};

const isOptionalParam = (param: string) => param.endsWith("?");

export { calculateRouteName, getRouteParams };
