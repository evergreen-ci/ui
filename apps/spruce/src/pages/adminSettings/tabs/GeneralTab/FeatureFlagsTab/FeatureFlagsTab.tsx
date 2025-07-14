import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const FeatureFlagsTab: React.FC<TabProps> = ({ featureFlagsData }) => {
  const initialFormState = featureFlagsData;
  const formSchema = getFormSchema();
  return (
    <>
      <H2>Feature Flags</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.FeatureFlags}
      />
    </>
  );
};
