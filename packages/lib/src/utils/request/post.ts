import { reportError } from "../errorReporting";

const headers = new Headers({
  "Content-Type": "application/json",
});

export const post = async (
  url: string,
  body: unknown,
  handleError?: (e: Error) => void,
) => {
  try {
    const options: RequestInit = {
      body: JSON.stringify(body),
      credentials: "include",
      headers,
      method: "POST",
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(getErrorMessage(response, "POST"));
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
