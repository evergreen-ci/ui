import { useMergedBetaFeatures } from "@evg-ui/lib/hooks/useBetaFeatures";
import { getParsleyUrl, isProduction } from "utils/environmentVariables";

export const parsleyBetaURL = "https://parsley-beta.corp.mongodb.com";

/**
 * `useConditionallyLinkToParsleyBeta` is a hook to assist with updating Parsley URLs to redirect to beta.
 * @returns boolean indicating if redirect should trigger, function to update Parsley URLs
 */
export const useConditionallyLinkToParsleyBeta = () => {
  const { betaFeatures } = useMergedBetaFeatures();

  // Redirecting to beta only makes sense on the production environment. The beta must be enabled in Admin
  // Settings and by the given user.
  const redirectToBeta =
    (isProduction() && betaFeatures?.parsleyAIEnabled) ?? false;

  const replaceUrl = (originalUrl: string): string =>
    redirectToBeta
      ? originalUrl.replace(getParsleyUrl(), parsleyBetaURL)
      : originalUrl;

  return { redirectToBeta, replaceUrl };
};
