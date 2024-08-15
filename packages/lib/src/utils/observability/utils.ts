/**
 * `getElementName` is a utility function that gets the name of an HTML element for use with observability tools.
 * It first prefers the `data-cy` attribute, then the text content, and finally the `aria-label` attribute.
 * @param element - The HTML element to compute the name of
 * @returns - The computed name of the element as a string
 */
const getElementName = (element: Element) => {
  const tagName = element.tagName.toLowerCase();
  let attr = element.getAttribute("data-cy");
  if (attr) {
    return wrapName(tagName, "data-cy", attr);
  }
  attr = element.getAttribute("aria-label");
  if (attr) {
    return wrapName(tagName, "aria-label", attr);
  }
  attr = element.textContent;
  if (attr) {
    return wrapName(tagName, "textContent", attr);
  }

  return tagName;
};

const wrapName = (name: string, attribute: string, attributeValue: string) =>
  `${name}[${attribute}="${attributeValue}"]`;

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
export { getElementName, detectGraphqlQuery };
