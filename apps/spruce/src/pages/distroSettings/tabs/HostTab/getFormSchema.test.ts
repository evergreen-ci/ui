import { Arch, Provider } from "gql/generated/types";
import { getFormSchema } from "./getFormSchema";
import { HostFormState } from "./types";

const initialBootstrapSettings: HostFormState["bootstrapSettings"] = {
  jasperBinaryDir: "/opt/jasper",
  jasperCredentialsPath: "/etc/jasper/credentials",
  clientDir: "/opt/mongodb",
  shellPath: "/bin/bash",
  serviceUser: "mongodb",
  homeVolumeFormatCommand: "mkfs",
  resourceLimits: {
    numFiles: 1,
    numTasks: 2,
    numProcesses: 3,
    lockedMemoryKb: 4,
    virtualMemoryKb: 5,
  },
  env: [{ key: "ENV", value: "test" }],
  preconditionScripts: [{ path: "/tmp/precondition", script: "true" }],
};

describe("getFormSchema", () => {
  it("restores bootstrap settings when selecting a non-legacy bootstrap method", () => {
    const formSchema = getFormSchema({
      architecture: Arch.Linux_64Bit,
      bootstrapSettings: initialBootstrapSettings,
      isSingleTaskDistro: false,
      provider: Provider.Ec2Fleet,
    });

    expect(formSchema.schema.dependencies?.setup?.oneOf?.[1]).toMatchObject({
      properties: {
        bootstrapSettings: {
          default: initialBootstrapSettings,
        },
      },
    });
  });
});
