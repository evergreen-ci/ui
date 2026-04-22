import { css } from "@emotion/react";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { BannerTheme } from "gql/generated/types";

const textAreaCSS = css`
  max-width: 400px;
`;

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
      banner: {
        "ui:widget": "textarea",
        "ui:elementWrapperCSS": textAreaCSS,
        "ui:rows": 4,
      },
      bannerTheme: {
        "ui:allowDeselect": false,
      },
    },
  },
};
