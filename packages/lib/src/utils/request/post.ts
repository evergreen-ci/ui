import { reportError } from "../errorReporting";

const headers = new Headers({
  "Content-Type": "application/json",
});

export const post = async (url: string, body: unknown) => {
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
};

export const postAndHandle = async (...args: Parameters<typeof post>) => {
  try {
    return await post(...args);
  } catch (e: any) {
    handleError(e);
  }
};

const getErrorMessage = (response: Response, method: string) => {
  const { status, statusText } = response;
  return `${method} Error: ${status} - ${statusText}`;
};

const handleError = (error: string) => {
  reportError(new Error(error)).warning();
};
