import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { diff } from "deep-object-diff";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  FormState,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/editVolumeModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  UpdateVolumeMutation,
  UpdateVolumeMutationVariables,
} from "gql/generated/types";
import { UPDATE_SPAWN_VOLUME } from "gql/mutations";
import { TableVolume } from "types/spawn";

interface Props {
  visible: boolean;
  onCancel: () => void;
  volume: TableVolume;
}

export const EditVolumeModal: React.FC<Props> = ({
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        expiration: new Date(volume?.expiration).toString(),
        noExpiration: volume.noExpiration,
      },
      name: volume.displayName,
    }),
    [volume],
  );
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formErrors, setFormErrors] = useState([]);

  const updateVolume = () => {
    const mutationInput = formToGql(initialState, formState, volume.id);
    spawnAnalytics.sendEvent({
      name: "Changed spawn volume settings",
      "volume.is_unexpirable": mutationInput.noExpiration,
    });
    updateVolumeMutation({
      variables: { updateVolumeInput: mutationInput },
    });
  };

  const { disableExpirationCheckbox, noExpirationCheckboxTooltip } =
    useLoadFormData(volume);

  const { schema, uiSchema } = getFormSchema({
    disableExpirationCheckbox,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    noExpirationCheckboxTooltip,
    hasName: !!initialState?.name?.length,
  });

  const hasChanges = useMemo(() => {
    const changes = diff(initialState, formState);
    return Object.entries(changes).length > 0;
  }, [formState, initialState]);

  return (
    <ConfirmationModal
      buttonText={loading ? "Saving" : "Save"}
      data-cy="update-volume-modal"
      onCancel={onCancel}
      onConfirm={updateVolume}
      open={visible}
      submitDisabled={loading || !hasChanges || !!formErrors.length}
      title="Edit Volume"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          setFormErrors(errors);
        }}
        schema={schema}
        uiSchema={uiSchema}
      />
    </ConfirmationModal>
  );
};
