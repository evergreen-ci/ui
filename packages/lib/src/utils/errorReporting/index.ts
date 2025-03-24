import { addBreadcrumb, Breadcrumb, isInitialized } from "@sentry/react";
import { initializeSentry, sendError as sentrySendError } from "../sentry";
import { SentryBreadcrumbTypes, ErrorInput } from "../sentry/types";
import { validateMetadata } from "../sentry/utils";

interface reportErrorResult {
  /** Report error as severe. This will cause an alert on our alerting infrastructure. Use this for critical errors. */
  severe: () => void;
  /** Report error as a warning. This will log the error to our infrastructure and will only alert if there is a spike. Use this for most errors. */
  warning: () => void;
}

type ErrorMetadata = {
  fingerprint?: ErrorInput["fingerprint"];
  tags?: ErrorInput["tags"];
  context?: ErrorInput["context"];
};

/**
 * `reportError` is a utility function that reports an error to Sentry if Sentry is initialized.
 * If Sentry is not initialized, it logs the error to the console.
 * @param err - The error to report.
 * @param param1 - The metadata for the error.
 * @param param1.context - The context for the error.
 * @param param1.fingerprint - The fingerprint for the error. This is used to group errors together.
 * @param param1.tags - Any tags to attach to the error.
 * @returns - An object with two functions: `severe` and `warning`. These functions report the error with different severities.
 */
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

/**
 * `leaveBreadcrumb` logs messages that are useful for debugging and will appear in the sentry timeline.
 * @param message - The message to log.
 * @param metadata - Any metadata to attach to the breadcrumb.
 * @param type - The type of breadcrumb to log. This determines the icon that appears in the timeline.
 */
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
