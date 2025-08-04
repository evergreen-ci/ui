import { useMemo } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const ProvidersTab: React.FC<TabProps> = ({ providersData }) => {
  const initialFormState = providersData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <>
      <H2>Providers</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Providers}
      />
    </>
  );
};
