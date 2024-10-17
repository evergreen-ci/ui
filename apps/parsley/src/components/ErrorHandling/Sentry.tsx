import {
  ErrorBoundary as SentryErrorBoundary,
  captureException,
  init,
  isInitialized,
  setTags,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import type { Context, Primitive } from "@sentry/types";
import {
  getReleaseStage,
  getSentryDSN,
  isProduction,
} from "utils/environmentVariables";
import ErrorFallback from "./ErrorFallback";
import { processHtmlAttributes } from "./utils";

const initializeSentry = () => {
  try {
    init({
      beforeBreadcrumb: (breadcrumb, hint) => {
        if (breadcrumb?.category?.startsWith("ui")) {
          const { target } = hint?.event ?? {};
          if (target?.dataset?.cy) {
            // eslint-disable-next-line no-param-reassign
            breadcrumb.message = `${target.tagName.toLowerCase()}[data-cy="${target.dataset.cy}"]`;
          }
          // eslint-disable-next-line no-param-reassign
          breadcrumb.data = processHtmlAttributes(target);
        }
        return breadcrumb;
      },
      // Don't send errors from unauthenticated users
      beforeSend: (event) => (event.user?.id ? event : null),
      debug: !isProduction(),
      dsn: getSentryDSN(),
      environment: getReleaseStage() || "development",
      maxValueLength: 500,
      normalizeDepth: 5,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

export type ErrorInput = {
  err: Error;
  fingerprint?: string[];
  context?: Context;
  severity: SeverityLevel;
  tags?: { [key: string]: Primitive };
};

const sendError = ({
  context,
  err,
  fingerprint,
  severity,
  tags,
}: ErrorInput) => {
  withScope((scope) => {
    setScope(scope, { context, level: severity });

    if (fingerprint) {
      // A custom fingerprint allows for more intelligent grouping
      scope.setFingerprint(fingerprint);
    }

    if (tags) {
      // Apply tags, which are a searchable/filterable property
      setTags(tags);
    }

    captureException(err);
  });
};

type ScopeOptions = {
  level?: SeverityLevel;
  context?: Context;
};

const setScope = (scope: Scope, { context, level }: ScopeOptions = {}) => {
  const userId = localStorage.getItem("userId") ?? undefined;
  scope.setUser({ id: userId });

  if (level) scope.setLevel(level);
  if (context) scope.setContext("metadata", context);
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SentryErrorBoundary
    beforeCapture={(scope) => {
      setScope(scope);
    }}
    fallback={<ErrorFallback />}
  >
    {children}
  </SentryErrorBoundary>
);

export { ErrorBoundary, initializeSentry, isInitialized, sendError };
