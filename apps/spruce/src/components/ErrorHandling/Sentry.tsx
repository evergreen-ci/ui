import {
  captureException,
  ErrorBoundary as SentryErrorBoundary,
  init,
  setTags,
  withScope,
  isInitialized,
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
      // Don't send errors from unauthenticated users
      beforeSend: (event) => (event.user?.id ? event : null),
      sampleRate: 0.5,
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
      dsn: getSentryDSN(),
      debug: !isProduction(),
      normalizeDepth: 5,
      environment: getReleaseStage() || "development",
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
    setScope(scope, { level: severity, context });

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
