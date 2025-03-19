import { Breadcrumb } from "@sentry/react";
import { SentryBreadcrumbTypes } from "./types";

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

/**
 * Ensure metadata follows Sentry's breadcrumb guidelines.
 * https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
 * @param metadata - Metadata object
 * @param breadcrumbType - Sentry breadcrumb type
 * @returns an object adhering to Sentry's metadata rules.
 */
const validateMetadata = (
  metadata: Breadcrumb["data"],
  breadcrumbType: SentryBreadcrumbTypes,
): Breadcrumb["data"] => {
  if (!metadata) {
    console.warn("Breadcrumb metadata is missing.");
    return;
  }
  if (breadcrumbType === SentryBreadcrumbTypes.Navigation) {
    if (!metadata.from) {
      console.warn(
        "Navigation breadcrumbs should include a 'from' metadata field.",
      );
    }
    if (!metadata.to) {
      console.warn(
        "Navigation breadcrumbs should include a 'to' metadata field.",
      );
    }
  }

  return metadata;
};

export { processHtmlAttributes, validateMetadata };
