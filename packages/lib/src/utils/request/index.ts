import { getUserStagingKey, isStaging } from "../environmentVariables";

/**
 * getUserStagingHeader generates the correct headers for the Evergreen-Multi staging backend to correctly route requests.
 * @returns - an object with a key-value pair if the headers should be applied, and an empty object if not.
 */
export const getUserStagingHeader = (): {
  "X-Evergreen-Environment"?: string;
} => {
  if (!isStaging()) {
    return {};
  }

  const key = getUserStagingKey();
  if (!key) {
    return {};
  }

  return { "X-Evergreen-Environment": key };
};

export const shouldLogoutAndRedirect = (statusCode: number) =>
  statusCode === 401;

const getErrorMessage = (response: Response, method: string) => {
  const { status, statusText } = response;
  return `${method} Error: ${status} - ${statusText}`;
};

export const fetchWithRetry = <T = unknown>(
  url: string,
  options: RequestInit,
  retries: number = 3,
  backoff: number = 150,
): Promise<{ data: T }> =>
  new Promise((resolve, reject) => {
    const attemptFetch = (attempt: number): void => {
      fetch(url, options)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          reject(
            new Error(getErrorMessage(res, "GET"), {
              cause: { message: res.statusText, statusCode: res.status },
            }),
          );
        })
        .then((data) => resolve(data))
        .catch((err) => {
          if (attempt <= retries) {
            setTimeout(() => attemptFetch(attempt + 1), backoff * attempt);
          } else {
            reject(err);
          }
        });
    };
    attemptFetch(1);
  });
