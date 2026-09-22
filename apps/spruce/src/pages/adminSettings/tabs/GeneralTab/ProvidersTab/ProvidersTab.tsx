import { H2 } from "@leafygreen-ui/typography";
import { ValidateProps } from "components/SpruceForm";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { ProvidersFormState, TabProps } from "./types";

export const validateResourceTags =
  (
    initialResourceTags: ProvidersFormState["providers"]["aws"]["resourceTags"],
  ): ValidateProps<ProvidersFormState> =>
  (form, errors) => {
    const { resourceTags } = form.providers.aws;
    const resourceTagErrors = errors.providers.aws.resourceTags;

    if (initialResourceTags.mongodbEnv && !resourceTags.mongodbEnv) {
      resourceTagErrors.mongodbEnv.addError(
        "MongoDB Environment cannot be unset after it has been configured.",
      );
    }
    if (initialResourceTags.mongodbOwner && !resourceTags.mongodbOwner) {
      resourceTagErrors.mongodbOwner.addError(
        "MongoDB Owner Email cannot be unset after it has been configured.",
      );
    }

    return errors;
  };

export const ProvidersTab: React.FC<TabProps> = ({ providersData }) => {
  const { resourceTags } = providersData.providers.aws;

  return (
    <>
      <H2>Providers</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={providersData}
        tab={AdminSettingsGeneralSection.Providers}
        validate={validateResourceTags(resourceTags)}
      />
    </>
  );
};
