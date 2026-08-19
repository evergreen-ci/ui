import { trace } from "@opentelemetry/api";

const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

const MAX_REPORTED_URL_LENGTH = 256;

const reportedUrls = new Set<string>();

const reportUnparseableUrl = (url: string) => {
  if (reportedUrls.has(url)) {
    return;
  }
  reportedUrls.add(url);

  const span = trace
    .getTracer("analytics")
    .startSpan("System Event rejected unparseable url");
  span.setAttribute("url.value", url.slice(0, MAX_REPORTED_URL_LENGTH));
  span.setAttribute("url.is_relative_path", url.startsWith("/"));
  span.end();
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
const isValidHttpUrl = (url?: string | null): url is string => {
  if (!url) {
    return false;
  }

  try {
    return HTTP_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    reportUnparseableUrl(url);
    return false;
  }
};

export { isValidHttpUrl };
