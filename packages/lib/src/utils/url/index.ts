const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns whether a URL is an absolute HTTP(S) URL.
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
    return false;
  }
};

export { isValidHttpUrl };
