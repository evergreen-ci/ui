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
    properties: {
      allowed: {
        oneOf: radioBoxOptions(
          ["Enabled", "Disabled"],
          repoData?.allowed ?? undefined,
        ),
        title: "Project-Level Test Selection",
        type: ["boolean", "null"],
      },
      defaultEnabled: {
        oneOf: radioBoxOptions(
          ["Enabled", "Disabled"],
          repoData?.defaultEnabled ?? undefined,
        ),
        title: "Task-Level Test Selection",
        type: ["boolean", "null"],
      },
    },
    title: "",
    type: "object" as const,
  },
  uiSchema: {
    allowed: {
      "ui:description":
        "Sets if the project can use test selection features or not.",
      "ui:widget": widgets.RadioBoxWidget,
    },
    defaultEnabled: {
      "ui:description":
        "If enabled, all tasks in patches run with test selection enabled by default.",
      "ui:widget": widgets.RadioBoxWidget,
      ...(!canEnableTaskLevel && {
        "ui:warnings": [
          "This setting will only have an effect if test selection is enabled for the project.",
        ],
      }),
    },
    "ui:ObjectFieldTemplate": CardFieldTemplate,
  },
});
