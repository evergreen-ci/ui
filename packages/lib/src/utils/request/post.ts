import { getEvergreenUrl } from "../environmentVariables";
import { reportError } from "../errorReporting";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const post = async (url: string, body: unknown) => {
  const response = await fetch(`${getEvergreenUrl()}${url}`, {
    body: JSON.stringify(body),
    credentials: "include",
    headers: new Headers(defaultHeaders),
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(getErrorMessage(response, "POST"));
  }
  return response;
};

export const postAndHandle = async (...args: Parameters<typeof post>) => {
  try {
    post(...args);
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
