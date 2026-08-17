import { useBreadcrumbAnalytics } from "analytics";
import { getWaterfallRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  user: { displayName?: string | null; userId: string },
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const { link: userPatchesPageLink, title: userPatchesPageTitle } =
    useGetUserPatchesPageTitleAndLink(user, !isPatch) ?? {};

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
        "data-testid": "bc-my-patches",
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
        "data-testid": "bc-waterfall",
      };
};
