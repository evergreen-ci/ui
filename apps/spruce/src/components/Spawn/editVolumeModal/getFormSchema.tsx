import { css } from "@emotion/react";
import { add } from "date-fns";
import { GetFormSchema } from "components/SpruceForm/types";
import { ExpirationRow } from "../ExpirationRow";

interface Props {
  disableExpirationCheckbox: boolean;
  hasName: boolean;
  maxSpawnableLimit: number;
  minVolumeSize: number;
  noExpirationCheckboxTooltip: string;
}

export const getFormSchema = ({
  disableExpirationCheckbox,
  hasName,
  maxSpawnableLimit,
  minVolumeSize,
  noExpirationCheckboxTooltip,
}: Props): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Volume Name",
        // The back end requires a name if one has previously been set, so prevent users from unsetting a name.
        ...(hasName && { minLength: 1 }),
      },
      size: {
        type: "number",
        title: "Volume Size (GiB)",
        minimum: minVolumeSize,
        maximum: maxSpawnableLimit,
      },
      expirationDetails: {
        type: "object",
        properties: {
          expiration: {
            type: "string" as const,
            title: "Expiration",
          },
          noExpiration: {
            type: "boolean" as const,
            title: "Never expire",
          },
        },
        dependencies: {
          noExpiration: {
            oneOf: [
              {
                properties: {
                  noExpiration: {
                    enum: [true],
                  },
                  expiration: {
                    readOnly: true,
                  },
                },
              },
              {
                properties: {
                  noExpiration: {
                    enum: [false],
                  },
                  expiration: {
                    readOnly: false,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  uiSchema: {
    name: {
      "ui:data-cy": "volume-name-input",
    },
    size: {
      "ui:data-cy": "volume-size-input",
      "ui:description": `The max volume size is ${maxSpawnableLimit} GiB. Volume size can only be updated once every 6 hours, and cannot be decreased.`,
    },
    expirationDetails: {
      "ui:ObjectFieldTemplate": ExpirationRow,
      expiration: {
        "ui:disableBefore": add(today, { days: 1 }),
        "ui:disableAfter": add(today, { days: 30 }),
        "ui:widget": "date-time",
      },
      noExpiration: {
        "ui:disabled": disableExpirationCheckbox,
        "ui:tooltipDescription": noExpirationCheckboxTooltip,
        "ui:elementWrapperCSS": checkboxCSS,
      },
    },
  },
});

const checkboxCSS = css`
  margin-bottom: 0;
`;

const today = new Date();
