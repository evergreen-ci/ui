import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  DistroInput,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { HostFormState } from "./types";

describe("host tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, distroData)).toStrictEqual(gql);
  });

  it("correctly converts from GQL to a form when mountpoints is null", () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    expect(gqlToForm({ ...distroData, mountpoints: null })).toStrictEqual({
      ...form,
      setup: { ...form.setup, mountpoints: [] },
    });
  });
});

const form: HostFormState = {
  allocation: {
    acceptableHostIdleTimeSeconds: 60,
    autoTuneMaximumHosts: true,
    feedbackRule: FeedbackRule.Default,
    futureHostFraction: 0,
    hostsOverallocatedRule: OverallocatedRule.Default,
    maximumHosts: 0,
    minimumHosts: 0,
    roundingRule: RoundingRule.Default,
    version: HostAllocatorVersion.Utilization,
  },
  bootstrapSettings: {
    clientDir: "/home/evg/client",
    env: [
      {
        key: "foo",
        value: "bar",
      },
    ],
    homeVolumeFormatCommand: "",
    jasperBinaryDir: "/home/evg/jasper",
    jasperCredentialsPath: "/home/evg/jasper/creds.json",
    preconditionScripts: [],
    resourceLimits: {
      lockedMemoryKb: -1,
      numFiles: 64000,
      numProcesses: -1,
      numTasks: 0,
      virtualMemoryKb: -1,
    },
    serviceUser: "",
    shellPath: "/bin/bash",
  },
  setup: {
    arch: Arch.Linux_64Bit,
    bootstrapMethod: BootstrapMethod.LegacySsh,
    communicationMethod: CommunicationMethod.LegacySsh,
    icecreamConfigPath: "",
    icecreamSchedulerHost: "",
    isVirtualWorkStation: false,
    mountpoints: ["/"],
    rootDir: "",
    setupAsSudo: true,
    setupScript: "ls -alF",
    userSpawnAllowed: false,
    workDir: "/data/evg",
  },
  sshConfig: {
    authorizedKeysFile: "",
    execUser: "execUser",
    sshOptions: ["BatchMode=yes", "ConnectTimeout=10"],
    user: "admin",
  },
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const gql: DistroInput = distroData;
