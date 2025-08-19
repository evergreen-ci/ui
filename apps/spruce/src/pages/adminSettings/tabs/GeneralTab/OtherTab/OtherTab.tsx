import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const OtherTab: React.FC<TabProps> = ({ otherData }) => {
  const initalFormState = otherData;
  const formSchema = getFormSchema({
    projectRefs: otherData.other.projectRefs,
    repoRefs: otherData.other.repoRefs,
  });
  return (
    <>
      <H2>Other</H2>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initalFormState}
        tab={AdminSettingsGeneralSection.Other}
      />
    </>
  );
};
