import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { form, ProjectType } from "../utils";
import { AccessFormState } from "./types";

const { radioBoxOptions } = form;

export const getFormSchema = (
  projectType: ProjectType,
  repoData?: AccessFormState,
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    properties: {
      accessSettings: {
        properties: {
          restricted: {
            oneOf: radioBoxOptions(
              ["Restricted", "Unrestricted"],
              repoData?.accessSettings?.restricted ?? undefined,
            ),
            title: "Internal Access",
            type: ["boolean", "null"],
          },
        },
        title: "Access Settings",
        type: "object" as const,
      },
      admin: {
        properties: {
          admins: {
            items: {
              default: "",
              format: "noStartingOrTrailingWhitespace",
              minLength: 1,
              title: "Username",
              type: "string" as const,
            },
            type: "array" as const,
          },
        },
        title: "Admin",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    accessSettings: {
      restricted: {
        "ui:description":
          "If restricted, logged-in users by default will not be able to access this project. Access must be granted via MANA.",
        "ui:widget": widgets.RadioBoxWidget,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "access",
    },
    admin: {
      admins: {
        "ui:addButtonText": "Add Username",
        "ui:description": getAdminsDescription(projectType),
        "ui:orderable": false,
        "ui:showLabel": false,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      "ui:rootFieldId": "admin",
    },
  },
});

const getAdminsDescription = (projectType: ProjectType): string => {
  const descriptions = {
    default: "Admins for this branch will be able to edit branch settings.",
    [ProjectType.AttachedProject]:
      "Admins for this branch will be able to edit branch settings and view repo settings.",
    [ProjectType.Repo]:
      "Admins for this repo will be able to edit repo settings and any attached branches’ settings.",
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const description = descriptions[projectType] || descriptions.default;
  return `${description} All admins will have access to create new projects on Evergreen.`;
};
