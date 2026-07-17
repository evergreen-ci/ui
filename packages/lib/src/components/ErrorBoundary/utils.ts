import {
  leaveBreadcrumb,
  SentryBreadcrumbTypes,
} from "../../utils/errorReporting";

/**
 * `refreshOnOldBundleError` is a utility function that refreshes the page if the error is due to an old bundle.
 * This is useful when the user has an old version of the application and the bundle has changed.
 * @param error - The error object
 */
const refreshOnOldBundleError = (error: Error) => {
  if (error.message.includes(dynamicallyLoadedModuleErrorMessage)) {
    leaveBreadcrumb(
      "Encountered an error loading a dynamically imported module, refreshing.",
      { error },
      SentryBreadcrumbTypes.Debug,
    );
    window.location.reload();
  }
};

const dynamicallyLoadedModuleErrorMessage = "dynamically imported module";
export { refreshOnOldBundleError, dynamicallyLoadedModuleErrorMessage };
