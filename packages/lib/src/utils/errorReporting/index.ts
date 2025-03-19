import { addBreadcrumb, Breadcrumb, isInitialized } from "@sentry/react";
import { initializeSentry, sendError as sentrySendError } from "../sentry";
import { SentryBreadcrumbTypes, ErrorInput } from "../sentry/types";
import { validateMetadata } from "../sentry/utils";

interface reportErrorResult {
  severe: () => void;
  warning: () => void;
}

type ErrorMetadata = {
  fingerprint?: ErrorInput["fingerprint"];
  tags?: ErrorInput["tags"];
  context?: ErrorInput["context"];
};

const reportError = (
  err: Error,
  { context, fingerprint, tags }: ErrorMetadata = {},
): reportErrorResult => {
  if (!isInitialized()) {
    return {
      severe: () => {
        console.error({ err, severity: "severe", context, fingerprint, tags });
      },
      warning: () => {
        console.error({ err, severity: "warning", context, fingerprint, tags });
      },
    };
  }

  return {
    severe: () => {
      sentrySendError({
        context,
        err,
        fingerprint,
        severity: "error",
        tags,
      });
    },
    warning: () => {
      sentrySendError({
        context,
        err,
        fingerprint,
        severity: "warning",
        tags,
      });
    },
  };
};

const leaveBreadcrumb = (
  message: string,
  metadata: Breadcrumb["data"],
  type: SentryBreadcrumbTypes,
) => {
  if (!isInitialized()) {
    console.debug({ message, metadata, type });
  } else {
    const bc: Breadcrumb = {
      message,
      data: validateMetadata(metadata, type),
      // Divide date by 1000 because Sentry wants the timestamp in RFC 3339, or seconds (not milliseconds!) since the Unix epoch.
      timestamp: new Date().getTime() / 1000,
      type,
    };
    addBreadcrumb(bc);
  }
};

/**
 * `initializeErrorHandling` initializes error handling for the application.
 * This function should be called once in the application's lifecycle.
 * It initializes Sentry for production builds.
 * @param options - The options for initializing error handling.
 * @param options.isProductionBuild - Whether the application is a production build.
 * @param options.sentryDSN - The Sentry DSN.
 * @param options.environment - The environment the application is running in.
 */
const initializeErrorHandling = ({
  environment,
  isProductionBuild,
  sentryDSN,
}: {
  isProductionBuild: boolean;
  sentryDSN: string;
  environment: string;
}) => {
  if (!isProductionBuild) {
    return;
  }

  if (!isInitialized()) {
    initializeSentry({
      debug: !isProductionBuild,
      sentryDSN: sentryDSN,
      environment: environment,
    });
  }
};

export {
  initializeErrorHandling,
  leaveBreadcrumb,
  reportError,
  SentryBreadcrumbTypes,
};
