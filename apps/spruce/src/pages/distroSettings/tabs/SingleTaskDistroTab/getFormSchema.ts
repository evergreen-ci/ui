import { GetFormSchema } from "components/SpruceForm";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      projectTasksPairs: {
        items: {
          properties: {
            allowedBVs: {
              items: {
                title: "Build Variant",
                type: "string" as const,
              },
              title: "Build Variants",
              type: "array" as const,
            },
            allowedTasks: {
              items: {
                title: "Task Regex",
                type: "string" as const,
              },
              title: "Tasks",
              type: "array" as const,
            },
            projectId: {
              title: "Project ID / Repo ID",
              type: "string" as const,
            },
          },
          type: "object" as const,
        },
        title: "Allowed Tasks and Build Variants",
        type: "array" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    projectTasksPairs: {
      items: {
        allowedBVs: {
          "ui:orderable": false,
          "ui:placeholder": "No build variants.",
        },
        allowedTasks: {
          "ui:orderable": false,
          "ui:placeholder": "No tasks.",
        },
      },
      "ui:description":
        "This list is shared between all single task distros. Only Evergreen admins can add/edit/delete allowed tasks and build variants. Please file a DEVPROD ticket to request any changes to this list.",
      "ui:orderable": false,
      "ui:readonly": true,
      "ui:useExpandableCard": true,
    },
  },
});
