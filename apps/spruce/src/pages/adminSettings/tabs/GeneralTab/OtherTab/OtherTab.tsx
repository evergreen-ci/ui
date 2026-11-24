import { useMemo } from "react";
import { H2 } from "@leafygreen-ui/typography";
import { ValidateProps } from "components/SpruceForm";
import { AdminSettingsGeneralSection } from "constants/routes";
import { BaseTab } from "../../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { OtherFormState, TabProps } from "./types";

export const validate = ((form, errors) => {
  const { appId, privateKey } = form.other.githubRecoveryApp;
  if (appId && !privateKey) {
    errors.other.githubRecoveryApp.privateKey.addError(
      "Private key must be specified if an app ID is defined.",
    );
  }
  return errors;
}) satisfies ValidateProps<OtherFormState>;

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
        validate={validate}
      />
    </>
  );
};
