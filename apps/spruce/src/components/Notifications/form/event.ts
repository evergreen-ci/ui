import { SpruceFormProps } from "components/SpruceForm/types";
import {
  buildRegexSelectors,
  failureTypeSubscriberOptions,
  requesterSubscriberOptions,
  taskRegexSelectors,
  regexBuildVariant,
  regexDisplayName,
} from "constants/triggers";
import {
  ExtraFieldKey,
  RegexSelector,
  Trigger,
  TaskTriggers,
  VersionTriggers,
  ProjectTriggers,
} from "types/triggers";
import { RegexSelectorRow } from "./RegexSelectorRow";

const percentChangeInput = {
  default: 10,
  minimum: 0,
  title: "Percent Change",
  type: "number" as const,
};

const taskDurationInput = {
  default: 10,
  minimum: 0,
  title: "Task Duration (seconds)",
  type: "number" as const,
};

const versionDurationInput = {
  default: 10,
  minimum: 0,
  title: "Version Duration (seconds)",
  type: "number" as const,
};

const renotifyInput = {
  default: 48,
  minimum: 0,
  title: "Re-Notify After How Many Hours",
  type: "number" as const,
};

const testNameRegexInput = {
  default: "",
  format: "validRegex",
  title: "Test Names Matching Regex",
  type: "string" as const,
};

const buildSelect = {
  default: "gitter_request",
  oneOf: [
    ...Object.keys(requesterSubscriberOptions).map((r) => ({
      enum: [r],
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      title: requesterSubscriberOptions[r],
      type: "string" as const,
    })),
  ],
  title: "Build Initiator",
  type: "string" as const,
};

const failureSelect = {
  default: "any",
  oneOf: [
    ...Object.keys(failureTypeSubscriberOptions).map((f) => ({
      enum: [f],
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      title: failureTypeSubscriberOptions[f],
      type: "string" as const,
    })),
  ],
  title: "Failure Type",
  type: "string" as const,
};

const regexSelector = (
  regexEnumsToDisable: string[],
  regexSelectors: RegexSelector[],
) => ({
  items: {
    properties: {
      regexInput: {
        format: "validRegex",
        minLength: 1,
        title: "Regex",
        type: "string" as const,
      },
      regexSelect: {
        default: regexEnumsToDisable.includes(regexBuildVariant)
          ? regexDisplayName
          : regexBuildVariant,
        oneOf: [
          ...regexSelectors.map((r) => ({
            enum: [r.type],
            title: r.typeLabel,
            type: "string" as const,
          })),
        ],
        title: "Field name",
        type: "string" as const,
      },
    },
    required: ["regexSelect", "regexInput"],
    type: "object" as const,
  },
  maxItems: 2,
  minItems: 0,
  type: "array" as const,
});

/**
 * getEventSchema returns the schema and uiSchema for the event section of subscriptions.
 * @param regexEnumsToDisable - enums that should not be selectable in the regex selector. Only allow one of each
 * (build-variant, display-name) to be selected
 * @param triggers - an object containing information about available triggers. The available triggers differ between task,
 * version, and project subscriptions
 * @returns schema and uiSchema for the event section of subscriptions
 */
export const getEventSchema = (
  regexEnumsToDisable: string[],
  triggers: Trigger,
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => ({
  schema: {
    dependencies: {
      eventSelect: {
        oneOf: [
          {
            properties: {
              eventSelect: {
                enum: [
                  TaskTriggers.TASK_STARTS,
                  TaskTriggers.TASK_FINISHES,
                  TaskTriggers.TASK_FAILS,
                  TaskTriggers.TASK_FAILS_OR_BLOCKED,
                  TaskTriggers.TASK_SUCCEEDS,
                  VersionTriggers.VERSION_FINISHES,
                  VersionTriggers.VERSION_FAILS,
                  VersionTriggers.VERSION_SUCCEEDS,
                ],
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [TaskTriggers.TASK_RUNTIME_CHANGE],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.TASK_PERCENT_CHANGE]: percentChangeInput,
                },
                required: [ExtraFieldKey.TASK_PERCENT_CHANGE],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [VersionTriggers.VERSION_RUNTIME_CHANGE],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.VERSION_PERCENT_CHANGE]: percentChangeInput,
                },
                required: [ExtraFieldKey.VERSION_PERCENT_CHANGE],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [TaskTriggers.TASK_EXCEEDS_DURATION],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.TASK_DURATION_SECS]: taskDurationInput,
                },
                required: [ExtraFieldKey.TASK_DURATION_SECS],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [VersionTriggers.VERSION_EXCEEDS_DURATION],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.VERSION_DURATION_SECS]: versionDurationInput,
                },
                required: [ExtraFieldKey.VERSION_DURATION_SECS],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  VersionTriggers.BUILD_VARIANT_FINISHES,
                  VersionTriggers.BUILD_VARIANT_FAILS,
                  VersionTriggers.BUILD_VARIANT_SUCCEEDS,
                ],
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                buildRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_VERSION_FINISHES,
                  ProjectTriggers.ANY_VERSION_FAILS,
                  ProjectTriggers.ANY_VERSION_SUCCEEDS,
                ],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
                required: [ExtraFieldKey.BUILD_INITIATOR],
                title: "",
                type: "object" as const,
              },
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_BUILD_FINISHES,
                  ProjectTriggers.ANY_BUILD_FAILS,
                  ProjectTriggers.ANY_BUILD_SUCCEEDS,
                ],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
                required: [ExtraFieldKey.BUILD_INITIATOR],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                buildRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.ANY_TASK_FINISHES,
                  ProjectTriggers.FIRST_FAILURE_VERSION,
                  ProjectTriggers.FIRST_FAILURE_BUILD,
                  ProjectTriggers.FIRST_FAILURE_TASK,
                ],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                },
                required: [ExtraFieldKey.BUILD_INITIATOR],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.ANY_TASK_FAILS],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.BUILD_INITIATOR]: buildSelect,
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                },
                required: [
                  ExtraFieldKey.FAILURE_TYPE,
                  ExtraFieldKey.BUILD_INITIATOR,
                ],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.PREVIOUS_PASSING_TASK_FAILS],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                },
                required: [
                  ExtraFieldKey.RENOTIFY_INTERVAL,
                  ExtraFieldKey.FAILURE_TYPE,
                ],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.PREVIOUS_PASSING_TEST_FAILS],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.FAILURE_TYPE]: failureSelect,
                  [ExtraFieldKey.RENOTIFY_INTERVAL]: renotifyInput,
                  [ExtraFieldKey.TEST_REGEX]: testNameRegexInput,
                },
                required: [
                  ExtraFieldKey.TEST_REGEX,
                  ExtraFieldKey.RENOTIFY_INTERVAL,
                  ExtraFieldKey.FAILURE_TYPE,
                ],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [
                  ProjectTriggers.TASK_EXCEEDS_DURATION,
                  ProjectTriggers.SUCCESSFUL_TASK_EXCEEDS_DURATION,
                ],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.TASK_DURATION_SECS]: taskDurationInput,
                },
                required: [ExtraFieldKey.TASK_DURATION_SECS],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
          {
            properties: {
              eventSelect: {
                enum: [ProjectTriggers.SUCCESSFUL_TASK_RUNTIME_CHANGES],
              },
              extraFields: {
                properties: {
                  [ExtraFieldKey.TASK_PERCENT_CHANGE]: percentChangeInput,
                },
                required: [ExtraFieldKey.TASK_PERCENT_CHANGE],
                title: "",
                type: "object" as const,
              },
              regexSelector: regexSelector(
                regexEnumsToDisable,
                taskRegexSelectors,
              ),
            },
          },
        ],
      },
    },
    properties: {
      eventSelect: {
        default: "",
        oneOf: [
          ...Object.keys(triggers).map((t) => ({
            enum: [t],
            title: triggers[t].label,
            type: "string" as const,
          })),
        ],
        title: "Event",
        type: "string" as const,
      },
    },
    required: ["eventSelect"],
    title: "Choose an Event",
    type: "object" as const,
  },
  uiSchema: {
    eventSelect: {
      "ui:allowDeselect": false,
      "ui:data-cy": "event-trigger-select",
    },
    extraFields: {
      [ExtraFieldKey.BUILD_INITIATOR]: {
        "ui:allowDeselect": false,
        "ui:data-cy": "build-initiator-select",
      },
      [ExtraFieldKey.FAILURE_TYPE]: {
        "ui:allowDeselect": false,
        "ui:data-cy": "failure-type-select",
      },
      [ExtraFieldKey.RENOTIFY_INTERVAL]: {
        "ui:data-cy": "renotify-interval-input",
      },
      [ExtraFieldKey.TASK_DURATION_SECS]: {
        "ui:data-cy": "duration-secs-input",
      },
      [ExtraFieldKey.TASK_PERCENT_CHANGE]: {
        "ui:data-cy": "percent-change-input",
      },
      [ExtraFieldKey.TEST_REGEX]: {
        "ui:data-cy": "test-regex-input",
      },
      [ExtraFieldKey.VERSION_DURATION_SECS]: {
        "ui:data-cy": "duration-secs-input",
      },
      [ExtraFieldKey.VERSION_PERCENT_CHANGE]: {
        "ui:data-cy": "percent-change-input",
      },
      "ui:showLabel": false,
    },
    regexSelector: {
      items: {
        regexInput: {
          "ui:data-cy": "regex-input",
        },
        regexSelect: {
          "ui:allowDeselect": false,
          "ui:data-cy": "regex-select",
          "ui:enumDisabled": regexEnumsToDisable,
        },
        "ui:label": false,
        "ui:ObjectFieldTemplate": RegexSelectorRow,
      },
      "ui:addButtonText": "Add additional criteria",
      "ui:addToEnd": true,
      "ui:description":
        "Regex can be specified for at most one name and one ID.",
      "ui:orderable": false,
      "ui:showLabel": false,
    },
  },
});
