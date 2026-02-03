import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { useToastContext } from "@evg-ui/lib/context";
import { useSpawnAnalytics } from "analytics";
import {
  defaultSleepSchedule,
  getEnabledHoursCount,
  getHostUptimeFromGql,
  getHostUptimeWarnings,
  isNullSleepSchedule,
  validator,
} from "components/Spawn";
import {
  FormState,
  computeDiff,
  formToGql,
  getFormSchema,
  useLoadFormData,
} from "components/Spawn/editHostModal";
import { SpruceForm } from "components/SpruceForm";
import {
  EditSpawnHostMutation,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { EDIT_SPAWN_HOST } from "gql/mutations";
import { useUserTimeZone } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";

interface EditSpawnHostModalProps {
  visible?: boolean;
  onCancel: () => void;
  host: MyHost;
}
export const EditSpawnHostModal: React.FC<EditSpawnHostModalProps> = ({
  host,
  onCancel,
  visible = true,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useSpawnAnalytics();
  const timeZone =
    useUserTimeZone() || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const {
    disableExpirationCheckbox,
    instanceTypesData,
    noExpirationCheckboxTooltip = "",
    publicKeysData,
    volumesData,
  } = useLoadFormData(host);

  let instanceTypes = instanceTypesData?.instanceTypes ?? [];

  // The list of instance types provided by Evergreen can be out-of-date,
  // so make sure the instance type in use is considered valid by RJSF.
  if (host.instanceType && !instanceTypes.includes(host.instanceType)) {
    instanceTypes = [...instanceTypes, host.instanceType];
  }

  const volumes =
    volumesData?.myVolumes?.filter(
      (v) => v.availabilityZone === host.availabilityZone && v.hostID === "",
    ) ?? [];
  const userTags =
    host?.instanceTags
      ?.filter((tag) => tag.canBeModified)
      ?.map((tag) => ({ key: tag.key, value: tag.value })) ?? [];
  const publicKeys = publicKeysData?.myPublicKeys ?? [];

  const initialFormState = {
    hostName: host.displayName ?? "",
    instanceType: host.instanceType ?? "",
    volume: "",
    rdpPassword: "",
    userTags,
    expirationDetails: {
      expiration: host.expiration ? host.expiration.toString() : undefined,
      noExpiration: host.noExpiration,
      hostUptime:
        host?.sleepSchedule && !isNullSleepSchedule(host?.sleepSchedule)
          ? getHostUptimeFromGql(host.sleepSchedule)
          : getHostUptimeFromGql({ ...defaultSleepSchedule, timeZone }),
    },
    publicKeySection: { useExisting: true, publicKeyNameDropdown: "" },
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [hasError, setHasError] = useState(false);

  const hostUptimeWarnings = useMemo(() => {
    const { enabledHoursCount, enabledWeekdaysCount } = getEnabledHoursCount(
      formState?.expirationDetails?.hostUptime,
    );
    const warnings = getHostUptimeWarnings({
      enabledHoursCount,
      enabledWeekdaysCount,
      runContinuously:
        formState?.expirationDetails?.hostUptime?.sleepSchedule?.timeSelection
          ?.runContinuously ?? false,
    });
    return { enabledHoursCount, warnings };
  }, [formState?.expirationDetails?.hostUptime]);

  const { schema, uiSchema } = getFormSchema({
    canEditInstanceType: host.status === HostStatus.Stopped,
    canEditRdpPassword:
      (host?.distro?.isWindows && host.status === HostStatus.Running) ?? false,
    canEditSshKeys: host.status === HostStatus.Running,
    disableExpirationCheckbox,
    hostUptimeWarnings,
    instanceTypes: instanceTypes ?? [],
    myPublicKeys: publicKeys ?? [],
    noExpirationCheckboxTooltip,
    permanentlyExempt: !!host.sleepSchedule?.permanentlyExempt,
    timeZone:
      formState?.expirationDetails?.hostUptime?.details?.timeZone || timeZone,
    volumes,
  });

  const [editSpawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    EditSpawnHostMutation,
    EditSpawnHostMutationVariables
  >(EDIT_SPAWN_HOST, {
    onCompleted: (mutationResult) => {
      const { id } = mutationResult?.editSpawnHost ?? {};
      dispatchToast.success(`Successfully modified spawned host ${id}`);
      onCancel();
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error while modifying your host: ${err.message}`,
      );
      onCancel();
    },
    refetchQueries: ["MyHosts", "MyVolumes"],
  });

  const initialEditState = formToGql({
    formData: initialFormState,
    hostId: host.id,
    myPublicKeys: publicKeys,
    oldUserTags: userTags,
  });

  const currEditState = formToGql({
    formData: formState,
    hostId: host.id,
    myPublicKeys: publicKeys,
    oldUserTags: userTags,
  });

  const [hasChanges, mutationParams] = computeDiff(
    initialEditState,
    currEditState,
  );

  const onSubmit = () => {
    sendEvent({
      name: "Changed spawn host settings",
    });
    editSpawnHostMutation({
      variables: {
        ...mutationParams,
        hostId: host.id,
      },
    });
  };

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: () => {
          onCancel();
          setFormState(initialFormState);
        },
      }}
      confirmButtonProps={{
        children: loadingSpawnHost ? "Saving" : "Save",
        disabled: !hasChanges || hasError || loadingSpawnHost,
        onClick: onSubmit,
      }}
      data-cy="edit-spawn-host-modal"
      open={visible}
      title="Edit Host Details"
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
        validate={validator(!!host?.sleepSchedule?.permanentlyExempt)}
      />
    </ConfirmationModal>
  );
};
