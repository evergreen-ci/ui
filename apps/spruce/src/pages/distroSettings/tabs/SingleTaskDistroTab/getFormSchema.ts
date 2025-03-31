import { GetFormSchema } from "components/SpruceForm";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      projectTasksPairs: {
        type: "array" as const,
        title: "Allowed Tasks",
        items: {
          type: "object" as const,
          properties: {
            displayTitle: {
              type: "string" as const,
              title: "Project ID / Repo",
            },
            allowedTasks: {
              type: "array" as const,
              title: "",
              items: {
                title: "Task Regex",
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
        "This list will be shared between all single task distros. Only Evergreen admins can add/edit/delete allowed tasks. Please file a DEVPROD ticket to request any changes to this list.",
      items: {
        allowedTasks: {
          "ui:orderable": false,
        },
      },
    },
  },
});
