import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const BackgroundProcessingTab: React.FC<TabProps> = ({
  backgroundProcessingData,
}) => (
  <>
    <H2>Background Processing</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={backgroundProcessingData}
      tab={AdminSettingsGeneralSection.BackgroundProcessing}
    />
  </>
);
