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

export { getElementName };
