import { useMemo } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const OtherTab: React.FC<TabProps> = ({ otherData }) => {
  const initialFormState = otherData;

  const formSchema = useMemo(() => getFormSchema(), []);
  return (
    <>
      <H2>Other</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={AdminSettingsGeneralSection.Other}
      />
    </>
  );
};
