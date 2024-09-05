import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  getEnabledHoursCount,
  getHostUptimeWarnings,
  validator,
} from "components/Spawn";
import {
  formToGql,
  getFormSchema,
  useLoadFormSchemaData,
  useVirtualWorkstationDefaultExpiration,
  FormState,
} from "components/Spawn/spawnHostModal";
import { SpruceForm } from "components/SpruceForm";
import { useToastContext } from "context/toast";
import {
  SpawnHostMutation,
  SpawnHostMutationVariables,
  SpawnTaskQuery,
  SpawnTaskQueryVariables,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import { SPAWN_TASK } from "gql/queries";
import { useUserTimeZone } from "hooks";
import { getString, parseQueryString } from "utils/queryString";

interface SpawnHostModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
  open,
  setOpen,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  const timeZone =
    useUserTimeZone() || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Handle distroId, taskId query param
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const taskIdQueryParam = getString(queryParams.taskId);
  const distroIdQueryParam = getString(queryParams.distroId);
  const { data: spawnTaskData } = useQuery<
    SpawnTaskQuery,
    SpawnTaskQueryVariables
  >(SPAWN_TASK, {
    skip: !(taskIdQueryParam && distroIdQueryParam),
    variables: { taskId: taskIdQueryParam },
  });

  const { formSchemaInput, loading: loadingFormData } = useLoadFormSchemaData();

  const [spawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    SpawnHostMutation,
    SpawnHostMutationVariables
  >(SPAWN_HOST, {
    onCompleted(hostMutation) {
      const { id } = hostMutation?.spawnHost ?? {};
      dispatchToast.success(`Successfully spawned host: ${id}`);
      setOpen(false);
    },
    onError(err) {
      dispatchToast.error(
        `There was an error while spawning your host: ${err.message}`,
      );
    },
    refetchQueries: ["MyHosts", "MyVolumes", "MyPublicKeys"],
  });

  const [formState, setFormState] = useState<FormState>({});
  const [hasError, setHasError] = useState(true);

  const selectedDistro = useMemo(
    () =>
      formSchemaInput?.distros?.find(
        ({ name }) => name === formState?.requiredSection?.distro,
      ),
    [formSchemaInput.distros, formState?.requiredSection?.distro],
  );

  useVirtualWorkstationDefaultExpiration({
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    isVirtualWorkstation: selectedDistro?.isVirtualWorkStation,
    setFormState,
    formState,
    disableExpirationCheckbox: formSchemaInput.disableExpirationCheckbox,
  });

  const hostUptimeWarnings = useMemo(() => {
    const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount(
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      formState?.expirationDetails?.hostUptime,
    );
    const warnings = getHostUptimeWarnings({
      enabledHoursCount,
      enabledWeekdaysCount,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      runContinuously:
        formState?.expirationDetails?.hostUptime?.sleepSchedule?.timeSelection
          ?.runContinuously,
    });
    return { enabledHoursCount, warnings };
  }, [formState?.expirationDetails?.hostUptime]);

  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const { schema, uiSchema } = getFormSchema({
    ...formSchemaInput,
    distroIdQueryParam,
    hostUptimeWarnings,
    isMigration: false,
    isVirtualWorkstation: !!selectedDistro?.isVirtualWorkStation,
    spawnTaskData: spawnTaskData?.task,
    timeZone:
      formState?.expirationDetails?.hostUptime?.details?.timeZone || timeZone,
    useSetupScript: !!formState?.setupScriptSection?.defineSetupScriptCheckbox,
    useProjectSetupScript: !!formState?.loadData?.runProjectSpecificSetupScript,
  });

  if (loadingFormData) {
    return null;
  }

  const spawnHost = () => {
    const mutationInput = formToGql({
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      isVirtualWorkStation: selectedDistro?.isVirtualWorkStation,
      formData: formState,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      myPublicKeys: formSchemaInput.myPublicKeys,
      spawnTaskData: spawnTaskData?.task,
      timeZone,
    });
    spawnAnalytics.sendEvent({
      name: "Created a spawn host",
      "host.is_volume_migration": false,
      "host.is_workstation": selectedDistro?.isVirtualWorkStation || false,
      "host.distro.id": selectedDistro?.name || "",
      "host.is_unexpirable": mutationInput?.noExpiration || false,
    });
    spawnHostMutation({
      variables: { spawnHostInput: mutationInput },
    });
  };

  return (
    <ConfirmationModal
      buttonText={loadingSpawnHost ? "Spawning" : "Spawn a host"}
      data-cy="spawn-host-modal"
      onCancel={() => {
        setOpen(false);
      }}
      onConfirm={spawnHost}
      open={open}
      submitDisabled={hasError || loadingSpawnHost}
      title="Spawn New Host"
    >
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setHasError(errors.length > 0);
        }}
        schema={schema}
        uiSchema={uiSchema}
        // @ts-expect-error rjsf v4 has insufficient typing for its validator
        validate={validator(!!spawnHost?.sleepSchedule?.permanentlyExempt)}
      />
    </ConfirmationModal>
  );
};
