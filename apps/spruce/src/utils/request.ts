import { reportError } from "@evg-ui/lib/utils/errorReporting";
import { getEvergreenUrl } from "./environmentVariables";

export const post = async (url: string, body: unknown) => {
  try {
    const response = await fetch(`${getEvergreenUrl()}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(getErrorMessage(response, "POST"));
    }
    return response;
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
