import { bannerThemeToLabelMap } from "components/Banners";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { BannerTheme } from "gql/generated/types";

export const formSchema: ReturnType<GetFormSchema> = {
  fields: {},
  schema: {
    properties: {
      announcements: {
        properties: {
          banner: {
            title: "Banner Text",
            type: "string" as const,
          },
          bannerTheme: {
            default: [BannerTheme.Announcement],
            oneOf: Object.keys(bannerThemeToLabelMap).map((k) => ({
              enum: [k],
              title: k,
              type: "string" as const,
            })),
            title: "Banner Style",
            type: "string" as const,
          },
        },
        title: "Announcements",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    announcements: {
      banner: {
        "ui:data-cy": "banner-text",
        "ui:rows": 2,
        "ui:widget": "textarea",
      },
      bannerTheme: {
        "ui:allowDeselect": false,
        "ui:optionsLabelMap": bannerThemeToLabelMap,
      },
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
  },
};
