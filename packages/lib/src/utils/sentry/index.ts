import type { Context } from "@sentry/core";
import {
  captureException,
  init,
  setTags,
  withScope,
  type Scope,
  type SeverityLevel,
} from "@sentry/react";
import { ErrorInput } from "./types";
import { processHtmlAttributes } from "./utils";

/**
 * `initializeSentry` initializes Sentry with the provided configuration. DO NOT call this function directly.
 * This function should be called once in the application's lifecycle.
 * @param param0 - The properties of the Sentry initialization object
 * @param param0.debug - Whether to enable debug mode
 * @param param0.environment - The environment the application is running in
 * @param param0.sentryDSN - The Sentry DSN
 */
const initializeSentry = ({
  debug,
  environment,
  sentryDSN,
}: {
  sentryDSN?: string;
  environment?: string;
  debug?: boolean;
}) => {
  try {
    init({
      beforeBreadcrumb: (breadcrumb, hint) => {
        if (breadcrumb?.category?.startsWith("ui")) {
          const { target } = hint?.event ?? {};
          if (target?.dataset?.cy) {
            breadcrumb.message = `${target.tagName.toLowerCase()}[data-cy="${target.dataset.cy}"]`;
          }
          breadcrumb.data = processHtmlAttributes(target);
        }
        return breadcrumb;
      },
      // Don't send errors from unauthenticated users
      beforeSend: (event) => (event.user?.id ? event : null),
      debug: debug,
      dsn: sentryDSN,
      environment: environment || "development",
      maxValueLength: 500,
      normalizeDepth: 5,
    });
  } catch (e) {
    console.error("Failed to initialize Sentry", e);
  }
};

/**
 * `sendError` sends an error to Sentry. Do not call this function directly.
 * @param param0 - The error input object's properties
 * @param param0.context - The context object to attach to the error
 * @param param0.err - The error object to send
 * @param param0.fingerprint - The fingerprint to group errors by
 * @param param0.severity - The severity level of the error
 * @param param0.tags - The tags to attach to the error
 */
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

export { initializeSentry, setScope, sendError };
