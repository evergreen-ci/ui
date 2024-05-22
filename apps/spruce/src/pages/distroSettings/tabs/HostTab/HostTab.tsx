import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { DistroSettingsTabRoutes } from "constants/routes";
import { BootstrapMethod, CommunicationMethod } from "gql/generated/types";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { HostFormState, TabProps } from "./types";

export const HostTab: React.FC<TabProps> = ({ distroData, provider }) => {
  const { getTab } = useDistroSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: HostFormState } = getTab(
    DistroSettingsTabRoutes.Host,
  );
  const architecture = formData?.setup?.arch;

  const formSchema = useMemo(
    () => getFormSchema({ architecture, provider }),
    [architecture, provider],
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
    setup: { bootstrapMethod, communicationMethod },
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

  return errors;
}) satisfies ValidateProps<HostFormState>;
