import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  formToGql,
  getFormSchema,
  useLoadFormSchemaData,
  useVirtualWorkstationDefaultExpiration,
} from "components/Spawn/spawnHostModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  MigrateVolumeMutation,
  MigrateVolumeMutationVariables,
} from "gql/generated/types";
import { MIGRATE_VOLUME } from "gql/mutations";
import { AZToRegion } from "pages/spawn/utils";
import { TableVolume } from "types/spawn";
import { omit } from "utils/object";
import { initialState, Page, reducer } from "./migrateVolumeReducer";

interface MigrateVolumeModalProps {
  volume: TableVolume;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MigrateVolumeModal: React.FC<MigrateVolumeModalProps> = ({
  open,
  setOpen,
  volume,
}) => {
  const [{ form, hasError, page }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const onPageOne = page === Page.First;

  const dispatchToast = useToastContext();
  const { sendEvent } = useSpawnAnalytics();

  const { formSchemaInput, loading: loadingFormData } = useLoadFormSchemaData({
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    host: volume.host,
  });
  const [migrateVolumeMutation, { loading: loadingMigration }] = useMutation<
    MigrateVolumeMutation,
    MigrateVolumeMutationVariables
  >(MIGRATE_VOLUME, {
    onCompleted() {
      dispatchToast.success(
        "Volume migration has been scheduled. A new host will be spawned and accessible on your Hosts page.",
      );
      setOpen(false);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error during volume migration: ${err.message}`,
      );
      dispatch({ type: "resetPage" });
    },
    refetchQueries: ["MyHosts", "MyVolumes", "MyPublicKeys"],
  });

  const distros = useMemo(
    () => formSchemaInput.distros?.filter((d) => d.isVirtualWorkStation),
    [formSchemaInput.distros],
  );

  const selectedDistro = useMemo(
    () => distros?.find(({ name }) => name === form?.requiredSection?.distro),
    [distros, form?.requiredSection?.distro],
  );

  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    distros,
    isMigration: true,
    isVirtualWorkstation: !!selectedDistro?.isVirtualWorkStation,
    userAwsRegion: AZToRegion(volume.availabilityZone),
  });
  useVirtualWorkstationDefaultExpiration({
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    isVirtualWorkstation: selectedDistro?.isVirtualWorkStation,
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
    formState: form,
    setFormState: (formState) =>
      dispatch({ type: "setForm", payload: formState }),
  });

  useEffect(() => {
    if (!open) {
      dispatch({ type: "resetForm" });
    }
  }, [open]);

  const migrateVolume = useCallback(() => {
    const mutationInput = formToGql({
      isVirtualWorkStation: !!selectedDistro?.isVirtualWorkStation,
      formData: form,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      myPublicKeys: formSchemaInput.myPublicKeys,
      migrateVolumeId: volume.id,
    });
    sendEvent({
      name: "Created a spawn host",
      isMigration: true,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      params: omit(mutationInput, [
        "publicKey",
        "userDataScript",
        "setUpScript",
      ]),
    });
    migrateVolumeMutation({
      variables: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        spawnHostInput: mutationInput,
        volumeId: volume.id,
      },
    });
  }, [
    formSchemaInput.myPublicKeys,
    form,
    volume,
    migrateVolumeMutation,
    sendEvent,
    selectedDistro?.isVirtualWorkStation,
  ]);

  const title = onPageOne
    ? "Migrate Volume"
    : "Are you sure you want to migrate this home volume?";

  let buttonText = "Migrate Volume";
  if (loadingMigration) {
    buttonText = "Migrating";
  } else if (onPageOne) {
    buttonText = "Next";
  }

  const onConfirm = useCallback(() => {
    if (onPageOne) {
      dispatch({ type: "goToNextPage" });
    } else {
      migrateVolume();
    }
  }, [onPageOne, migrateVolume, dispatch]);

  const onCancel = useCallback(() => {
    if (onPageOne) {
      setOpen(false);
    }
    dispatch({ type: "resetPage" });
  }, [onPageOne, dispatch, setOpen]);

  if (loadingFormData) {
    return null;
  }

  return (
    <ConfirmationModal
      title={title}
      open={open}
      submitDisabled={hasError || loadingMigration || volume.migrating}
      onConfirm={onConfirm}
      data-cy="migrate-modal"
      buttonText={buttonText}
      onCancel={onCancel}
    >
      <Body>
        Migrate this home volume to a new host. Upon successful migration, the
        unused host will be scheduled to expire in 24 hours.
      </Body>
      {onPageOne && (
        <SpruceForm
          schema={schema}
          uiSchema={uiSchema}
          formData={form}
          onChange={({ errors, formData }) => {
            dispatch({ type: "setForm", payload: formData });
            dispatch({ type: "setHasError", payload: errors.length > 0 });
          }}
        />
      )}
    </ConfirmationModal>
  );
};
