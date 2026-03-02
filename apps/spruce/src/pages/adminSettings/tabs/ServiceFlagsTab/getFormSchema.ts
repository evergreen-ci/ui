import { css } from "@emotion/react";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import { GetFormSchema } from "components/SpruceForm";

const { gray } = palette;

const zebraCSS = css`
  padding-left: ${size.s};
  padding-top: ${size.xs};

  > div {
    margin-bottom: 0;
    padding-bottom: ${size.xs};
  }

  :nth-child(even) {
    background-color: ${gray.light3};
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
        },
      ]),
    ),
  },
  uiSchema: {
    "ui:objectFieldCss": zebraCSS,
    ...Object.fromEntries(
      flagNames.map((name) => [
        name,
        {
          "ui:fieldCss": zebraCSS,
        },
      ]),
    ),
  },
});
