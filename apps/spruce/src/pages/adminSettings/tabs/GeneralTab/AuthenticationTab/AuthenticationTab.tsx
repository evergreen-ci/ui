import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const AuthenticationTab: React.FC<TabProps> = ({
  authenticationData,
}) => {
  const initalFormState = authenticationData;

  return (
    <>
      <H2>Authentication</H2>
      <BaseTab
        formSchema={getFormSchema()}
        initialFormState={initalFormState}
        tab={AdminSettingsGeneralSection.Authentication}
      />
    </>
  );
};
