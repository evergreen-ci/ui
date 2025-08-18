import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const ExternalCommunicationsTab: React.FC<TabProps> = ({
  ExternalCommunicationsData,
}) => {
  const initialFormState = ExternalCommunicationsData;

  return (
    <>
      <H2>External Communications</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.ExternalCommunications}
      />
    </>
  );
};
