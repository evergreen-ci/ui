import { leaveBreadcrumb, reportError } from "@evg-ui/lib/utils/errorReporting";
import { shouldLogoutAndRedirect } from "@evg-ui/lib/utils/request";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";
import { sageAPIURL } from "utils/environmentVariables";

export type ApiSuccess<T> = { ok: true; data: T };

export type ApiError =
  | { ok: false; type: "network"; message: string }
  | { ok: false; type: "unauthenticated" }
  | { ok: false; type: "client"; status: number; message: string }
  | { ok: false; type: "server"; status: number; message: string };

export type ApiResult<T> = ApiSuccess<T> | ApiError;

const request = async <T>(
  path: string,
  options: RequestInit = {},
  logout?: () => void,
): Promise<ApiResult<T>> => {
  const url = `${sageAPIURL}${path}`;

  leaveBreadcrumb(
    "sageRequest",
    { url, method: options.method },
    SentryBreadcrumbTypes.HTTP,
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (shouldLogoutAndRedirect(response.status)) {
      leaveBreadcrumb(
        "sageRequest: unauthenticated",
        { status_code: response.status, url },
        SentryBreadcrumbTypes.HTTP,
      );
      logout?.();
      return { ok: false, type: "unauthenticated" };
    }

    if (!response.ok) {
      // Attempt to extract a message from the response body; fall back to statusText.
      let message = response.statusText;
      try {
        const body = await response.json();
        if (body.message) {
          message = body.message;
        }
      } catch {
        // Don't throw an error, just use statusText as the message.
      }

      leaveBreadcrumb(
        "sageRequest: error response",
        { status_code: response.status, url },
        SentryBreadcrumbTypes.HTTP,
      );

      if (response.status >= 500) {
        return { ok: false, type: "server", status: response.status, message };
      }
      return { ok: false, type: "client", status: response.status, message };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const error = err as Error;
    leaveBreadcrumb(
      "sageRequest: network error",
      { err: error, url },
      SentryBreadcrumbTypes.Error,
    );
    reportError(error).severe();
    return { ok: false, type: "network", message: error.message };
  }
};

export class SageClient {
  constructor(private readonly logout?: () => void) {}

  get<T>(path: string) {
    return request<T>(path, { method: "GET" }, this.logout);
  }

  post<T>(path: string, body: unknown) {
    return request<T>(
      path,
      { method: "POST", body: JSON.stringify(body) },
      this.logout,
    );
  }
}
