import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { GetFormSchema } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { radioCSS } from "../sharedStyles";

const { gray } = palette;

const zebraCSS = css`
  :nth-child(even) {
    background-color: ${gray.light3};
  }

  :not(:last-child) {
    border-bottom: 1px solid ${gray.light2};
  }
`;

export const getFormSchema = (
  flagNames: string[],
): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as const,
    properties: Object.fromEntries(
      flagNames.map((name) => [
        name,
        {
          type: "boolean" as const,
          title: name,
          oneOf: [
            { type: "boolean" as const, title: "Enabled", enum: [true] },
            { type: "boolean" as const, title: "Disabled", enum: [false] },
          ],
        },
      ]),
    ),
  },
  uiSchema: {
    ...Object.fromEntries(
      flagNames.map((name) => [
        name,
        {
          "ui:fieldCss": zebraCSS,
          "ui:widget": widgets.RadioWidget,
          "ui:options": { inline: true, elementWrapperCSS: radioCSS },
        },
      ]),
    ),
  },
});
