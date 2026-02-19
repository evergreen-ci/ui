import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { BannerTheme } from "gql/generated/types";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    type: "object" as const,
    properties: {
      announcements: {
        type: "object" as const,
        title: "Announcements",
        properties: {
          banner: {
            type: "string" as const,
            title: "Banner Text",
          },
          bannerTheme: {
            type: "string" as const,
            title: "Banner Style",
            oneOf: Object.values(BannerTheme).map((value) => ({
              type: "string" as const,
              title: value,
              enum: [value],
            })),
            default: [BannerTheme.Announcement],
          },
        },
      },
    },
  },
  uiSchema: {
    announcements: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
      bannerTheme: {
        "ui:allowDeselect": false,
      },
    },
  },
};
