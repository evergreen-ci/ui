import { H2 } from "@leafygreen-ui/typography";
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
    />
  </>
);
