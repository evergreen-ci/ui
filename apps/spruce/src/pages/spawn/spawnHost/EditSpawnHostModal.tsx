import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { useSpawnAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import {
  defaultSleepSchedule,
  getHostUptimeFromGql,
  isNullSleepSchedule,
  validateUptimeSchedule,
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
import { defaultTimeZone } from "constants/fieldMaps";
import { useToastContext } from "context/toast";
import {
  EditSpawnHostMutation,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { EDIT_SPAWN_HOST } from "gql/mutations";
import { useUserTimeZone } from "hooks";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { omit } from "utils/object";

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
  const timeZone = useUserTimeZone() || defaultTimeZone;

  const {
    disableExpirationCheckbox,
    instanceTypesData,
    noExpirationCheckboxTooltip,
    publicKeysData,
    volumesData,
  } = useLoadFormData(host);

  let instanceTypes = instanceTypesData?.instanceTypes ?? [];
  // The list of instance types provided by Evergreen can be out-of-date, so make sure the instance type in use is considered valid by RJSF
  if (!instanceTypes.includes(host.instanceType)) {
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
      expiration: host.expiration ? host.expiration.toString() : null,
      noExpiration: host.noExpiration,
      hostUptime: isNullSleepSchedule(host?.sleepSchedule)
        ? getHostUptimeFromGql(defaultSleepSchedule)
        : getHostUptimeFromGql(host.sleepSchedule),
    },
    publicKeySection: { useExisting: true, publicKeyNameDropdown: "" },
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [hasError, setHasError] = useState(false);

  const hostUptimeValidation = useMemo(
    () =>
      validateUptimeSchedule({
        enabledWeekdays:
          formState?.expirationDetails?.hostUptime?.sleepSchedule
            ?.enabledWeekdays,
        ...formState?.expirationDetails?.hostUptime?.sleepSchedule
          ?.timeSelection,
        useDefaultUptimeSchedule:
          formState?.expirationDetails?.hostUptime?.useDefaultUptimeSchedule,
      }),
    [formState?.expirationDetails?.hostUptime],
  );

  const { schema, uiSchema } = getFormSchema({
    canEditInstanceType: host.status === HostStatus.Stopped,
    canEditRdpPassword:
      host.distro.isWindows && host.status === HostStatus.Running,
    canEditSshKeys: host.status === HostStatus.Running,
    disableExpirationCheckbox,
    hostUptimeValidation,
    instanceTypes: instanceTypes ?? [],
    myPublicKeys: publicKeys ?? [],
    noExpirationCheckboxTooltip,
    timeZone,
    volumes,
  });

  // EDIT HOST MUTATION
  const [editSpawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    EditSpawnHostMutation,
    EditSpawnHostMutationVariables
  >(EDIT_SPAWN_HOST, {
    onCompleted(mutationResult) {
      const { id } = mutationResult?.editSpawnHost ?? {};
      dispatchToast.success(`Successfully modified spawned host: ${id}`);
      onCancel();
    },
    onError(err) {
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
    timeZone,
  });

  const currEditState = formToGql({
    formData: formState,
    hostId: host.id,
    myPublicKeys: publicKeys,
    oldUserTags: userTags,
    timeZone,
  });

  const [hasChanges, mutationParams] = computeDiff(
    initialEditState,
    currEditState,
  );

  const onSubmit = () => {
    sendEvent({
      name: "Edited a Spawn Host",
      params: {
        hostId: host.id,
        ...omit(mutationParams, ["publicKey"]),
      },
    });
    editSpawnHostMutation({
      variables: {
        hostId: host.id,
        ...mutationParams,
      },
    });
  };

  return (
    <ConfirmationModal
      title="Edit Host Details"
      open={visible}
      data-cy="edit-spawn-host-modal"
      submitDisabled={!hasChanges || hasError || loadingSpawnHost}
      onCancel={() => {
        onCancel();
        setFormState(initialFormState);
      }}
      onConfirm={onSubmit}
      buttonText={loadingSpawnHost ? "Saving" : "Save"}
    >
      <SpruceForm
        schema={schema}
        uiSchema={uiSchema}
        formData={formState}
        onChange={({ errors, formData }) => {
          setFormState(formData);
          setHasError(errors.length > 0);
        }}
        // @ts-expect-error rjsf v4 has insufficient typing for its validator
        validate={validator}
      />
    </ConfirmationModal>
  );
};
