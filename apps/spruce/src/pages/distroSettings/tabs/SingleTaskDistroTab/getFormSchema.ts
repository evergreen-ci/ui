import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      projectTasksPairs: {
        type: "array" as const,
        title: "Allowed Tasks and Build Variants",
        items: {
          type: "object" as const,
          properties: {
            projectId: {
              type: "string" as const,
              title: "Project ID / Identifier / Repo ID",
            },
            isRegex: {
              type: "boolean" as const,
              title: "Regex",
            },
            allowedTasks: {
              type: "array" as const,
              title: "Tasks",
              items: {
                title: "Task Regex",
                type: "string" as const,
              },
            },
            allowedBVs: {
              type: "array" as const,
              title: "Build Variants",
              items: {
                title: "Build Variant",
                type: "string" as const,
              },
            },
          },
        },
      },
    },
  },
  uiSchema: {
    projectTasksPairs: {
      "ui:readonly": true,
      "ui:orderable": false,
      "ui:useExpandableCard": true,
      "ui:description":
        "This list is shared between all single task distros. Only Evergreen admins can add/edit/delete allowed tasks and build variants. Please file a DEVPROD ticket to request any changes to this list.",
      items: {
        isRegex: {
          "ui:widget": widgets.CheckboxWidget,
          "ui:description":
            "When enabled, the project value is a regular expression matched against project identifiers.",
        },
        allowedTasks: {
          "ui:orderable": false,
          "ui:placeholder": "No tasks.",
        },
        allowedBVs: {
          "ui:orderable": false,
          "ui:placeholder": "No build variants.",
        },
      },
    },
  },
});
