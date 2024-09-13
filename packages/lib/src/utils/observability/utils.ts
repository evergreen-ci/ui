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
export { detectGraphqlQuery };
