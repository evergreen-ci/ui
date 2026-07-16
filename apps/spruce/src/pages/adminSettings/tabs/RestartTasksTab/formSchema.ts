import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants/tokens";
import widgets from "components/SpruceForm/Widgets";

const defaultTime = new Date(0);
defaultTime.setHours(0);
defaultTime.setMinutes(0);

export const initialFormState = {
  end: {
    endDate: "",
    endTime: defaultTime.toString(), // 00:00
  },
  includeTasks: {
    includeSetupFailed: true,
    includeSystemFailed: true,
    includeTestFailed: true,
  },
  start: {
    startDate: "",
    startTime: defaultTime.toString(), // 00:00
  },
};

const dateTimeCSS = css`
  > fieldset {
    display: grid;
    grid-template-columns: 250px 250px;
    column-gap: ${size.m};
  }
`;

export const restartTasksForm = {
  schema: {
    properties: {
      end: {
        properties: {
          endDate: {
            minLength: 1,
            title: "End Date",
            type: "string" as const,
          },
          endTime: {
            minLength: 1,
            title: "End Time",
            type: "string" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      includeTasks: {
        properties: {
          includeSetupFailed: {
            title: "Include Setup Failed Tasks",
            type: "boolean" as const,
          },
          includeSystemFailed: {
            title: "Include System Failed Tasks",
            type: "boolean" as const,
          },
          includeTestFailed: {
            title: "Include Failed Tasks",
            type: "boolean" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
      start: {
        properties: {
          startDate: {
            minLength: 1,
            title: "Start Date",
            type: "string" as const,
          },
          startTime: {
            minLength: 1,
            title: "Start Time",
            type: "string" as const,
          },
        },
        title: "",
        type: "object" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    end: {
      endDate: {
        "ui:data-cy": "end-date-picker",
        "ui:widget": widgets.DateWidget,
      },
      endTime: {
        "ui:widget": widgets.TimeWidget,
      },
      "ui:fieldCss": dateTimeCSS,
    },
    includeTasks: {
      "ui:fieldCss": css`
        > fieldset {
          display: grid;
          grid-template-columns: 150px 200px 200px;
          column-gap: ${size.xs};
        }
      `,
    },
    start: {
      startDate: {
        "ui:data-cy": "start-date-picker",
        "ui:widget": widgets.DateWidget,
      },
      startTime: {
        "ui:widget": widgets.TimeWidget,
      },
      "ui:fieldCss": dateTimeCSS,
    },
    "ui:description":
      "Restart failed tasks that started and finished between two times. Uses Eastern timezone regardless of configured timezone.",
  },
};
