import { GetFormSchema } from "components/SpruceForm";
import { Arch, BootstrapMethod, Provider } from "gql/generated/types";
import { nonWindowsArchitectures, windowsArchitectures } from "./constants";
import {
  allocation as allocationProperties,
  bootstrap as bootstrapProperties,
  setup,
  sshConfig as sshConfigProperties,
  icecreamConfigPath,
  icecreamSchedulerHost,
  isVirtualWorkStation,
  rootDir,
} from "./schemaFields";

type FormSchemaParams = {
  architecture: Arch;
  isSingleTaskDistro: boolean;
  provider: Provider;
};

export const getFormSchema = ({
  architecture,
  isSingleTaskDistro,
  provider,
}: FormSchemaParams): ReturnType<GetFormSchema> => {
  const hasStaticProvider = provider === Provider.Static;
  const hasDockerProvider = provider === Provider.Docker;
  const hasEC2Provider = !hasStaticProvider && !hasDockerProvider;

  return {
    fields: {},
    schema: {
      dependencies: {
        setup: {
          oneOf: [
            {
              properties: {
                allocation,
                setup: {
                  properties: {
                    bootstrapMethod: { enum: [BootstrapMethod.LegacySsh] },
                  },
                },
                sshConfig,
              },
            },
            {
              properties: {
                allocation,
                bootstrapSettings,
                setup: {
                  properties: {
                    bootstrapMethod: {
                      enum: [BootstrapMethod.Ssh, BootstrapMethod.UserData],
                    },
                  },
                },
                sshConfig,
              },
            },
          ],
        },
      },
      properties: {
        setup: {
          dependencies: {
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
            userSpawnAllowed: {
              oneOf: [
                {
                  properties: {
                    userSpawnAllowed: { enum: [false] },
                  },
                },
                {
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
                            icecreamConfigPath: icecreamConfigPath.schema,
                            icecreamSchedulerHost: icecreamSchedulerHost.schema,
                            isVirtualWorkStation: {
                              enum: [true],
                            },
                          },
                        },
                      ],
                    },
                  },
                  properties: {
                    isVirtualWorkStation: isVirtualWorkStation.schema,
                    userSpawnAllowed: { enum: [true] },
                  },
                },
              ],
            },
          },
          properties: setup.schema,
          title: "Host Setup",
          type: "object" as const,
        },
      },
      type: "object" as const,
    },
    uiSchema: {
      allocation: allocationProperties.uiSchema(
        hasEC2Provider,
        hasStaticProvider,
      ),
      bootstrapSettings: bootstrapProperties.uiSchema(architecture),
      setup: setup.uiSchema(
        architecture,
        hasStaticProvider,
        isSingleTaskDistro,
      ),
      sshConfig: sshConfigProperties.uiSchema(hasStaticProvider),
    },
  };
};

const bootstrapSettings = {
  properties: bootstrapProperties.schema,
  title: "Bootstrap Settings",
  type: "object" as const,
};

const sshConfig = {
  properties: sshConfigProperties.schema,
  title: "User and SSH Configuration",
  type: "object" as const,
};

const allocation = {
  properties: allocationProperties.schema,
  required: [
    "minimumHosts",
    "maximumHosts",
    "acceptableHostIdleTimeSeconds",
    "futureHostFraction",
  ],
  title: "Host Allocation",
  type: "object" as const,
};
