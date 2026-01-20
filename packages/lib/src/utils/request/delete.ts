import { reportError } from "../errorReporting";

const headers = new Headers({
  "Content-Type": "application/json",
});

export const del = async (
  url: string,
  handleError?: (e: Error) => void,
) => {
  try {
    const options: RequestInit = {
      credentials: "include",
      headers,
      method: "DELETE",
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(getErrorMessage(response, "DELETE"));
    }
    return response;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(JSON.stringify(e));
    reportError(err).warning();
    handleError?.(err);
  }
};

const getErrorMessage = (response: Response, method: string) => {
  const { status, statusText } = response;
  return `${method} Error: ${status} - ${statusText}`;
};
