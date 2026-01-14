import { useMutation } from "@apollo/client/react";
import { MenuItem } from "@leafygreen-ui/menu";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { usePatchAnalytics } from "analytics";
import {
  SetPatchVisibilityMutation,
  SetPatchVisibilityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_VISIBILITY } from "gql/mutations";

interface Props {
  isPatchHidden: boolean;
  patchId: string;
  refetchQueries?: string[];
}
export const SetPatchVisibility: React.FC<Props> = ({
  isPatchHidden,
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePatchAnalytics(patchId);
  const [setPatchVisibility] = useMutation<
    SetPatchVisibilityMutation,
    SetPatchVisibilityMutationVariables
  >(SET_PATCH_VISIBILITY, {
    onCompleted: (d) => {
      const copy = d.setPatchVisibility?.[0].hidden ? "hidden" : "unhidden";
      dispatchToast.success(`This patch was successfully ${copy}.`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to update patch visibility: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <MenuItem
      onClick={() => {
        sendEvent({
          name: "Toggled patch visibility",
          "patch.hidden": !isPatchHidden,
        });
        setPatchVisibility({
          variables: { patchIds: [patchId], hidden: !isPatchHidden },
        });
      }}
    >
      {isPatchHidden ? "Unhide" : "Hide"} patch
    </MenuItem>
  );
};
