import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const WebTab: React.FC<TabProps> = ({ webData }) => (
  <>
    <H2>Web</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={webData}
      tab={AdminSettingsGeneralSection.Web}
    />
  </>
);
