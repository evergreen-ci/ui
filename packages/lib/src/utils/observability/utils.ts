import { matchPath } from "react-router-dom";
import { RouteConfig } from "./types";
/**
 * `detectGraphqlQuery` is a utility function that detects the operation name and query type of a GraphQL query.
 * If the body is not a GraphQL query, it returns undefined.
 * @param body - The body of the request
 * @returns - The operation name and query type if the body is a GraphQL query
 */
const detectGraphqlQuery = (
  body: string,
): { operationName: string; queryType: "mutation" | "query" } | undefined => {
  try {
    const bodyJson = JSON.parse(body);
    if (bodyJson && bodyJson.operationName) {
      const { operationName, query } = bodyJson;
      if (typeof operationName !== "string" || typeof query !== "string") {
        return undefined;
      }
      const queryType = query.startsWith("mutation") ? "mutation" : "query";
      return { operationName, queryType };
    }
  } catch (e) {
    return undefined;
  }
  return undefined;
};

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
export { detectGraphqlQuery, calculateRouteName };
