import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { PatchesPage } from "components/PatchesPage";
import { RequesterSelector } from "components/PatchesPage/RequesterSelector";
import { usePatchesQueryParams } from "components/PatchesPage/usePatchesQueryParams";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { githubMergeQueueUser } from "constants/patch";
import { slugs } from "constants/routes";
import {
  UserPatchesQuery,
  UserPatchesQueryVariables,
} from "gql/generated/types";
import { USER_PATCHES } from "gql/queries";
import { usePolling, useGetUserPatchesPageTitleAndLink } from "hooks";

export const UserPatches = () => {
  const dispatchToast = useToastContext();
  const { [slugs.userId]: userId } = useParams();
  usePageVisibilityAnalytics({
    attributes: { userId: userId ?? "" },
  });
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId) || {};

  const patchesInput = usePatchesQueryParams();
  const isMergeQueueUser = userId === githubMergeQueueUser;

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(USER_PATCHES, {
    variables: {
      userId,
      patchesInput: {
        ...patchesInput,
        // Always show merge queue patches for the merge queue user.
        onlyMergeQueue: isMergeQueueUser,
      },
    },
    fetchPolicy: "cache-and-network",
    pollInterval: DEFAULT_POLL_INTERVAL,
    skip: !userId,
    onError: (err) => {
      dispatchToast.error(`Error while fetching user patches: ${err.message}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });

  return (
    <PatchesPage
      filterComp={<RequesterSelector />}
      loading={loading && !data?.user.patches}
      pageTitle={pageTitle || "User Patches"}
      pageType="user"
      patches={data?.user.patches}
    />
  );
};
