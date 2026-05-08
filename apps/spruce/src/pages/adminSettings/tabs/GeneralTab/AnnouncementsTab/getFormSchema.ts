import { bannerThemeToLabelMap } from "components/Banners";
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
            oneOf: Object.keys(bannerThemeToLabelMap).map((k) => ({
              type: "string" as const,
              title: k,
              enum: [k],
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
      banner: {
        "ui:data-cy": "banner-text",
        "ui:widget": "textarea",
        "ui:rows": 2,
      },
      bannerTheme: {
        "ui:allowDeselect": false,
        "ui:optionsLabelMap": bannerThemeToLabelMap,
      },
    },
  },
};
