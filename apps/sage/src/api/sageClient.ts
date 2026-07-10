import { leaveBreadcrumb, reportError } from "@evg-ui/lib/utils/errorReporting";
import { shouldLogoutAndRedirect } from "@evg-ui/lib/utils/request";
import { SentryBreadcrumbTypes } from "@evg-ui/lib/utils/sentry/types";

export type ApiSuccess<T> = { ok: true; data: T };

export type ApiError =
  | { ok: false; type: "network"; message: string }
  | { ok: false; type: "unauthenticated" }
  | { ok: false; type: "client"; status: number; message: string }
  | { ok: false; type: "server"; status: number; message: string };

export type ApiResult<T> = ApiSuccess<T> | ApiError;

const DEFAULT_TIMEOUT_MS = 30_000;

export class SageClient {
  private readonly baseURL: string;

  constructor(
    baseURL: string,
    private readonly logout?: () => void,
  ) {
    this.baseURL = baseURL;
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" });
  }

  post<T>(path: string, body: Record<string, unknown>) {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResult<T>> {
    const url = `${this.baseURL}${path}`;

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
        headers: options?.headers,
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });

      if (shouldLogoutAndRedirect(response.status)) {
        leaveBreadcrumb(
          "sageRequest: unauthenticated",
          { status_code: response.status, url },
          SentryBreadcrumbTypes.HTTP,
        );
        this.logout?.();
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
          return {
            ok: false,
            type: "server",
            status: response.status,
            message,
          };
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
  }
}
