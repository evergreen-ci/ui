import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants";
import { useToastContext } from "@evg-ui/lib/context";
import { useDistroSettingsAnalytics } from "analytics";
import {
  DistroOnSaveOperation,
  DistroQuery,
  SaveDistroMutation,
  SaveDistroMutationVariables,
} from "gql/generated/types";
import { SAVE_DISTRO } from "gql/mutations";
import { useDistroSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { FormToGqlFunction, WritableDistroSettingsType } from "./tabs/types";

type SaveModalProps = {
  banner?: React.ReactNode;
  distro: DistroQuery["distro"];
  onCancel?: () => void;
  onConfirm?: () => void;
  open: boolean;
  tab: WritableDistroSettingsType;
};

export const SaveModal: React.FC<SaveModalProps> = ({
  banner,
  distro,
  onCancel,
  onConfirm,
  open,
  tab,
}) => {
  const { sendEvent } = useDistroSettingsAnalytics();
  const dispatchToast = useToastContext();

  const { getTab, saveTab } = useDistroSettingsContext();
  const { formData } = getTab(tab);
  const [onSaveOperation, setOnSaveOperation] = useState(
    DistroOnSaveOperation.None,
  );

  const [saveDistro] = useMutation<
    SaveDistroMutation,
    SaveDistroMutationVariables
  >(SAVE_DISTRO, {
    onCompleted({ saveDistro: { hostCount } }) {
      saveTab(tab);
      dispatchToast.success(
        `Updated distro${
          onSaveOperation !== DistroOnSaveOperation.None
            ? ` and scheduled ${hostCount} ${pluralize(
                "host",
                hostCount,
              )} to update`
            : ""
        }.`,
      );
    },
    onError(err) {
      dispatchToast.error(err.message);
    },
    refetchQueries: ["Distro"],
  });

  const handleSave = () => {
    // Only perform the save operation if the tab is valid.
    // eslint-disable-next-line no-prototype-builtins
    if (formToGqlMap.hasOwnProperty(tab)) {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      const formToGql: FormToGqlFunction<typeof tab> = formToGqlMap[tab];
      const changes = formToGql(formData, distro);
      saveDistro({
        variables: {
          distro: changes,
          onSave: onSaveOperation,
        },
      });
      sendEvent({ name: "Saved distro", section: tab });
    }
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: () => onCancel?.(),
      }}
      confirmButtonProps={{
        children: "Save",
        onClick: () => {
          onConfirm?.();
          handleSave();
        },
      }}
      data-cy="save-modal"
      open={open}
      title="Save page"
    >
      {banner}
      <StyledBody>
        Evergreen can perform one of the following actions on save:
      </StyledBody>
      <RadioGroup
        onChange={(e) =>
          setOnSaveOperation(e.target.value as DistroOnSaveOperation)
        }
        value={onSaveOperation}
      >
        <Radio value={DistroOnSaveOperation.None}>
          Nothing, only new hosts will have updated distro settings applied
        </Radio>
        <Radio value={DistroOnSaveOperation.Decommission}>
          Decommission hosts of this distro
        </Radio>
        <Radio value={DistroOnSaveOperation.RestartJasper}>
          Restart Jasper service on running hosts of this distro
        </Radio>
        <Radio value={DistroOnSaveOperation.Reprovision}>
          Reprovision running hosts of this distro
        </Radio>
      </RadioGroup>
    </ConfirmationModal>
  );
};

const StyledBody = styled(Body)<BodyProps>`
  margin-bottom: ${size.xs};
`;
