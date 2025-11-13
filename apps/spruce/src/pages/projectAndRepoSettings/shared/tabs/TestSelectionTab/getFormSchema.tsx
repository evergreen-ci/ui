import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { TestSelectionFormState } from "./types";

const { radioBoxOptions } = form;

export const getFormSchema = ({
  canEnableTaskLevel,
  repoData,
}: {
  repoData?: TestSelectionFormState;
  canEnableTaskLevel: boolean;
}): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    title: "",
    properties: {
      allowed: {
        type: ["boolean", "null"],
        title: "Project-Level Test Selection",
        oneOf: radioBoxOptions(
          ["Enabled", "Disabled"],
          repoData?.allowed ?? undefined,
        ),
      },
      defaultEnabled: {
        type: ["boolean", "null"],
        title: "Task-Level Test Selection",
        oneOf: radioBoxOptions(
          ["Enabled", "Disabled"],
          repoData?.defaultEnabled ?? undefined,
        ),
      },
    },
  },
  uiSchema: {
    "ui:ObjectFieldTemplate": CardFieldTemplate,
    allowed: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:description":
        "Sets if the project can use test selection features or not.",
    },
    defaultEnabled: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:description":
        "If enabled, all tasks in patches run with test selection enabled by default.",
      ...(!canEnableTaskLevel && {
        "ui:warnings": [
          "This setting will only have an effect if test selection is enabled for the project.",
        ],
      }),
    },
  },
});
