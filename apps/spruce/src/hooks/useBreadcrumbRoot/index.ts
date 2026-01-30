import { useBreadcrumbAnalytics } from "analytics";
import { getWaterfallRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

interface UserInfo {
  userId: string;
  displayName?: string | null;
}

export const useBreadcrumbRoot = (
  isPatch: boolean,
  user: UserInfo,
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
