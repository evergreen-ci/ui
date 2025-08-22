import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const BackgroundProcessingTab: React.FC<TabProps> = ({
  backgroundProcessingData,
}) => {
  const initialFormState = backgroundProcessingData;
  return (
    <>
      <H2>Background Processing</H2>
      <BaseTab
        formSchema={getFormSchema()}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.BackgroundProcessing}
      />
    </>
  );
};
