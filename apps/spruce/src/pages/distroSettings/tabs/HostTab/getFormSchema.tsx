import { GetFormSchema } from "components/SpruceForm";
import { Arch, BootstrapMethod, Provider } from "gql/generated/types";
import { nonWindowsArchitectures, windowsArchitectures } from "./constants";
import {
  allocation as allocationProperties,
  bootstrap as bootstrapProperties,
  containerIsolation as containerIsolationProperties,
  icecreamConfigPath,
  icecreamSchedulerHost,
  isVirtualWorkStation,
  rootDir,
  setup,
  sshConfig as sshConfigProperties,
} from "./schemaFields";
import { HostFormState } from "./types";

type FormSchemaParams = {
  architecture: Arch;
  bootstrapMethod: BootstrapMethod | undefined;
  bootstrapSettings: HostFormState["bootstrapSettings"];
  isSingleTaskDistro: boolean;
  provider: Provider;
};

export const getFormSchema = ({
  architecture,
  bootstrapMethod,
  bootstrapSettings: initialBootstrapSettings,
  isSingleTaskDistro,
  provider,
}: FormSchemaParams): ReturnType<GetFormSchema> => {
  const hasStaticProvider = provider === Provider.Static;
  const hasDockerProvider = provider === Provider.Docker;
  const hasEC2Provider = !hasStaticProvider && !hasDockerProvider;
  const bootstrapSettingsWithDefault = {
    ...bootstrapSettings,
    default: initialBootstrapSettings,
  };

  return {
    fields: {},
    schema: {
      type: "object" as const,
      properties: {
        setup: {
          type: "object" as const,
          title: "Host Setup",
          properties: setup.schema,
          dependencies: {
            userSpawnAllowed: {
              oneOf: [
                {
                  properties: {
                    userSpawnAllowed: { enum: [false] },
                  },
                },
                {
                  properties: {
                    userSpawnAllowed: { enum: [true] },
                    isVirtualWorkStation: isVirtualWorkStation.schema,
                  },
                  dependencies: {
                    isVirtualWorkStation: {
                      oneOf: [
                        {
                          properties: {
                            isVirtualWorkStation: {
                              enum: [false],
                            },
                          },
                        },
                        {
                          properties: {
                            isVirtualWorkStation: {
                              enum: [true],
                            },
                            icecreamSchedulerHost: icecreamSchedulerHost.schema,
                            icecreamConfigPath: icecreamConfigPath.schema,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
            arch: {
              oneOf: [
                {
                  properties: {
                    arch: { enum: windowsArchitectures },
                    rootDir: rootDir.schema,
                  },
                },
                {
                  properties: {
                    arch: { enum: nonWindowsArchitectures },
                  },
                },
              ],
            },
          },
        },
      },
      dependencies: {
        setup: {
          oneOf: [
            {
              properties: {
                setup: {
                  properties: {
                    bootstrapMethod: { enum: [BootstrapMethod.LegacySsh] },
                  },
                },
                bootstrapSettings: bootstrapSettingsWithDefault,
                sshConfig,
                containerIsolation,
                allocation,
              },
            },
            {
              properties: {
                setup: {
                  properties: {
                    bootstrapMethod: {
                      enum: [BootstrapMethod.Ssh, BootstrapMethod.UserData],
                    },
                  },
                },
                bootstrapSettings: bootstrapSettingsWithDefault,
                sshConfig,
                containerIsolation,
                allocation,
              },
            },
          ],
        },
      },
    },
    uiSchema: {
      setup: setup.uiSchema(
        architecture,
        hasStaticProvider,
        isSingleTaskDistro,
      ),
      bootstrapSettings:
        bootstrapMethod === BootstrapMethod.LegacySsh
          ? { "ui:widget": "hidden" }
          : bootstrapProperties.uiSchema(architecture),
      sshConfig: sshConfigProperties.uiSchema(hasStaticProvider),
      containerIsolation: containerIsolationProperties.uiSchema(architecture),
      allocation: allocationProperties.uiSchema(
        hasEC2Provider,
        hasStaticProvider,
      ),
    },
  };
};

const bootstrapSettings = {
  type: "object" as const,
  title: "Bootstrap Settings",
  properties: bootstrapProperties.schema,
};

const sshConfig = {
  type: "object" as const,
  title: "User and SSH Configuration",
  properties: sshConfigProperties.schema,
};

const containerIsolation = {
  type: "object" as const,
  title: "Container Isolation",
  properties: containerIsolationProperties.schema,
};

const allocation = {
  type: "object" as const,
  title: "Host Allocation",
  required: [
    "minimumHosts",
    "maximumHosts",
    "acceptableHostIdleTimeSeconds",
    "futureHostFraction",
  ],
  properties: allocationProperties.schema,
};
