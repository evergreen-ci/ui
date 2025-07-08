import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const RunnersTab: React.FC<TabProps> = ({ runnersData }) => {
  const initialFormState = runnersData;
  const formSchema = getFormSchema();
  return (
    <>
      <H2>Runners</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Runners}
      />
    </>
  );
};
