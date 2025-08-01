import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  DispatcherVersion,
  DistroQuery,
  FeedbackRule,
  FinderVersion,
  HostAllocatorVersion,
  OverallocatedRule,
  PlannerVersion,
  Provider,
  RoundingRule,
} from "gql/generated/types";

const distroData: DistroQuery["distro"] = {
  __typename: "Distro",
  adminOnly: false,
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  arch: Arch.Linux_64Bit,
  authorizedKeysFile: "",
  imageId: "rhel71-power8",
  bootstrapSettings: {
    clientDir: "/home/evg/client",
    communication: CommunicationMethod.LegacySsh,
    env: [
      {
        key: "foo",
        value: "bar",
      },
    ],
    jasperBinaryDir: "/home/evg/jasper",
    jasperCredentialsPath: "/home/evg/jasper/creds.json",
    method: BootstrapMethod.LegacySsh,
    preconditionScripts: [],
    resourceLimits: {
      lockedMemoryKb: -1,
      numFiles: 64000,
      numProcesses: -1,
      numTasks: 0,
      virtualMemoryKb: -1,
    },
    rootDir: "",
    serviceUser: "",
    shellPath: "/bin/bash",
  },
  containerPool: "",
  disabled: false,
  disableShallowClone: true,
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
  execUser: "execUser",
  expansions: [
    {
      key: "decompress",
      value: "tar xzvf",
    },
    {
      key: "ps",
      value: "ps aux",
    },
    {
      key: "kill_pid",
      value: "kill -- -$(ps opgid= %v)",
    },
  ],
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  homeVolumeSettings: {
    formatCommand: "",
  },
  hostAllocatorSettings: {
    acceptableHostIdleTime: 0,
    autoTuneMaximumHosts: true,
    feedbackRule: FeedbackRule.Default,
    futureHostFraction: 0,
    hostsOverallocatedRule: OverallocatedRule.Default,
    maximumHosts: 0,
    minimumHosts: 0,
    roundingRule: RoundingRule.Default,
    version: HostAllocatorVersion.Utilization,
  },
  iceCreamSettings: {
    configPath: "",
    schedulerHost: "",
  },
  isCluster: false,
  isVirtualWorkStation: false,
  name: "rhel71-power8-large",
  note: "distro note",
  singleTaskDistro: false,
  warningNote: "distro warnings",
  plannerSettings: {
    commitQueueFactor: 0,
    expectedRuntimeFactor: 0,
    generateTaskFactor: 5,
    groupVersions: false,
    mainlineTimeInQueueFactor: 0,
    patchFactor: 0,
    patchTimeInQueueFactor: 0,
    targetTime: 0,
    numDependentsFactor: 50,
    version: PlannerVersion.Tunable,
  },
  provider: Provider.Static,
  providerSettingsList: [
    {
      ami: "who-ami",
      instance_type: "m4.4xlarge",
      is_vpc: true,
      region: "us-east-1",
      security_group_ids: ["1"],
      subnet_id: "subnet-123",
      do_not_assign_public_ipv4_address: true,
    },
  ],
  providerAccount: "aws",
  setup: "ls -alF",
  setupAsSudo: true,
  sshOptions: ["BatchMode=yes", "ConnectTimeout=10"],
  user: "admin",
  userSpawnAllowed: false,
  validProjects: [],
  workDir: "/data/evg",
  mountpoints: ["/"],
};

export { distroData };
