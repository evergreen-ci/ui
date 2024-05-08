/**
 * `processHtmlAttributes` extracts useful attributes to attach as
 * Sentry breadcrumb data.
 * @param htmlElement - HTML element detected by Sentry
 * @returns an object containing attributes of the HTML element
 */
const processHtmlAttributes = (htmlElement: HTMLElement) => {
  const ariaLabel = htmlElement.getAttribute("aria-label");
  const title = htmlElement.getAttribute("title");
  // Get dataset directly to handle all data-* attributes.
  const { dataset } = htmlElement ?? {};
  return {
    ...(ariaLabel && { ariaLabel }),
    ...(dataset && Object.keys(dataset).length > 0 && { dataset }),
    ...(title && { title }),
  };
};

export { processHtmlAttributes };
