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

/**
 * downloadFile downloads a file from a given URL and saves it to the user's filesystem.
 * @param url - the URL of the file to download
 * @param filename - the name of the file to save
 * @returns - a promise that resolves when the file has been downloaded
 */
export const downloadFile = async (
  url: string,
  filename = "logs",
): Promise<void> => {
  const response = await fetch(url, { credentials: "include" });
  const handle = await window.showSaveFilePicker({ suggestedName: filename });
  const writable = await handle.createWritable();
  await response.body!.pipeTo(writable);
};

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
