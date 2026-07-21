import { useState } from "react";
import { action } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SpruceForm, SpruceFormContainer } from "..";

export default {
  component: SpruceForm,
  title: "Components/SpruceForm/DurationField",
} satisfies CustomMeta<typeof SpruceForm>;

export const RetryFailedLogMoveLookback: CustomStoryObj<typeof SpruceForm> = {
  render: function Render() {
    const [formData, setFormData] = useState({ duration: "0s" });

    return (
      <SpruceFormContainer title="Bucket configuration">
        <SpruceForm
          formData={formData}
          onChange={({ formData: nextFormData }) => {
            action("Change duration")(nextFormData.duration);
            setFormData(nextFormData);
          }}
          schema={schema}
          uiSchema={uiSchema}
        />
      </SpruceFormContainer>
    );
  },
};

const schema = {
  type: "object" as const,
  properties: {
    duration: {
      type: "string" as const,
      title: "Retry Failed Log Move Lookback",
      format: "adminDuration",
    },
  },
};

const uiSchema = {
  duration: {
    "ui:field": "DurationField",
    "ui:options": {
      allowDisabled: true,
      defaultDuration: "7d",
      defaultLabel: "7 days",
      disabledDescription: "The retry failed log move job will be skipped.",
    },
  },
};
