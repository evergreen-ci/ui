import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const RunnersTab: React.FC<TabProps> = ({ runnersData }) => (
  <>
    <H2>Runners</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={runnersData}
      tab={AdminSettingsGeneralSection.Runners}
    />
  </>
);
