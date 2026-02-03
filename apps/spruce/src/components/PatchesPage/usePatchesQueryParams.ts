import Cookies from "js-cookie";
import { useQueryParam, usePagination } from "@evg-ui/lib/hooks";
import { INCLUDE_HIDDEN_PATCHES } from "constants/cookies";
import { PatchesInput } from "gql/generated/types";
import { PatchPageQueryParams, ALL_PATCH_STATUS } from "types/patch";

/**
 * usePatchesQueryParams is used alongside the Patches Page to transform URL state
 * to the input value to the patches field for the User and Project GQL type.
 * @returns - An object with all input values for the patches field except onlyCommitQueue and onlyMergeQueue
 */
export const usePatchesQueryParams = (): Omit<
  Required<PatchesInput>,
  "countLimit" | "onlyCommitQueue" | "onlyMergeQueue"
> => {
  const [patchName] = useQueryParam<string>(PatchPageQueryParams.PatchName, "");
  const [rawStatuses] = useQueryParam<string[]>(
    PatchPageQueryParams.Statuses,
    [],
  );
  const [requesters] = useQueryParam<string[]>(
    PatchPageQueryParams.Requesters,
    [],
  );
  const [hidden] = useQueryParam(PatchPageQueryParams.Hidden, false);
  const { limit, page } = usePagination();
  const statuses = rawStatuses.filter((v) => v && v !== ALL_PATCH_STATUS);
  return {
    limit,
    includeHidden: hidden || Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    page,
    patchName: `${patchName}`,
    requesters,
    statuses,
  };
};
