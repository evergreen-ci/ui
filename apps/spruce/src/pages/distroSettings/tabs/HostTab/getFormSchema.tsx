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
  provider: Provider;
};

export const getFormSchema = ({
  architecture,
  provider,
}: FormSchemaParams): ReturnType<GetFormSchema> => {
  const hasStaticProvider = provider === Provider.Static;
  const hasDockerProvider = provider === Provider.Docker;
  const hasEC2Provider = !hasStaticProvider && !hasDockerProvider;

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
                sshConfig,
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
                bootstrapSettings,
                sshConfig,
                allocation,
              },
            },
          ],
        },
      },
    },
    uiSchema: {
      setup: setup.uiSchema(architecture, hasStaticProvider),
      bootstrapSettings: bootstrapProperties.uiSchema(architecture),
      sshConfig: sshConfigProperties.uiSchema(hasStaticProvider),
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

const allocation = {
  type: "object" as const,
  title: "Host Allocation",
  required: [
    "minimumHosts",
    "maximumHosts",
    "acceptableHostIdleTime",
    "futureHostFraction",
  ],
  properties: allocationProperties.schema,
};
