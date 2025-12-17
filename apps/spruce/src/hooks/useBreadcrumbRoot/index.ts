import { useBreadcrumbAnalytics } from "analytics";
import { getWaterfallRoute } from "constants/routes";
import { User } from "gql/generated/types";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

export const useBreadcrumbRoot = (
  isPatch: boolean,
  author: Pick<User, "displayName" | "userId">,
  projectIdentifier: string,
) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const userPatchesPageData = useGetUserPatchesPageTitleAndLink(author);
  const userPatchesPageLink = userPatchesPageData?.link ?? "";
  const userPatchesPageTitle = userPatchesPageData?.title ?? "";

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
