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
      type: "object" as const,
      properties: {
        finderSettings: {
          type: "object" as const,
          title: "Task Finder",
          properties: {
            version: {
              type: "string" as const,
              title: "Task Finder Version",
              oneOf: [
                {
                  type: "string" as const,
                  title: "Legacy",
                  enum: [FinderVersion.Legacy],
                },
                {
                  type: "string" as const,
                  title: "Parallel",
                  enum: [FinderVersion.Parallel],
                },
                {
                  type: "string" as const,
                  title: "Pipeline",
                  enum: [FinderVersion.Pipeline],
                },
                {
                  type: "string" as const,
                  title: "Alternate",
                  enum: [FinderVersion.Alternate],
                },
              ],
            },
          },
        },
        plannerSettings: {
          type: "object" as const,
          title: "Task Planner",
          properties: {
            version: {
              type: "string" as const,
              title: "Task Planner Version",
              oneOf: [
                {
                  type: "string" as const,
                  title: "Legacy",
                  enum: [PlannerVersion.Legacy],
                },
                {
                  type: "string" as const,
                  title: "Tunable",
                  enum: [PlannerVersion.Tunable],
                },
              ],
            },
          },
          dependencies: {
            version: {
              oneOf: [
                {
                  properties: {
                    version: {
                      enum: [PlannerVersion.Legacy],
                    },
                  },
                },
                {
                  properties: {
                    version: {
                      enum: [PlannerVersion.Tunable],
                    },
                    tunableOptions: {
                      type: "object" as const,
                      title: "",
                      properties: {
                        targetTime: {
                          type: "number" as const,
                          title: "Target Time (ms)",
                          default: 0,
                          minimum: 0,
                        },
                        patchFactor: {
                          type: "number" as const,
                          title: "Patch Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        patchTimeInQueueFactor: {
                          type: "number" as const,
                          title: "Patch Time in Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        mainlineTimeInQueueFactor: {
                          type: "number" as const,
                          title: "Mainline Time in Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        commitQueueFactor: {
                          type: "number" as const,
                          title: "Commit Queue Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        expectedRuntimeFactor: {
                          type: "number" as const,
                          title: "Expected Runtime Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        generateTaskFactor: {
                          type: "number" as const,
                          title: "Generate Task Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        numDependentsFactor: {
                          type: "number" as const,
                          title: "Number of Dependents Factor",
                          default: 0,
                          minimum: 0,
                          maximum: 100,
                        },
                        groupVersions: {
                          type: "boolean" as const,
                          title: "Group versions",
                          default: false,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        dispatcherSettings: {
          type: "object" as const,
          title: "Task Dispatcher",
          properties: {
            version: {
              type: "string" as const,
              title: "Task Dispatcher Version",
              oneOf: [
                {
                  type: "string" as const,
                  title: "Revised with dependencies",
                  enum: [DispatcherVersion.RevisedWithDependencies],
                },
              ],
            },
          },
        },
      },
    },
    uiSchema: {
      finderSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
      plannerSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
        tunableOptions: {
          "ui:field-data-cy": "tunable-options",
          ...(!hasEC2Provider && { "ui:widget": "hidden" }),
          patchFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          patchTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
          mainlineTimeInQueueFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
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
          numDependentsFactor: {
            "ui:description":
              "Set 0 to use global default. Value should range from 0 to 100 inclusive.",
          },
        },
      },
      dispatcherSettings: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        version: {
          "ui:allowDeselect": false,
        },
      },
    },
  };
};
