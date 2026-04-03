import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
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
          <OptionLabel>
            <span>Nothing</span>
            <Tooltip
              align="top"
              justify="start"
              trigger={
                <InfoIconButton
                  aria-label="More info about doing nothing on save"
                  data-cy="save-action-none-tooltip"
                >
                  <Icon glyph="InfoWithCircle" />
                </InfoIconButton>
              }
            >
              Apply updated distro settings only to hosts created in the future;
              existing hosts keep their current configuration.
            </Tooltip>
          </OptionLabel>
        </Radio>

        <Radio value={DistroOnSaveOperation.Decommission}>
          <OptionLabel>
            <span>Decommission hosts of this distro</span>
            <Tooltip
              align="top"
              justify="start"
              trigger={
                <InfoIconButton
                  aria-label="More info about decommissioning hosts of this distro"
                  data-cy="save-action-decommission-tooltip"
                >
                  <Icon glyph="InfoWithCircle" />
                </InfoIconButton>
              }
            >
              Mark all hosts of this distro for termination after they finish
              their current work. Evergreen stops scheduling new tasks on them
              and cleans them up.
            </Tooltip>
          </OptionLabel>
        </Radio>

        <Radio value={DistroOnSaveOperation.RestartJasper}>
          <OptionLabel>
            <span>Restart Jasper service on running hosts of this distro</span>
            <Tooltip
              align="top"
              justify="start"
              trigger={
                <InfoIconButton
                  aria-label="More info about restarting Jasper on this distro"
                  data-cy="save-action-restart-jasper-tooltip"
                >
                  <Icon glyph="InfoWithCircle" />
                </InfoIconButton>
              }
            >
              Restart the Jasper process management service on running hosts so
              Evergreen can restart agents and pick up the new configuration.
            </Tooltip>
          </OptionLabel>
        </Radio>

        <Radio value={DistroOnSaveOperation.Reprovision}>
          <OptionLabel>
            <span>Reprovision running hosts of this distro</span>
            <Tooltip
              align="top"
              justify="start"
              trigger={
                <InfoIconButton
                  aria-label="More info about reprovisioning hosts of this distro"
                  data-cy="save-action-reprovision-tooltip"
                >
                  <Icon glyph="InfoWithCircle" />
                </InfoIconButton>
              }
            >
              Re-run Evergreen provisioning on running hosts (start Jasper,
              download Evergreen binaries, start the agent) using the updated
              distro settings.
            </Tooltip>
          </OptionLabel>
        </Radio>
      </RadioGroup>
    </ConfirmationModal>
  );
};

const StyledBody = styled(Body)`
  margin-bottom: ${size.xs};
`;

const OptionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${size.xs};
`;

const InfoIconButton = styled(IconButton)`
  && {
    padding: 0;
  }
`;
