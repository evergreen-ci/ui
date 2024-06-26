import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { useUserPatchesAnalytics } from "analytics";
import { PatchesPage } from "components/PatchesPage";
import { RequesterSelector } from "components/PatchesPage/RequesterSelector";
import { usePatchesQueryParams } from "components/PatchesPage/usePatchesQueryParams";
import { INCLUDE_COMMIT_QUEUE_USER_PATCHES } from "constants/cookies";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import { slugs } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  UserPatchesQuery,
  UserPatchesQueryVariables,
} from "gql/generated/types";
import { USER_PATCHES } from "gql/queries";
import { usePolling, useGetUserPatchesPageTitleAndLink } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams } from "types/patch";

export const UserPatches = () => {
  const dispatchToast = useToastContext();
  const { [slugs.userId]: userId } = useParams();
  const analyticsObject = useUserPatchesAnalytics();

  const [isCommitQueueCheckboxChecked] = useQueryParam(
    PatchPageQueryParams.CommitQueue,
    Cookies.get(INCLUDE_COMMIT_QUEUE_USER_PATCHES) === "true",
  );

  const patchesInput = usePatchesQueryParams();

  const { data, loading, refetch, startPolling, stopPolling } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(USER_PATCHES, {
    variables: {
      userId: userId || "",
      patchesInput: {
        ...patchesInput,
        includeCommitQueue: isCommitQueueCheckboxChecked,
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
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId) || {};

  return (
    <PatchesPage
      analyticsObject={analyticsObject}
      filterComp={<RequesterSelector />}
      pageTitle={pageTitle || "User Patches"}
      loading={loading && !data?.user.patches}
      pageType="user"
      patches={data?.user.patches}
    />
  );
};
