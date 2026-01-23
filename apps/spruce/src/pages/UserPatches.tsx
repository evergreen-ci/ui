import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { useErrorToast } from "@evg-ui/lib/hooks";
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
  const { [slugs.userId]: userId } = useParams();

  const patchesInput = usePatchesQueryParams();
  const isMergeQueueUser = userId === githubMergeQueueUser;

  const { data, error, loading, refetch, startPolling, stopPolling } = useQuery<
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
  });
  useErrorToast(error, "Error while fetching user patches");
  usePolling<UserPatchesQuery, UserPatchesQueryVariables>({
    startPolling,
    stopPolling,
    refetch,
  });

  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(
    data?.user,
  ) ?? { title: "" };

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
