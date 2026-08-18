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
 * saveBlobToFile triggers a browser download of an in-memory blob.
 * @param blob - the blob to save
 * @param filename - the name of the file to save
 */
const saveBlobToFile = (blob: Blob, filename: string) => {
  const objectURL = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectURL;
  a.download = filename;
  a.style.display = "none";
  document.body.append(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(objectURL);
    a.remove();
  }, 1000);
};

/**
 * downloadObjectAsJson serializes a value to pretty-printed JSON and triggers a
 * browser download of it as a .json file.
 * @param data - the value to serialize
 * @param filename - the name of the file to save
 */
export const downloadObjectAsJson = (data: unknown, filename: string) => {
  saveBlobToFile(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    filename,
  );
};

/**
 * downloadFile downloads a file from a given URL and saves it to the user's filesystem.
 * @param url - the URL of the file to download
 * @param filename - the name of the file to save
 * @param onDownloadComplete - a callback that is invoked when the file has been downloaded
 * @returns - a promise that resolves when the file has been downloaded
 */
export const downloadFile = async (
  url: string,
  filename = "logs",
  onDownloadComplete?: () => void,
): Promise<void> => {
  const response = await fetch(url, { credentials: "include" });
  const supportsFileSystemAccess =
    "showSaveFilePicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  try {
    if (supportsFileSystemAccess) {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
      });
      const writable = await handle.createWritable();
      await response.body!.pipeTo(writable);
    } else {
      saveBlobToFile(await response.blob(), filename);
    }
    onDownloadComplete?.();
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return;
    }
    throw e;
  }
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
