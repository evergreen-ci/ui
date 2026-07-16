import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import {
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
  Provider,
} from "gql/generated/types";

export const getFormSchema = ({
  provider,
}: {
  provider: Provider;
}): ReturnType<GetFormSchema> => {
  const hasEC2Provider =
    provider !== Provider.Static && provider !== Provider.Docker;

  return {
    fields: {},
    schema: {
      properties: {
        dispatcherSettings: {
          properties: {
            version: {
              oneOf: [
                {
                  enum: [DispatcherVersion.RevisedWithDependencies],
                  title: "Revised with dependencies",
                  type: "string" as const,
                },
              ],
              title: "Task Dispatcher Version",
              type: "string" as const,
            },
          },
          title: "Task Dispatcher",
          type: "object" as const,
        },
        finderSettings: {
          properties: {
            version: {
              oneOf: [
                {
                  enum: [FinderVersion.Legacy],
                  title: "Legacy",
                  type: "string" as const,
                },
                {
                  enum: [FinderVersion.Parallel],
                  title: "Parallel",
                  type: "string" as const,
                },
                {
                  enum: [FinderVersion.Pipeline],
                  title: "Pipeline",
                  type: "string" as const,
                },
                {
                  enum: [FinderVersion.Alternate],
                  title: "Alternate",
                  type: "string" as const,
                },
              ],
              title: "Task Finder Version",
              type: "string" as const,
            },
          },
          title: "Task Finder",
          type: "object" as const,
        },
        plannerSettings: {
          dependencies: {
            version: {
              oneOf: [
                {
                  properties: {
                    tunableOptions: {
                      properties: {
                        commitQueueFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Commit Queue Factor",
                          type: "number" as const,
                        },
                        expectedRuntimeFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Expected Runtime Factor",
                          type: "number" as const,
                        },
                        generateTaskFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Generate Task Factor",
                          type: "number" as const,
                        },
                        groupVersions: {
                          default: false,
                          title: "Group versions",
                          type: "boolean" as const,
                        },
                        mainlineTimeInQueueFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Mainline Time in Queue Factor",
                          type: "number" as const,
                        },
                        numDependentsFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Number of Dependents Factor",
                          type: "number" as const,
                        },
                        patchFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Patch Factor",
                          type: "number" as const,
                        },
                        patchTimeInQueueFactor: {
                          default: 0,
                          maximum: 100,
                          minimum: 0,
                          title: "Patch Time in Queue Factor",
                          type: "number" as const,
                        },
                        targetTime: {
                          default: 0,
                          minimum: 0,
                          title: "Target Time (ms)",
                          type: "number" as const,
                        },
                      },
                      title: "",
                      type: "object" as const,
                    },
                    version: {
                      enum: [PlannerVersion.Tunable],
                    },
                  },
                },
              ],
            },
          },
          properties: {
            version: {
              oneOf: [
                {
                  enum: [PlannerVersion.Tunable],
                  title: "Tunable",
                  type: "string" as const,
                },
              ],
              title: "Task Planner Version",
              type: "string" as const,
            },
          },
          title: "Task Planner",
          type: "object" as const,
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      dispatcherSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
      finderSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
      plannerSettings: {
        tunableOptions: {
          "ui:field-data-cy": "tunable-options",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
          commitQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          expectedRuntimeFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          generateTaskFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          mainlineTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          numDependentsFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          patchFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          patchTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
        },
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
    },
  };
};
