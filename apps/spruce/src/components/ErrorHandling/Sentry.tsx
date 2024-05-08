import {
  captureException,
  ErrorBoundary as SentryErrorBoundary,
  getCurrentHub,
  init,
  setTags,
  withScope,
} from "@sentry/react";
import type { Scope, SeverityLevel } from "@sentry/react";
import type { Context, Primitive } from "@sentry/types";
import { environmentVariables } from "utils";
import ErrorFallback from "./ErrorFallback";
import { processHtmlAttributes } from "./utils";

const { getReleaseStage, getSentryDSN, isProduction } = environmentVariables;

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
      dsn: getSentryDSN(),
      debug: !isProduction(),
      normalizeDepth: 5,
      environment: getReleaseStage() || "development",
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

const isInitialized = () => !!getCurrentHub().getClient();

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
