import { useBreadcrumbAnalytics } from "analytics";
import { getCommitsRoute, getWaterfallRoute } from "constants/routes";
import {
  useGetUserPatchesPageTitleAndLink,
  useMergedBetaFeatures,
} from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  author: string,
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { betaFeatures } = useMergedBetaFeatures();
  const { spruceWaterfallEnabled } = betaFeatures ?? {};

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(author, !isPatch) ?? {};

  return isPatch
    ? {
        to: userPatchesPageLink,
        text: userPatchesPageTitle,
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            name: "Clicked link",
            link: "myPatches",
          });
        },
        "data-cy": "bc-my-patches",
      }
    : {
        to: spruceWaterfallEnabled
          ? getWaterfallRoute(projectIdentifier)
          : getCommitsRoute(projectIdentifier),
        text: projectIdentifier,
        onClick: () => {
          breadcrumbAnalytics.sendEvent({
            name: "Clicked link",
            link: "waterfall",
          });
        },
        "data-cy": "bc-waterfall",
      };
};
