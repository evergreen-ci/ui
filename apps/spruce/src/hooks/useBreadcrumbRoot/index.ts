import { useBreadcrumbAnalytics } from "analytics";
import { getWaterfallRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  userId: string,
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(userId, !isPatch) ?? {};

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
        to: getWaterfallRoute(projectIdentifier),
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
