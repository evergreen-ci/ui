import { H2 } from "@leafygreen-ui/typography";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { formSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const AuthenticationTab: React.FC<TabProps> = ({
  authenticationData,
}) => (
  <>
    <H2>Authentication</H2>
    <BaseTab
      formSchema={formSchema}
      initialFormState={authenticationData}
      tab={AdminSettingsGeneralSection.Authentication}
    />
  </>
);
