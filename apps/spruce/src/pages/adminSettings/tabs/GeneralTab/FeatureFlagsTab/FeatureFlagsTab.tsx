import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const FeatureFlagsTab: React.FC<TabProps> = ({ featureFlagsData }) => (
  <>
    <H2>Feature Flags</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={featureFlagsData}
      tab={AdminSettingsGeneralSection.FeatureFlags}
    />
  </>
);
