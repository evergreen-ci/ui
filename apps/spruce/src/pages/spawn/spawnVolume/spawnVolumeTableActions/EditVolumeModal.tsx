import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { AjvError } from "@rjsf/core";
import { diff } from "deep-object-diff";
import { useToastContext } from "@evg-ui/lib/context";
import { useSpawnAnalytics } from "analytics";
import {
  FormState,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/editVolumeModal";
import { SpruceForm } from "components/SpruceForm";
import {
  UpdateVolumeMutation,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_VOLUME } from "gql/mutations";
import { TableVolume } from "types/spawn";

interface Props {
  maxSpawnableLimit: number;
  onCancel: () => void;
  visible: boolean;
  volume: TableVolume;
}

export const EditVolumeModal: React.FC<Props> = ({
  maxSpawnableLimit,
  onCancel,
  visible,
  volume,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();

  const [updateVolumeMutation, { loading }] = useMutation<
    UpdateVolumeMutation,
    UpdateVolumeMutationVariables
  >(UPDATE_SPAWN_VOLUME, {
    onCompleted() {
      onCancel();
      dispatchToast.success("Successfully updated volume");
    },
    onError(err) {
      onCancel();
      dispatchToast.error(
        `There was an error while updating your volume: ${err.message}`,
      );
    },
    refetchQueries: ["MyVolumes", "MyHosts"],
  });

  const initialState = useMemo(
    () => ({
      expirationDetails: {
        expiration: volume?.expiration
          ? new Date(volume?.expiration).toString()
          : undefined,
        noExpiration: volume.noExpiration,
      },
      name: volume.displayName,
      size: volume.size,
    }),
    [volume],
  );
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formErrors, setFormErrors] = useState<AjvError[]>([]);

  const updateVolume = () => {
    const mutationInput = formToGql(initialState, formState, volume.id);
    spawnAnalytics.sendEvent({
      name: "Changed spawn volume settings",
      "volume.is_unexpirable": mutationInput.noExpiration ?? false,
    });
    updateVolumeMutation({
      variables: { updateVolumeInput: mutationInput },
    });
  };

  const { disableExpirationCheckbox, noExpirationCheckboxTooltip = "" } =
    useLoadFormData(volume);

  const { schema, uiSchema } = getFormSchema({
    maxSpawnableLimit,
    minVolumeSize: volume.size,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
    hasName: initialState?.name?.length > 0,
  });

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [formState, initialState]);

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: loading ? "Saving" : "Save",
        disabled: loading || !hasChanges || !!formErrors.length,
        onClick: updateVolume,
      }}
      data-cy="update-volume-modal"
      open={visible}
      title="Edit Volume"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setFormErrors(errors);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </ConfirmationModal>
  );
};
