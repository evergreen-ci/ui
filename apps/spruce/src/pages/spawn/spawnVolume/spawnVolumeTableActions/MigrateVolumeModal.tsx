import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useSpawnAnalytics } from "analytics";
import { getEnabledHoursCount, getHostUptimeWarnings } from "components/Spawn";
import {
  TokenExchangeState,
  formToGql,
  getFormSchema,
  useLoadFormSchemaData,
  useVirtualWorkstationDefaultExpiration,
} from "components/Spawn/spawnHostModal";
import { SpruceForm } from "components/SpruceForm";
import {
  MigrateVolumeMutation,
  MigrateVolumeMutationVariables,
} from "gql/generated/types";
import { MIGRATE_VOLUME } from "gql/mutations";
import { useUserTimeZone } from "hooks";
import { AZToRegion } from "pages/spawn/utils";
import { TableVolume } from "types/spawn";
import { Page, initialState, reducer } from "./migrateVolumeReducer";

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
    host: volume.host ?? { noExpiration: false },
  });
  const timeZone =
    useUserTimeZone() || Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  const hostUptimeWarnings = useMemo(() => {
    const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount(
      form?.expirationDetails?.hostUptime,
    );
    const warnings = getHostUptimeWarnings({
      enabledHoursCount,
      enabledWeekdaysCount,
      runContinuously:
        form?.expirationDetails?.hostUptime?.sleepSchedule?.timeSelection
          ?.runContinuously ?? false,
    });
    return { enabledHoursCount, warnings };
  }, [form?.expirationDetails?.hostUptime]);

  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    availableRegions: selectedDistro?.availableRegions ?? [],
    distros,
    hostUptimeWarnings,
    isMigration: true,
    isVirtualWorkstation: !!selectedDistro?.isVirtualWorkStation,
    timeZone,
    // The migrate volume never requires a token exchange and doesn't
    // have a valid task, so we can fill in any value here.
    tokenExchangeState: TokenExchangeState.NeedsAuthentication,
    userAwsRegion: AZToRegion(volume.availabilityZone),
  });

  useVirtualWorkstationDefaultExpiration({
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
    formState: form,
    isVirtualWorkstation: selectedDistro?.isVirtualWorkStation ?? false,
    setFormState: (formState) =>
      dispatch({ payload: formState, type: "setForm" }),
  });

  useEffect(() => {
    if (!open) {
      dispatch({ type: "resetForm" });
    }
  }, [open]);

  const migrateVolume = useCallback(() => {
    const mutationInput = formToGql({
      formData: form,
      isVirtualWorkStation: !!selectedDistro?.isVirtualWorkStation,
      migrateVolumeId: volume.id,
      myPublicKeys: formSchemaInput.myPublicKeys,
    });
    sendEvent({
      "host.distro.id": mutationInput?.distroId || "",
      "host.is_from_task": false,
      "host.is_unexpirable": mutationInput?.noExpiration || false,
      "host.is_volume_migration": true,
      "host.is_workstation": mutationInput?.isVirtualWorkStation || false,
      name: "Created a spawn host",
    });
    migrateVolumeMutation({
      variables: {
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

  let buttonText = "Migrate volume";
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
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: buttonText,
        disabled: hasError || loadingMigration || volume.migrating,
        onClick: onConfirm,
      }}
      data-cy="migrate-modal"
      open={open}
      title={title}
    >
      <Body>
        Migrate this home volume to a new host. Upon successful migration, the
        unused host will be scheduled to expire in 24 hours.
      </Body>
      {onPageOne && (
        <SpruceForm
          formData={form}
          onChange={({ errors, formData }) => {
            dispatch({ payload: formData, type: "setForm" });
            dispatch({ payload: errors.length > 0, type: "setHasError" });
          }}
          schema={schema}
          uiSchema={uiSchema}
        />
      )}
    </ConfirmationModal>
  );
};
