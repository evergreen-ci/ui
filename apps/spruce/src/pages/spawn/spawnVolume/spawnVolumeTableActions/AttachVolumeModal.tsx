import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Disclaimer } from "@leafygreen-ui/typography";
import { StyledLink } from "@evg-ui/lib/components/styles";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useSpawnAnalytics } from "analytics/spawn/useSpawnAnalytics";
import { ModalContent, AttachVolumeSelect } from "components/Spawn";
import { hostMountVolumeDocumentationUrl } from "constants/externalResources";
import {
  AttachVolumeToHostMutation,
  AttachVolumeToHostMutationVariables,
} from "gql/generated/types";
import { ATTACH_VOLUME } from "gql/mutations";
import { MyVolume } from "types/spawn";

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: MyVolume;
}

export const AttachVolumeModal: React.FC<Props> = ({
  onCancel,
  visible,
  volume,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  const [attachVolume, { loading: loadingAttachVolume }] = useMutation<
    AttachVolumeToHostMutation,
    AttachVolumeToHostMutationVariables
  >(ATTACH_VOLUME, {
    onError: (err) =>
      dispatchToast.error(`Error attaching volume: '${err.message}'`),
    onCompleted: () => {
      dispatchToast.success("Successfully mounted the volume.");
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });
  const targetAvailabilityZone = volume.availabilityZone;
  const [selectedHostId, setSelectedHostId] = useState("");

  const onConfirm = () => {
    spawnAnalytics.sendEvent({
      name: "Changed mounted volume on host",
      "volume.id": volume.id,
      "host.id": selectedHostId,
    });
    attachVolume({
      variables: {
        volumeAndHost: {
          volumeId: volume.id,
          hostId: selectedHostId,
        },
      },
    });
    onCancel();
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: "Attach",
        disabled: !selectedHostId || loadingAttachVolume,
        onClick: onConfirm,
      }}
      data-cy="attach-volume-modal"
      open={visible}
      title="Attach Volume to Host"
    >
      <ModalContent>
        <AttachVolumeSelect
          autofill
          onChange={setSelectedHostId}
          selectedHostId={selectedHostId}
          targetAvailabilityZone={targetAvailabilityZone}
        />
        This action will only attach the volume to the host. You will need to
        manually{" "}
        <StyledLink
          hideExternalIcon={false}
          href={hostMountVolumeDocumentationUrl}
          target="_blank"
        >
          mount the volume to the host
        </StyledLink>
        <StyledDisclaimer>
          {`Only shows running hosts in zone ${targetAvailabilityZone}.`}
        </StyledDisclaimer>
      </ModalContent>
    </ConfirmationModal>
  );
};

const StyledDisclaimer = styled(Disclaimer)`
  padding-top: ${size.xs};
`;
