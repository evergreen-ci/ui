import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  FormState,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/spawnVolumeModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
} from "gql/generated/types";
import { SPAWN_VOLUME } from "gql/mutations";
import { HostStatus } from "types/host";

interface SpawnVolumeModalProps {
  visible: boolean;
  onCancel: () => void;
  maxSpawnableLimit: number;
}

export const SpawnVolumeModal: React.FC<SpawnVolumeModalProps> = ({
  maxSpawnableLimit,
  onCancel,
  visible,
}) => {
  const spawnAnalytics = useSpawnAnalytics();
  const dispatchToast = useToastContext();

  const [spawnVolumeMutation, { loading: loadingSpawnVolume }] = useMutation<
    SpawnVolumeMutation,
    SpawnVolumeMutationVariables
  >(SPAWN_VOLUME, {
    onCompleted() {
      dispatchToast.success("Successfully spawned volume");
      onCancel();
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while spawning your volume: ${err.message}`,
      );
      onCancel();
    },
    refetchQueries: ["MyVolumes"],
  });

  const spawnVolume = () => {
    const mutationInput = formToGql({ formData: formState });
    spawnAnalytics.sendEvent({
      name: "Created a volume",
      "volume.type": mutationInput.type,
      "volume.size": mutationInput.size,
      "volume.is_unexpirable": mutationInput.noExpiration || false,
    });
    spawnVolumeMutation({
      variables: { spawnVolumeInput: mutationInput },
    });
  };

  const {
    availabilityZones,
    disableExpirationCheckbox,
    hosts,
    loadingFormData,
    noExpirationCheckboxTooltip,
    types,
  } = useLoadFormData();

  const [canSubmit, setCanSubmit] = useState(true);
  const [formState, setFormState] = useState<FormState>({});

  const availableHosts = hosts
    .filter(
      ({ availabilityZone, status }) =>
        availabilityZone ===
          formState?.requiredVolumeInformation?.availabilityZone &&
        (status === HostStatus.Running || status === HostStatus.Stopped),
    )
    .map(({ displayName, id }) => ({ id, displayName }))
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const { schema, uiSchema } = getFormSchema({
    maxSpawnableLimit,
    availabilityZones,
    types,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    hosts: availableHosts,
    disableExpirationCheckbox,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    noExpirationCheckboxTooltip,
  });

  if (loadingFormData) {
    return null;
  }

  return (
    <ConfirmationModal
      buttonText={loadingSpawnVolume ? "Spawning volume" : "Spawn"}
      data-cy="spawn-volume-modal"
      onCancel={onCancel}
      onConfirm={spawnVolume}
      open={visible}
      submitDisabled={loadingSpawnVolume || !canSubmit}
      title="Spawn New Volume"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setCanSubmit(errors.length === 0);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </ConfirmationModal>
  );
};
