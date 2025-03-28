/**
 * `refreshOnOldBundleError` is a utility function that refreshes the page if the error is due to an old bundle.
 * This is useful when the user has an old version of the application and the bundle has changed.
 * @param error - The error object
 */
const refreshOnOldBundleError = (error: Error) => {
  if (error.message.includes("error loading dynamically imported module")) {
    window.location.reload();
  }
};

export { refreshOnOldBundleError };
