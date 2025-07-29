import { useState } from "react";
import { SettingsCard } from "components/SettingsCard";
import { SpruceForm } from "components/SpruceForm";
import { initialFormState, restartTasksForm } from "./formSchema";
import { RestartTasksButton } from "./RestartTasksButton";
import { RestartTasksFormState } from "./types";

export const RestartTasksTab: React.FC = () => {
  const [hasError, setHasError] = useState(true);
  const [formState, setFormState] =
    useState<RestartTasksFormState>(initialFormState);

  return (
    <SettingsCard>
      <SpruceForm
        formData={formState}
        onChange={({ errors, formData }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={restartTasksForm.schema}
        uiSchema={restartTasksForm.uiSchema}
      />
      <RestartTasksButton disabled={hasError} formState={formState} />
    </SettingsCard>
  );
};
