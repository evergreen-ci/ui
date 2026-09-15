import { H2 } from "@leafygreen-ui/typography";
import { ValidateProps } from "components/SpruceForm";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const ProvidersTab: React.FC<TabProps> = ({ providersData }) => (
  <>
    <H2>Providers</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={providersData}
      tab={AdminSettingsGeneralSection.Providers}
      validate={validate}
    />
  </>
);

export const validate = ((formData, errors) => {
  const { mongodbEnv, mongodbOwner } = formData.providers.resourceTags;

  if (mongodbOwner && !mongodbEnv) {
    errors.providers.resourceTags.mongodbEnv.addError(
      "MongoDB Environment is required when MongoDB Owner Email is set.",
    );
  }
  if (mongodbEnv && !mongodbOwner) {
    errors.providers.resourceTags.mongodbOwner.addError(
      "MongoDB Owner Email is required when MongoDB Environment is set.",
    );
  }

  return errors;
}) satisfies ValidateProps<TabProps["providersData"]>;
