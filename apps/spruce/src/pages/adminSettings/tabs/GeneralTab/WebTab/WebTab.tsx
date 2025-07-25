import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const WebTab: React.FC<TabProps> = ({ webData }) => {
  const initialFormState = webData;
  const formSchema = getFormSchema();
  return (
    <>
      <H2>Web</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Web}
      />
    </>
  );
};
