import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { DistroSettingsTabRoutes } from "constants/routes";
import { BootstrapMethod, CommunicationMethod } from "gql/generated/types";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { HostFormState, TabProps } from "./types";

export const HostTab: React.FC<TabProps> = ({
  distroData,
  isSingleTaskDistro,
  provider,
}) => {
  const { getTab } = useDistroSettingsContext();
  const { formData } = getTab(DistroSettingsTabRoutes.Host);
  const architecture = formData?.setup?.arch;

  const formSchema = useMemo(
    () => getFormSchema({ architecture, isSingleTaskDistro, provider }),
    [architecture, isSingleTaskDistro, provider],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={distroData}
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      validate={validate}
    />
  );
};

const validate = ((formData, errors) => {
  const {
    containerIsolation,
    setup: { bootstrapMethod, communicationMethod },
    sshConfig,
  } = formData;

  // Ensure either Legacy SSH or non-legacy methods are used for both communication and bootstrapping.
  if (
    (bootstrapMethod === BootstrapMethod.LegacySsh &&
      communicationMethod !== CommunicationMethod.LegacySsh) ||
    (bootstrapMethod !== BootstrapMethod.LegacySsh &&
      communicationMethod === CommunicationMethod.LegacySsh)
  ) {
    errors.setup.communicationMethod.addError(
      "Legacy and non-legacy bootstrapping and communication are incompatible.",
    );
  }

  // Container isolation requires an exec user to scope between-task process
  // cleanup inside the container's PID namespace.
  if (containerIsolation?.enabled && !sshConfig?.execUser) {
    errors.sshConfig.execUser.addError(
      "Exec User is required when Container Isolation is enabled.",
    );
  }

  if (containerIsolation?.enabled && !containerIsolation?.image) {
    errors.containerIsolation.image.addError(
      "Container Image is required when Container Isolation is enabled.",
    );
  }

  if (containerIsolation?.requireIsolation && !containerIsolation?.enabled) {
    errors.containerIsolation.requireIsolation.addError(
      "Require Isolation has no effect when Container Isolation is not enabled.",
    );
  }

  return errors;
}) satisfies ValidateProps<HostFormState>;
