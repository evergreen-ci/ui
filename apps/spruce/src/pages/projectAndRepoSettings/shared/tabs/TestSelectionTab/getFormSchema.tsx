import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { MAINLINE_REQUIRES_PATCHES_MESSAGE } from "./constants";
import { TestSelectionFormState } from "./types";

const { radioBoxOptions } = form;

export const getFormSchema = ({
  canEnableMainline,
  canEnableTaskLevel,
  repoData,
}: {
  repoData?: TestSelectionFormState;
  canEnableTaskLevel: boolean;
  canEnableMainline: boolean;
}): ReturnType<GetFormSchema> => {
  const taskLevelWarning = !canEnableTaskLevel
    ? "Test selection must be enabled for the project before it can be enabled for patches or mainline commits."
    : undefined;
  const mainlineWarning = !canEnableMainline
    ? MAINLINE_REQUIRES_PATCHES_MESSAGE
    : undefined;

  return {
    fields: {},
    schema: {
      type: "object" as const,
      title: "",
      properties: {
        projectLevel: {
          type: "object" as const,
          title: "Project-Level Test Selection",
          properties: {
            allowed: {
              type: ["boolean", "null"],
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.projectLevel.allowed ?? undefined,
              ),
            },
          },
        },
        taskLevel: {
          type: "object" as const,
          title: "Task-Level Test Selection",
          properties: {
            defaultEnabled: {
              type: ["boolean", "null"],
              title: "Run Test Selection on Patches",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.taskLevel.defaultEnabled ?? undefined,
              ),
            },
            mainlineDefaultEnabled: {
              type: ["boolean", "null"],
              title: "Run Test Selection on Mainline",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.taskLevel.mainlineDefaultEnabled ?? undefined,
              ),
            },
          },
        },
      },
    },
    uiSchema: {
      projectLevel: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:description":
          "Sets if the project can use test selection features or not.",
        allowed: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:showLabel": false,
        },
      },
      taskLevel: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:description":
          "Controls whether test selection is enabled by default for patch tasks and mainline commit tasks.",
        ...(taskLevelWarning && {
          "ui:warnings": [taskLevelWarning],
        }),
        defaultEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
        },
        mainlineDefaultEnabled: {
          "ui:widget": widgets.RadioBoxWidget,
          ...(mainlineWarning && {
            "ui:warnings": [mainlineWarning],
          }),
          ...(!canEnableMainline && {
            "ui:enumDisabled": [true],
          }),
        },
      },
    },
  };
};
