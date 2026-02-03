import { css } from "@emotion/react";
import { size } from "@evg-ui/lib/constants";
import widgets from "components/SpruceForm/Widgets";

const defaultTime = new Date(0);
defaultTime.setHours(0);
defaultTime.setMinutes(0);

export const initialFormState = {
  start: {
    startDate: "",
    startTime: defaultTime.toString(), // 00:00
  },
  end: {
    endDate: "",
    endTime: defaultTime.toString(), // 00:00
  },
  includeTasks: {
    includeTestFailed: true,
    includeSystemFailed: true,
    includeSetupFailed: true,
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
    type: "object" as const,
    properties: {
      start: {
        type: "object" as const,
        title: "",
        properties: {
          startDate: {
            type: "string" as const,
            title: "Start Date",
            minLength: 1,
          },
          startTime: {
            type: "string" as const,
            title: "Start Time",
            minLength: 1,
          },
        },
      },
      end: {
        type: "object" as const,
        title: "",
        properties: {
          endDate: {
            type: "string" as const,
            title: "End Date",
            minLength: 1,
          },
          endTime: {
            type: "string" as const,
            title: "End Time",
            minLength: 1,
          },
        },
      },
      includeTasks: {
        type: "object" as const,
        title: "",
        properties: {
          includeTestFailed: {
            type: "boolean" as const,
            title: "Include Failed Tasks",
          },
          includeSystemFailed: {
            type: "boolean" as const,
            title: "Include System Failed Tasks",
          },
          includeSetupFailed: {
            type: "boolean" as const,
            title: "Include Setup Failed Tasks",
          },
        },
      },
    },
  },
  uiSchema: {
    "ui:description":
      "Restart failed tasks that started and finished between two times. Uses Eastern timezone regardless of configured timezone.",
    start: {
      "ui:fieldCss": dateTimeCSS,
      startDate: {
        "ui:widget": widgets.DateWidget,
        "ui:data-cy": "start-date-picker",
      },
      startTime: {
        "ui:widget": widgets.TimeWidget,
      },
    },
    end: {
      "ui:fieldCss": dateTimeCSS,
      endDate: {
        "ui:widget": widgets.DateWidget,
        "ui:data-cy": "end-date-picker",
      },
      endTime: {
        "ui:widget": widgets.TimeWidget,
      },
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
  },
};
