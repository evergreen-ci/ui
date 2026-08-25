import { trace } from "@opentelemetry/api";

const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const HTTP_AND_T2_PROTOCOLS = new Set([...HTTP_PROTOCOLS, "t2:"]);

const MAX_REPORTED_URL_LENGTH = 256;

const reportedUrls = new Set<string>();

const reportRejectedUrl = (
  url: string,
  rejectionReason: "unparseable" | "unsupported_protocol",
  protocol?: string,
) => {
  const reportedUrlKey = `${rejectionReason}:${url}`;
  if (reportedUrls.has(reportedUrlKey)) {
    return;
  }
  reportedUrls.add(reportedUrlKey);

  const span = trace
    .getTracer("analytics")
    .startSpan("System Event rejected url");
  span.setAttribute("url.rejection_reason", rejectionReason);
  span.setAttribute("url.value", url.slice(0, MAX_REPORTED_URL_LENGTH));
  span.setAttribute("url.is_relative_path", url.startsWith("/"));
  if (protocol) {
    span.setAttribute("url.protocol", protocol);
  }
  span.end();
};

const isValidUrl = (
  url: string | null | undefined,
  allowedProtocols: Set<string>,
): url is string => {
  if (!url) {
    return false;
  }

  try {
    const { protocol } = new URL(url);
    if (allowedProtocols.has(protocol)) {
      return true;
    }
    reportRejectedUrl(url, "unsupported_protocol", protocol);
    return false;
  } catch {
    reportRejectedUrl(url, "unparseable");
    return false;
  }
};

/**
 * Returns whether a URL is an absolute HTTP(S) URL from an untrusted source.
 *
 * This intentionally rejects valid non-HTTP(S) URLs, including relative routes,
 * blob URLs, and mailto links. Only use it where the destination must be an
 * external HTTP(S) URL.
 * @param url - URL to validate.
 * @returns Whether the URL uses the HTTP or HTTPS protocol.
 */
const isValidHttpUrl = (url?: string | null): url is string =>
  isValidUrl(url, HTTP_PROTOCOLS);

const isValidHttpOrT2Url = (url?: string | null): url is string =>
  isValidUrl(url, HTTP_AND_T2_PROTOCOLS);

export { isValidHttpOrT2Url, isValidHttpUrl };
