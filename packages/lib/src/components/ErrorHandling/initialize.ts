import { initializeSentry, isInitialized } from "./Sentry";

/**
 * `initializeErrorHandling` initializes error handling for the application.
 * This function should be called once in the application's lifecycle.
 * It initializes Sentry for production builds.
 * @param isProductionBuild - Whether the application is a production build.
 */
export const initializeErrorHandling = (isProductionBuild: boolean) => {
  if (!isProductionBuild) {
    return;
  }

  if (!isInitialized()) {
    initializeSentry();
  }
};
