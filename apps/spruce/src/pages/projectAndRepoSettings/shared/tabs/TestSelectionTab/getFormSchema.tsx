import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { TestSelectionCardFieldTemplate } from "./TestSelectionCardFieldTemplate";
import { TestSelectionFormState } from "./types";

const { radioBoxOptions } = form;

const getTaskLevelWarning = (
  canEnableTaskLevel: boolean,
  mainlineRequiresPatches: boolean,
) => {
  if (!canEnableTaskLevel) {
    return "Test selection must be enabled for the project before it can be enabled for patches or mainline commits.";
  }
  if (mainlineRequiresPatches) {
    return "Test selection cannot be enabled for mainline commits without also being enabled for patches.";
  }
};

export const getFormSchema = ({
  canEnableTaskLevel,
  mainlineRequiresPatches,
  repoData,
}: {
  repoData?: TestSelectionFormState;
  canEnableTaskLevel: boolean;
  mainlineRequiresPatches: boolean;
}): ReturnType<GetFormSchema> => {
  const taskLevelWarning = getTaskLevelWarning(
    canEnableTaskLevel,
    mainlineRequiresPatches,
  );

  return {
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
          title: "Run Test Selection on Patches",
          oneOf: radioBoxOptions(
            ["Enabled", "Disabled"],
            repoData?.defaultEnabled ?? undefined,
          ),
        },
        mainlineDefaultEnabled: {
          type: ["boolean", "null"],
          title: "Run Test Selection on Mainline",
          oneOf: radioBoxOptions(
            ["Enabled", "Disabled"],
            repoData?.mainlineDefaultEnabled ?? undefined,
          ),
        },
      },
    },
    uiSchema: {
      "ui:ObjectFieldTemplate": TestSelectionCardFieldTemplate,
      ...(taskLevelWarning && {
        "ui:warnings": [taskLevelWarning],
      }),
      allowed: {
        "ui:widget": widgets.RadioBoxWidget,
        "ui:showLabel": false,
      },
      defaultEnabled: {
        "ui:widget": widgets.RadioBoxWidget,
      },
      mainlineDefaultEnabled: {
        "ui:widget": widgets.RadioBoxWidget,
        ...(mainlineRequiresPatches && {
          "ui:enumDisabled": [true],
        }),
      },
    },
  };
};
