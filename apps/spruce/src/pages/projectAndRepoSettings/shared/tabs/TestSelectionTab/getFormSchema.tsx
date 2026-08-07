import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import widgets from "components/SpruceForm/Widgets";
import { form } from "../utils";
import { TaskLevelTestSelection, TestSelectionFormState } from "./types";

const { radioBoxOptions } = form;

const taskLevelLabels: Record<TaskLevelTestSelection, string> = {
  [TaskLevelTestSelection.Disabled]: "Disabled",
  [TaskLevelTestSelection.Patches]: "Enabled for patches",
  [TaskLevelTestSelection.PatchesAndMainline]:
    "Enabled for patches and mainline commits",
};

const taskLevelSettings = [
  TaskLevelTestSelection.Disabled,
  TaskLevelTestSelection.Patches,
  TaskLevelTestSelection.PatchesAndMainline,
];

const taskLevelOption = (
  title: string,
  value: TaskLevelTestSelection | null,
): SpruceFormProps["schema"] => ({
  type: ["string", "null"],
  title,
  enum: [value],
});

const taskLevelOptions = (
  repoSetting?: TaskLevelTestSelection,
): Array<SpruceFormProps["schema"]> => {
  const options = taskLevelSettings.map((setting) =>
    taskLevelOption(taskLevelLabels[setting], setting),
  );

  if (repoSetting) {
    options.push(
      taskLevelOption(
        `Default to repo (${taskLevelLabels[repoSetting].toLowerCase()})`,
        null,
      ),
    );
  }

  return options;
};

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
      taskLevel: {
        type: ["string", "null"],
        title: "Task-Level Test Selection",
        oneOf: taskLevelOptions(repoData?.taskLevel ?? undefined),
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
    taskLevel: {
      "ui:widget": widgets.RadioBoxWidget,
      "ui:description":
        "Controls whether test selection is enabled by default for patch tasks, or for both patch and mainline commit tasks.",
      ...(!canEnableTaskLevel && {
        "ui:warnings": [
          "This setting will only have an effect if test selection is enabled for the project.",
        ],
      }),
    },
  },
});
