export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BooleanMap: { input: any; output: any };
  Duration: { input: number; output: number };
  Map: { input: any; output: any };
  StringMap: {
    input: { [key: string]: unknown };
    output: { [key: string]: unknown };
  };
  Time: { input: Date; output: Date };
};

export type ApiConfig = {
  __typename?: "APIConfig";
  corpUrl?: Maybe<Scalars["String"]["output"]>;
  httpListenAddr?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type ApiConfigInput = {
  corpUrl: Scalars["String"]["input"];
  httpListenAddr: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type AwsAccountRoleMapping = {
  __typename?: "AWSAccountRoleMapping";
  account: Scalars["String"]["output"];
  role: Scalars["String"]["output"];
};

export type AwsAccountRoleMappingInput = {
  account: Scalars["String"]["input"];
  role: Scalars["String"]["input"];
};

export type AwsConfig = {
  __typename?: "AWSConfig";
  accountRoles: Array<AwsAccountRoleMapping>;
  alertableInstanceTypes: Array<Scalars["String"]["output"]>;
  allowedInstanceTypes: Array<Scalars["String"]["output"]>;
  allowedRegions: Array<Scalars["String"]["output"]>;
  defaultSecurityGroup?: Maybe<Scalars["String"]["output"]>;
  ec2Keys: Array<Ec2Key>;
  elasticIPUsageRate?: Maybe<Scalars["Float"]["output"]>;
  ipamPoolID?: Maybe<Scalars["String"]["output"]>;
  maxVolumeSizePerUser?: Maybe<Scalars["Int"]["output"]>;
  parserProject?: Maybe<ParserProjectS3Config>;
  persistentDNS?: Maybe<PersistentDnsConfig>;
  pod?: Maybe<AwsPodConfig>;
  subnets: Array<Subnet>;
};

export type AwsConfigInput = {
  accountRoles: Array<AwsAccountRoleMappingInput>;
  alertableInstanceTypes: Array<Scalars["String"]["input"]>;
  allowedInstanceTypes: Array<Scalars["String"]["input"]>;
  allowedRegions: Array<Scalars["String"]["input"]>;
  defaultSecurityGroup?: InputMaybe<Scalars["String"]["input"]>;
  ec2Keys: Array<Ec2KeyInput>;
  elasticIPUsageRate?: InputMaybe<Scalars["Float"]["input"]>;
  ipamPoolID?: InputMaybe<Scalars["String"]["input"]>;
  maxVolumeSizePerUser?: InputMaybe<Scalars["Int"]["input"]>;
  parserProject?: InputMaybe<ParserProjectS3ConfigInput>;
  persistentDNS?: InputMaybe<PersistentDnsConfigInput>;
  pod?: InputMaybe<AwsPodConfigInput>;
  subnets: Array<SubnetInput>;
};

export type AwsPodConfig = {
  __typename?: "AWSPodConfig";
  ecs?: Maybe<EcsConfig>;
  region?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  secretsManager?: Maybe<SecretsManagerConfig>;
};

export type AwsPodConfigInput = {
  ecs?: InputMaybe<EcsConfigInput>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  secretsManager?: InputMaybe<SecretsManagerConfigInput>;
};

export type AwsvpcConfig = {
  __typename?: "AWSVPCConfig";
  securityGroups: Array<Scalars["String"]["output"]>;
  subnets: Array<Scalars["String"]["output"]>;
};

export type AwsvpcConfigInput = {
  securityGroups: Array<Scalars["String"]["input"]>;
  subnets: Array<Scalars["String"]["input"]>;
};

export type AbortInfo = {
  __typename?: "AbortInfo";
  buildVariantDisplayName: Scalars["String"]["output"];
  newVersion: Scalars["String"]["output"];
  prClosed: Scalars["Boolean"]["output"];
  taskDisplayName: Scalars["String"]["output"];
  taskID: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export enum AccessLevel {
  Admin = "ADMIN",
  Edit = "EDIT",
  View = "VIEW",
}

export type AddFavoriteProjectInput = {
  projectIdentifier: Scalars["String"]["input"];
};

export type AdminEvent = {
  __typename?: "AdminEvent";
  after?: Maybe<Scalars["Map"]["output"]>;
  before?: Maybe<Scalars["Map"]["output"]>;
  section?: Maybe<Scalars["String"]["output"]>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

/** AdminEventsInput is the input to the adminEvents query. */
export type AdminEventsInput = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type AdminEventsPayload = {
  __typename?: "AdminEventsPayload";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<AdminEvent>;
};

export type AdminSettings = {
  __typename?: "AdminSettings";
  amboy?: Maybe<AmboyConfig>;
  amboyDB?: Maybe<AmboyDbConfig>;
  api?: Maybe<ApiConfig>;
  authConfig?: Maybe<AuthConfig>;
  banner?: Maybe<Scalars["String"]["output"]>;
  bannerTheme?: Maybe<BannerTheme>;
  buckets?: Maybe<BucketsConfig>;
  cedar?: Maybe<CedarConfig>;
  configDir?: Maybe<Scalars["String"]["output"]>;
  containerPools?: Maybe<ContainerPoolsConfig>;
  cost?: Maybe<CostConfig>;
  disabledGQLQueries: Array<Scalars["String"]["output"]>;
  domainName?: Maybe<Scalars["String"]["output"]>;
  expansions?: Maybe<Scalars["StringMap"]["output"]>;
  fws?: Maybe<FwsConfig>;
  githubCheckRun?: Maybe<GitHubCheckRunConfig>;
  githubOrgs?: Maybe<Array<Scalars["String"]["output"]>>;
  githubPRCreatorOrg?: Maybe<Scalars["String"]["output"]>;
  githubWebhookSecret?: Maybe<Scalars["String"]["output"]>;
  graphite?: Maybe<GraphiteConfig>;
  hostInit?: Maybe<HostInitConfig>;
  hostJasper?: Maybe<HostJasperConfig>;
  jira?: Maybe<JiraConfig>;
  jiraNotifications?: Maybe<JiraNotificationsConfig>;
  kanopySSHKeyPath?: Maybe<Scalars["String"]["output"]>;
  logPath?: Maybe<Scalars["String"]["output"]>;
  loggerConfig?: Maybe<LoggerConfig>;
  notify?: Maybe<NotifyConfig>;
  oldestAllowedCLIVersion?: Maybe<Scalars["String"]["output"]>;
  parameterStore?: Maybe<ParameterStoreConfig>;
  perfMonitoringKanopyURL?: Maybe<Scalars["String"]["output"]>;
  perfMonitoringURL?: Maybe<Scalars["String"]["output"]>;
  podLifecycle?: Maybe<PodLifecycleConfig>;
  pprofPort?: Maybe<Scalars["String"]["output"]>;
  projectCreation?: Maybe<ProjectCreationConfig>;
  providers?: Maybe<CloudProviderConfig>;
  releaseMode?: Maybe<ReleaseModeConfig>;
  repotracker?: Maybe<RepotrackerConfig>;
  runtimeEnvironments?: Maybe<RuntimeEnvironmentConfig>;
  sage?: Maybe<SageConfig>;
  scheduler?: Maybe<SchedulerConfig>;
  serviceFlags?: Maybe<ServiceFlags>;
  shutdownWaitSeconds?: Maybe<Scalars["Int"]["output"]>;
  singleTaskDistro?: Maybe<SingleTaskDistroConfig>;
  slack?: Maybe<SlackConfig>;
  sleepSchedule?: Maybe<SleepScheduleConfig>;
  spawnhost?: Maybe<SpawnHostConfig>;
  splunk?: Maybe<SplunkConfig>;
  ssh?: Maybe<SshConfig>;
  taskLimits?: Maybe<TaskLimitsConfig>;
  testSelection?: Maybe<TestSelectionConfig>;
  tracer?: Maybe<TracerSettings>;
  triggers?: Maybe<TriggerConfig>;
  ui?: Maybe<UiConfig>;
};

export type AdminSettingsInput = {
  amboy?: InputMaybe<AmboyConfigInput>;
  amboyDB?: InputMaybe<AmboyDbConfigInput>;
  api?: InputMaybe<ApiConfigInput>;
  authConfig?: InputMaybe<AuthConfigInput>;
  banner?: InputMaybe<Scalars["String"]["input"]>;
  bannerTheme?: InputMaybe<BannerTheme>;
  buckets?: InputMaybe<BucketsConfigInput>;
  cedar?: InputMaybe<CedarConfigInput>;
  configDir?: InputMaybe<Scalars["String"]["input"]>;
  containerPools?: InputMaybe<ContainerPoolsConfigInput>;
  cost?: InputMaybe<CostConfigInput>;
  disabledGQLQueries?: InputMaybe<Array<Scalars["String"]["input"]>>;
  domainName?: InputMaybe<Scalars["String"]["input"]>;
  expansions?: InputMaybe<Scalars["StringMap"]["input"]>;
  fws?: InputMaybe<FwsConfigInput>;
  githubCheckRun?: InputMaybe<GitHubCheckRunConfigInput>;
  githubOrgs?: InputMaybe<Array<Scalars["String"]["input"]>>;
  githubPRCreatorOrg?: InputMaybe<Scalars["String"]["input"]>;
  githubWebhookSecret?: InputMaybe<Scalars["String"]["input"]>;
  graphite?: InputMaybe<GraphiteConfigInput>;
  hostInit?: InputMaybe<HostInitConfigInput>;
  hostJasper?: InputMaybe<HostJasperConfigInput>;
  jira?: InputMaybe<JiraConfigInput>;
  jiraNotifications?: InputMaybe<JiraNotificationsConfigInput>;
  kanopySSHKeyPath?: InputMaybe<Scalars["String"]["input"]>;
  logPath?: InputMaybe<Scalars["String"]["input"]>;
  loggerConfig?: InputMaybe<LoggerConfigInput>;
  notify?: InputMaybe<NotifyConfigInput>;
  oldestAllowedCLIVersion?: InputMaybe<Scalars["String"]["input"]>;
  parameterStore?: InputMaybe<ParameterStoreConfigInput>;
  perfMonitoringKanopyURL?: InputMaybe<Scalars["String"]["input"]>;
  perfMonitoringURL?: InputMaybe<Scalars["String"]["input"]>;
  podLifecycle?: InputMaybe<PodLifecycleConfigInput>;
  pprofPort?: InputMaybe<Scalars["String"]["input"]>;
  projectCreation?: InputMaybe<ProjectCreationConfigInput>;
  providers?: InputMaybe<CloudProviderConfigInput>;
  releaseMode?: InputMaybe<ReleaseModeConfigInput>;
  repotracker?: InputMaybe<RepotrackerConfigInput>;
  runtimeEnvironments?: InputMaybe<RuntimeEnvironmentConfigInput>;
  sage?: InputMaybe<SageConfigInput>;
  scheduler?: InputMaybe<SchedulerConfigInput>;
  serviceFlags?: InputMaybe<ServiceFlagsInput>;
  shutdownWaitSeconds?: InputMaybe<Scalars["Int"]["input"]>;
  singleTaskDistro?: InputMaybe<SingleTaskDistroConfigInput>;
  slack?: InputMaybe<SlackConfigInput>;
  sleepSchedule?: InputMaybe<SleepScheduleConfigInput>;
  spawnhost?: InputMaybe<SpawnHostConfigInput>;
  splunk?: InputMaybe<SplunkConfigInput>;
  ssh?: InputMaybe<SshConfigInput>;
  taskLimits?: InputMaybe<TaskLimitsConfigInput>;
  testSelection?: InputMaybe<TestSelectionConfigInput>;
  tracer?: InputMaybe<TracerSettingsInput>;
  triggers?: InputMaybe<TriggerConfigInput>;
  ui?: InputMaybe<UiConfigInput>;
};

export type AdminTasksToRestartPayload = {
  __typename?: "AdminTasksToRestartPayload";
  tasksToRestart: Array<Task>;
};

export type AmboyConfig = {
  __typename?: "AmboyConfig";
  groupBackgroundCreateFrequencyMinutes?: Maybe<Scalars["Int"]["output"]>;
  groupDefaultWorkers?: Maybe<Scalars["Int"]["output"]>;
  groupPruneFrequencyMinutes?: Maybe<Scalars["Int"]["output"]>;
  groupTTLMinutes?: Maybe<Scalars["Int"]["output"]>;
  localStorage?: Maybe<Scalars["Int"]["output"]>;
  lockTimeoutMinutes?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  namedQueues: Array<AmboyNamedQueueConfig>;
  poolSizeLocal?: Maybe<Scalars["Int"]["output"]>;
  poolSizeRemote?: Maybe<Scalars["Int"]["output"]>;
  retry?: Maybe<AmboyRetryConfig>;
  sampleSize?: Maybe<Scalars["Int"]["output"]>;
  singleName?: Maybe<Scalars["String"]["output"]>;
};

export type AmboyConfigInput = {
  groupBackgroundCreateFrequencyMinutes: Scalars["Int"]["input"];
  groupDefaultWorkers: Scalars["Int"]["input"];
  groupPruneFrequencyMinutes: Scalars["Int"]["input"];
  groupTTLMinutes: Scalars["Int"]["input"];
  localStorage: Scalars["Int"]["input"];
  lockTimeoutMinutes: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  namedQueues: Array<AmboyNamedQueueConfigInput>;
  poolSizeLocal: Scalars["Int"]["input"];
  poolSizeRemote: Scalars["Int"]["input"];
  retry: AmboyRetryConfigInput;
  sampleSize: Scalars["Int"]["input"];
  singleName: Scalars["String"]["input"];
};

export type AmboyDbConfig = {
  __typename?: "AmboyDBConfig";
  database?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

export type AmboyDbConfigInput = {
  database: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type AmboyNamedQueueConfig = {
  __typename?: "AmboyNamedQueueConfig";
  lockTimeoutSeconds?: Maybe<Scalars["Int"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  numWorkers?: Maybe<Scalars["Int"]["output"]>;
  regexp?: Maybe<Scalars["String"]["output"]>;
  sampleSize?: Maybe<Scalars["Int"]["output"]>;
};

export type AmboyNamedQueueConfigInput = {
  lockTimeoutSeconds: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  numWorkers: Scalars["Int"]["input"];
  regexp: Scalars["String"]["input"];
  sampleSize: Scalars["Int"]["input"];
};

export type AmboyRetryConfig = {
  __typename?: "AmboyRetryConfig";
  maxCapacity?: Maybe<Scalars["Int"]["output"]>;
  maxRetryAttempts?: Maybe<Scalars["Int"]["output"]>;
  maxRetryTimeSeconds?: Maybe<Scalars["Int"]["output"]>;
  numWorkers?: Maybe<Scalars["Int"]["output"]>;
  retryBackoffSeconds?: Maybe<Scalars["Int"]["output"]>;
  staleRetryingMonitorIntervalSeconds?: Maybe<Scalars["Int"]["output"]>;
};

export type AmboyRetryConfigInput = {
  maxCapacity: Scalars["Int"]["input"];
  maxRetryAttempts: Scalars["Int"]["input"];
  maxRetryTimeSeconds: Scalars["Int"]["input"];
  numWorkers: Scalars["Int"]["input"];
  retryBackoffSeconds: Scalars["Int"]["input"];
  staleRetryingMonitorIntervalSeconds: Scalars["Int"]["input"];
};

/**
 * Annotation models the metadata that a user can add to a task.
 * It is used as a field within the Task type.
 */
export type Annotation = {
  __typename?: "Annotation";
  createdIssues?: Maybe<Array<IssueLink>>;
  id: Scalars["String"]["output"];
  issues?: Maybe<Array<IssueLink>>;
  metadataLinks?: Maybe<Array<MetadataLink>>;
  note?: Maybe<Note>;
  suspectedIssues?: Maybe<Array<IssueLink>>;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  webhookConfigured: Scalars["Boolean"]["output"];
};

export enum Arch {
  Linux_64Bit = "LINUX_64_BIT",
  LinuxArm_64Bit = "LINUX_ARM_64_BIT",
  LinuxPpc_64Bit = "LINUX_PPC_64_BIT",
  LinuxZseries = "LINUX_ZSERIES",
  Osx_64Bit = "OSX_64_BIT",
  OsxArm_64Bit = "OSX_ARM_64_BIT",
  Windows_64Bit = "WINDOWS_64_BIT",
}

export type AuthConfig = {
  __typename?: "AuthConfig";
  allowServiceUsers?: Maybe<Scalars["Boolean"]["output"]>;
  backgroundReauthMinutes?: Maybe<Scalars["Int"]["output"]>;
  github?: Maybe<GitHubAuthConfig>;
  kanopy?: Maybe<KanopyAuthConfig>;
  multi?: Maybe<MultiAuthConfig>;
  naive?: Maybe<NaiveAuthConfig>;
  oauth?: Maybe<OAuthConfig>;
  okta?: Maybe<OktaConfig>;
  preferredType?: Maybe<PreferredAuthType>;
};

export type AuthConfigInput = {
  allowServiceUsers?: InputMaybe<Scalars["Boolean"]["input"]>;
  backgroundReauthMinutes?: InputMaybe<Scalars["Int"]["input"]>;
  github?: InputMaybe<GitHubAuthConfigInput>;
  kanopy?: InputMaybe<KanopyAuthConfigInput>;
  multi?: InputMaybe<MultiAuthConfigInput>;
  naive?: InputMaybe<NaiveAuthConfigInput>;
  oauth?: InputMaybe<OAuthConfigInput>;
  okta?: InputMaybe<OktaConfigInput>;
  preferredType?: InputMaybe<PreferredAuthType>;
};

export type AuthUser = {
  __typename?: "AuthUser";
  displayName?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
};

export type AuthUserInput = {
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export enum BannerTheme {
  Announcement = "ANNOUNCEMENT",
  Important = "IMPORTANT",
  Information = "INFORMATION",
  Warning = "WARNING",
}

export type BetaFeatures = {
  __typename?: "BetaFeatures";
  parsleyAIEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  spruceWaterfallEnabled?: Maybe<Scalars["Boolean"]["output"]>;
};

export type BetaFeaturesInput = {
  parsleyAIEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  spruceWaterfallEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export enum BootstrapMethod {
  LegacySsh = "LEGACY_SSH",
  Ssh = "SSH",
  UserData = "USER_DATA",
}

export type BootstrapSettings = {
  __typename?: "BootstrapSettings";
  clientDir: Scalars["String"]["output"];
  communication: CommunicationMethod;
  env: Array<EnvVar>;
  jasperBinaryDir: Scalars["String"]["output"];
  jasperCredentialsPath: Scalars["String"]["output"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScript>;
  resourceLimits: ResourceLimits;
  rootDir: Scalars["String"]["output"];
  serviceUser: Scalars["String"]["output"];
  shellPath: Scalars["String"]["output"];
};

export type BootstrapSettingsInput = {
  clientDir: Scalars["String"]["input"];
  communication: CommunicationMethod;
  env: Array<EnvVarInput>;
  jasperBinaryDir: Scalars["String"]["input"];
  jasperCredentialsPath: Scalars["String"]["input"];
  method: BootstrapMethod;
  preconditionScripts: Array<PreconditionScriptInput>;
  resourceLimits: ResourceLimitsInput;
  rootDir: Scalars["String"]["input"];
  serviceUser: Scalars["String"]["input"];
  shellPath: Scalars["String"]["input"];
};

export type BucketConfig = {
  __typename?: "BucketConfig";
  name?: Maybe<Scalars["String"]["output"]>;
  roleARN?: Maybe<Scalars["String"]["output"]>;
  testResultsPrefix?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
};

export type BucketConfigInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  roleARN?: InputMaybe<Scalars["String"]["input"]>;
  testResultsPrefix?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<Scalars["String"]["input"]>;
};

export type BucketsConfig = {
  __typename?: "BucketsConfig";
  credentials?: Maybe<S3Credentials>;
  internalBuckets?: Maybe<Array<Scalars["String"]["output"]>>;
  logBucket?: Maybe<BucketConfig>;
  logBucketFailedTasks?: Maybe<BucketConfig>;
  logBucketLongRetention?: Maybe<BucketConfig>;
  longRetentionProjects?: Maybe<Array<Scalars["String"]["output"]>>;
  testResultsBucket?: Maybe<BucketConfig>;
};

export type BucketsConfigInput = {
  credentials?: InputMaybe<S3CredentialsInput>;
  internalBuckets?: InputMaybe<Array<Scalars["String"]["input"]>>;
  logBucket?: InputMaybe<BucketConfigInput>;
  logBucketFailedTasks?: InputMaybe<BucketConfigInput>;
  logBucketLongRetention?: InputMaybe<BucketConfigInput>;
  longRetentionProjects?: InputMaybe<Array<Scalars["String"]["input"]>>;
  testResultsBucket?: InputMaybe<BucketConfigInput>;
};

export type Build = {
  __typename?: "Build";
  actualMakespan: Scalars["Duration"]["output"];
  buildVariant: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  predictedMakespan: Scalars["Duration"]["output"];
  status: Scalars["String"]["output"];
};

/**
 * Build Baron is a service that can be integrated into a project (see Confluence Wiki for more details).
 * This type is returned from the buildBaron query, and contains information about Build Baron configurations and suggested
 * tickets from JIRA for a given task on a given execution.
 */
export type BuildBaron = {
  __typename?: "BuildBaron";
  bbTicketCreationDefined: Scalars["Boolean"]["output"];
  buildBaronConfigured: Scalars["Boolean"]["output"];
  searchReturnInfo?: Maybe<SearchReturnInfo>;
};

export type BuildBaronSettings = {
  __typename?: "BuildBaronSettings";
  bfSuggestionFeaturesURL?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionPassword?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionServer?: Maybe<Scalars["String"]["output"]>;
  bfSuggestionTimeoutSecs?: Maybe<Scalars["Int"]["output"]>;
  bfSuggestionUsername?: Maybe<Scalars["String"]["output"]>;
  ticketCreateIssueType: Scalars["String"]["output"];
  ticketCreateProject: Scalars["String"]["output"];
  ticketSearchProjects?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type BuildBaronSettingsInput = {
  bfSuggestionFeaturesURL?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionPassword?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionServer?: InputMaybe<Scalars["String"]["input"]>;
  bfSuggestionTimeoutSecs?: InputMaybe<Scalars["Int"]["input"]>;
  bfSuggestionUsername?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateIssueType?: InputMaybe<Scalars["String"]["input"]>;
  ticketCreateProject: Scalars["String"]["input"];
  ticketSearchProjects?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/**
 * BuildVariantOptions is an input to the mainlineCommits query.
 * It stores values for statuses, tasks, and variants which are used to filter for matching versions.
 */
export type BuildVariantOptions = {
  includeBaseTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variants?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type BuildVariantTuple = {
  __typename?: "BuildVariantTuple";
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
};

export type CedarConfig = {
  __typename?: "CedarConfig";
  dbName: Scalars["String"]["output"];
  dbUrl: Scalars["String"]["output"];
};

export type CedarConfigInput = {
  dbName: Scalars["String"]["input"];
  dbUrl: Scalars["String"]["input"];
};

export type ChildPatchAlias = {
  __typename?: "ChildPatchAlias";
  alias: Scalars["String"]["output"];
  patchId: Scalars["String"]["output"];
};

export type ClientBinary = {
  __typename?: "ClientBinary";
  arch?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  os?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/**
 * ClientConfig stores information about the binaries for the Evergreen Command-Line Client that are available for
 * download on Evergreen.
 */
export type ClientConfig = {
  __typename?: "ClientConfig";
  clientBinaries?: Maybe<Array<ClientBinary>>;
  latestRevision?: Maybe<Scalars["String"]["output"]>;
};

export type CloudProviderConfig = {
  __typename?: "CloudProviderConfig";
  aws?: Maybe<AwsConfig>;
  docker?: Maybe<DockerConfig>;
};

export type CloudProviderConfigInput = {
  aws?: InputMaybe<AwsConfigInput>;
  docker?: InputMaybe<DockerConfigInput>;
};

export type CommitQueueParams = {
  __typename?: "CommitQueueParams";
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  mergeMethod: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type CommitQueueParamsInput = {
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  mergeMethod?: InputMaybe<Scalars["String"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
};

export enum CommunicationMethod {
  LegacySsh = "LEGACY_SSH",
  Rpc = "RPC",
  Ssh = "SSH",
}

export type ContainerPool = {
  __typename?: "ContainerPool";
  distro: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  maxContainers: Scalars["Int"]["output"];
  port: Scalars["Int"]["output"];
};

export type ContainerPoolInput = {
  distro: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
  maxContainers: Scalars["Int"]["input"];
  port: Scalars["Int"]["input"];
};

export type ContainerPoolsConfig = {
  __typename?: "ContainerPoolsConfig";
  pools: Array<ContainerPool>;
};

export type ContainerPoolsConfigInput = {
  pools: Array<ContainerPoolInput>;
};

export type ContainerResources = {
  __typename?: "ContainerResources";
  cpu: Scalars["Int"]["output"];
  memoryMb: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type ContainerResourcesInput = {
  cpu: Scalars["Int"]["input"];
  memoryMb: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
};

/**
 * CopyDistroInput is the input to the copyDistro mutation.
 * It contains information about a distro to be duplicated.
 */
export type CopyDistroInput = {
  distroIdToCopy: Scalars["String"]["input"];
  newDistroId: Scalars["String"]["input"];
};

/**
 * CopyProjectInput is the input to the copyProject mutation.
 * It contains information about a project to be duplicated.
 */
export type CopyProjectInput = {
  newProjectId?: InputMaybe<Scalars["String"]["input"]>;
  newProjectIdentifier: Scalars["String"]["input"];
  projectIdToCopy: Scalars["String"]["input"];
};

/** Cost represents the cost breakdown for a task or version. */
export type Cost = {
  __typename?: "Cost";
  adjustedEC2Cost?: Maybe<Scalars["Float"]["output"]>;
  onDemandEC2Cost?: Maybe<Scalars["Float"]["output"]>;
};

export type CostConfig = {
  __typename?: "CostConfig";
  financeFormula?: Maybe<Scalars["Float"]["output"]>;
  onDemandDiscount?: Maybe<Scalars["Float"]["output"]>;
  s3Cost?: Maybe<S3CostConfig>;
  savingsPlanDiscount?: Maybe<Scalars["Float"]["output"]>;
};

export type CostConfigInput = {
  financeFormula?: InputMaybe<Scalars["Float"]["input"]>;
  onDemandDiscount?: InputMaybe<Scalars["Float"]["input"]>;
  s3Cost?: InputMaybe<S3CostConfigInput>;
  savingsPlanDiscount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type CostData = {
  __typename?: "CostData";
  onDemandRate?: Maybe<Scalars["Float"]["output"]>;
  savingsPlanRate?: Maybe<Scalars["Float"]["output"]>;
};

export type CostDataInput = {
  onDemandRate?: InputMaybe<Scalars["Float"]["input"]>;
  savingsPlanRate?: InputMaybe<Scalars["Float"]["input"]>;
};

/** CreateDistroInput is the input to the createDistro mutation. */
export type CreateDistroInput = {
  newDistroId: Scalars["String"]["input"];
  singleTaskDistro?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * CreateProjectInput is the input to the createProject mutation.
 * It contains information about a new project to be created.
 */
export type CreateProjectInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  identifier: Scalars["String"]["input"];
  owner: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
  repoRefId?: InputMaybe<Scalars["String"]["input"]>;
};

export type CursorParams = {
  cursorId: Scalars["String"]["input"];
  direction: TaskHistoryDirection;
  includeCursor: Scalars["Boolean"]["input"];
};

/** CursorSettings represents the status of a user's Cursor API key stored in Sage. */
export type CursorSettings = {
  __typename?: "CursorSettings";
  keyConfigured: Scalars["Boolean"]["output"];
  keyLastFour?: Maybe<Scalars["String"]["output"]>;
};

/** DeactivateStepbackTaskInput is the input to the deactivateStepbackTask mutation. */
export type DeactivateStepbackTaskInput = {
  buildVariantName: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

/** DefaultSectionToRepoInput is the input to the defaultSectionToRepo mutation. */
export type DefaultSectionToRepoInput = {
  projectId: Scalars["String"]["input"];
  section: ProjectSettingsSection;
};

/** DeleteCursorAPIKeyPayload is the response from deleting a Cursor API key. */
export type DeleteCursorApiKeyPayload = {
  __typename?: "DeleteCursorAPIKeyPayload";
  success: Scalars["Boolean"]["output"];
};

/** DeleteDistroInput is the input to the deleteDistro mutation. */
export type DeleteDistroInput = {
  distroId: Scalars["String"]["input"];
};

/** Return type representing whether a distro was deleted. */
export type DeleteDistroPayload = {
  __typename?: "DeleteDistroPayload";
  deletedDistroId: Scalars["String"]["output"];
};

/** DeleteGithubAppCredentialsInput is the input to the deleteGithubAppCredentials mutation. */
export type DeleteGithubAppCredentialsInput = {
  projectId: Scalars["String"]["input"];
};

/** DeleteGithubAppCredentialsPayload is returned by the deleteGithubAppCredentials mutation. */
export type DeleteGithubAppCredentialsPayload = {
  __typename?: "DeleteGithubAppCredentialsPayload";
  oldAppId: Scalars["Int"]["output"];
};

export type Dependency = {
  __typename?: "Dependency";
  buildVariant: Scalars["String"]["output"];
  metStatus: MetStatus;
  name: Scalars["String"]["output"];
  requiredStatus: RequiredStatus;
  taskId: Scalars["String"]["output"];
};

export type DispatcherSettings = {
  __typename?: "DispatcherSettings";
  version: DispatcherVersion;
};

export type DispatcherSettingsInput = {
  version: DispatcherVersion;
};

export enum DispatcherVersion {
  RevisedWithDependencies = "REVISED_WITH_DEPENDENCIES",
}

export type DisplayTask = {
  ExecTasks: Array<Scalars["String"]["input"]>;
  Name: Scalars["String"]["input"];
};

/** Distro models an environment configuration for a host. */
export type Distro = {
  __typename?: "Distro";
  adminOnly: Scalars["Boolean"]["output"];
  aliases: Array<Scalars["String"]["output"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["output"];
  availableRegions: Array<Scalars["String"]["output"]>;
  bootstrapSettings: BootstrapSettings;
  containerPool: Scalars["String"]["output"];
  costData?: Maybe<CostData>;
  disableShallowClone: Scalars["Boolean"]["output"];
  disabled: Scalars["Boolean"]["output"];
  dispatcherSettings: DispatcherSettings;
  execUser: Scalars["String"]["output"];
  expansions: Array<Expansion>;
  finderSettings: FinderSettings;
  homeVolumeSettings: HomeVolumeSettings;
  hostAllocatorSettings: HostAllocatorSettings;
  iceCreamSettings: IceCreamSettings;
  imageId: Scalars["String"]["output"];
  isCluster: Scalars["Boolean"]["output"];
  isVirtualWorkStation: Scalars["Boolean"]["output"];
  mountpoints: Array<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  note: Scalars["String"]["output"];
  plannerSettings: PlannerSettings;
  provider: Provider;
  providerAccount: Scalars["String"]["output"];
  providerSettingsList: Array<Scalars["Map"]["output"]>;
  setup: Scalars["String"]["output"];
  setupAsSudo: Scalars["Boolean"]["output"];
  singleTaskDistro: Scalars["Boolean"]["output"];
  sshOptions: Array<Scalars["String"]["output"]>;
  user: Scalars["String"]["output"];
  userSpawnAllowed: Scalars["Boolean"]["output"];
  validProjects: Array<Scalars["String"]["output"]>;
  warningNote: Scalars["String"]["output"];
  workDir: Scalars["String"]["output"];
};

export type DistroEvent = {
  __typename?: "DistroEvent";
  after?: Maybe<Scalars["Map"]["output"]>;
  before?: Maybe<Scalars["Map"]["output"]>;
  data?: Maybe<Scalars["Map"]["output"]>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

/** DistroEventsInput is the input to the distroEvents query. */
export type DistroEventsInput = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  distroId: Scalars["String"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DistroEventsPayload = {
  __typename?: "DistroEventsPayload";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<DistroEvent>;
};

export type DistroInfo = {
  __typename?: "DistroInfo";
  bootstrapMethod?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  isVirtualWorkStation?: Maybe<Scalars["Boolean"]["output"]>;
  isWindows?: Maybe<Scalars["Boolean"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  workDir?: Maybe<Scalars["String"]["output"]>;
};

export type DistroInput = {
  adminOnly: Scalars["Boolean"]["input"];
  aliases: Array<Scalars["String"]["input"]>;
  arch: Arch;
  authorizedKeysFile: Scalars["String"]["input"];
  bootstrapSettings: BootstrapSettingsInput;
  containerPool: Scalars["String"]["input"];
  costData?: InputMaybe<CostDataInput>;
  disableShallowClone: Scalars["Boolean"]["input"];
  disabled: Scalars["Boolean"]["input"];
  dispatcherSettings: DispatcherSettingsInput;
  execUser: Scalars["String"]["input"];
  expansions: Array<ExpansionInput>;
  finderSettings: FinderSettingsInput;
  homeVolumeSettings: HomeVolumeSettingsInput;
  hostAllocatorSettings: HostAllocatorSettingsInput;
  iceCreamSettings: IceCreamSettingsInput;
  imageId: Scalars["String"]["input"];
  isCluster: Scalars["Boolean"]["input"];
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  mountpoints: Array<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  note: Scalars["String"]["input"];
  plannerSettings: PlannerSettingsInput;
  provider: Provider;
  providerAccount: Scalars["String"]["input"];
  providerSettingsList: Array<Scalars["Map"]["input"]>;
  setup: Scalars["String"]["input"];
  setupAsSudo: Scalars["Boolean"]["input"];
  singleTaskDistro?: InputMaybe<Scalars["Boolean"]["input"]>;
  sshOptions: Array<Scalars["String"]["input"]>;
  user: Scalars["String"]["input"];
  userSpawnAllowed: Scalars["Boolean"]["input"];
  validProjects: Array<Scalars["String"]["input"]>;
  warningNote: Scalars["String"]["input"];
  workDir: Scalars["String"]["input"];
};

export enum DistroOnSaveOperation {
  Decommission = "DECOMMISSION",
  None = "NONE",
  Reprovision = "REPROVISION",
  RestartJasper = "RESTART_JASPER",
}

export type DistroPermissions = {
  __typename?: "DistroPermissions";
  admin: Scalars["Boolean"]["output"];
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type DistroPermissionsOptions = {
  distroId: Scalars["String"]["input"];
};

export enum DistroSettingsAccess {
  Admin = "ADMIN",
  Create = "CREATE",
  Edit = "EDIT",
  View = "VIEW",
}

export type DockerConfig = {
  __typename?: "DockerConfig";
  apiVersion?: Maybe<Scalars["String"]["output"]>;
};

export type DockerConfigInput = {
  apiVersion?: InputMaybe<Scalars["String"]["input"]>;
};

export type Ec2Key = {
  __typename?: "EC2Key";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  secret: Scalars["String"]["output"];
};

export type Ec2KeyInput = {
  key: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  secret: Scalars["String"]["input"];
};

export enum EcsArchitecture {
  EcsArchAmd64 = "ECS_ARCH_AMD64",
  EcsArchArm64 = "ECS_ARCH_ARM64",
}

export type EcsCapacityProvider = {
  __typename?: "ECSCapacityProvider";
  arch?: Maybe<EcsArchitecture>;
  name?: Maybe<Scalars["String"]["output"]>;
  os?: Maybe<EcsOperatingSystem>;
  windowsVersion?: Maybe<EcsWindowsVersion>;
};

export type EcsCapacityProviderInput = {
  arch?: InputMaybe<EcsArchitecture>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  os?: InputMaybe<EcsOperatingSystem>;
  windowsVersion?: InputMaybe<EcsWindowsVersion>;
};

export type EcsClusterConfig = {
  __typename?: "ECSClusterConfig";
  name?: Maybe<Scalars["String"]["output"]>;
  os?: Maybe<EcsOperatingSystem>;
};

export type EcsClusterConfigInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  os?: InputMaybe<EcsOperatingSystem>;
};

export type EcsConfig = {
  __typename?: "ECSConfig";
  allowedImages: Array<Scalars["String"]["output"]>;
  awsVPC?: Maybe<AwsvpcConfig>;
  capacityProviders: Array<EcsCapacityProvider>;
  clusters: Array<EcsClusterConfig>;
  executionRole?: Maybe<Scalars["String"]["output"]>;
  logGroup?: Maybe<Scalars["String"]["output"]>;
  logRegion?: Maybe<Scalars["String"]["output"]>;
  logStreamPrefix?: Maybe<Scalars["String"]["output"]>;
  maxCPU?: Maybe<Scalars["Int"]["output"]>;
  maxMemoryMb?: Maybe<Scalars["Int"]["output"]>;
  taskDefinitionPrefix?: Maybe<Scalars["String"]["output"]>;
  taskRole?: Maybe<Scalars["String"]["output"]>;
};

export type EcsConfigInput = {
  allowedImages: Array<Scalars["String"]["input"]>;
  awsVPC?: InputMaybe<AwsvpcConfigInput>;
  capacityProviders: Array<EcsCapacityProviderInput>;
  clusters: Array<EcsClusterConfigInput>;
  executionRole?: InputMaybe<Scalars["String"]["input"]>;
  logGroup?: InputMaybe<Scalars["String"]["input"]>;
  logRegion?: InputMaybe<Scalars["String"]["input"]>;
  logStreamPrefix?: InputMaybe<Scalars["String"]["input"]>;
  maxCPU?: InputMaybe<Scalars["Int"]["input"]>;
  maxMemoryMb?: InputMaybe<Scalars["Int"]["input"]>;
  taskDefinitionPrefix?: InputMaybe<Scalars["String"]["input"]>;
  taskRole?: InputMaybe<Scalars["String"]["input"]>;
};

export enum EcsOperatingSystem {
  EcsosLinux = "ECSOSLinux",
  EcsosWindows = "ECSOSWindows",
}

export enum EcsWindowsVersion {
  EcsWindowsServer_2016 = "ECS_WINDOWS_SERVER_2016",
  EcsWindowsServer_2019 = "ECS_WINDOWS_SERVER_2019",
  EcsWindowsServer_2022 = "ECS_WINDOWS_SERVER_2022",
}

/**
 * EditSpawnHostInput is the input to the editSpawnHost mutation.
 * Its fields determine how a given host will be modified.
 */
export type EditSpawnHostInput = {
  addedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  deletedInstanceTags?: InputMaybe<Array<InstanceTagInput>>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  hostId: Scalars["String"]["input"];
  instanceType?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  publicKey?: InputMaybe<PublicKeyInput>;
  savePublicKey?: InputMaybe<Scalars["Boolean"]["input"]>;
  servicePassword?: InputMaybe<Scalars["String"]["input"]>;
  sleepSchedule?: InputMaybe<SleepScheduleInput>;
  volume?: InputMaybe<Scalars["String"]["input"]>;
};

export type EnvVar = {
  __typename?: "EnvVar";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type EnvVarInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type Expansion = {
  __typename?: "Expansion";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ExpansionInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ExternalLink = {
  __typename?: "ExternalLink";
  displayName: Scalars["String"]["output"];
  requesters: Array<Scalars["String"]["output"]>;
  urlTemplate: Scalars["String"]["output"];
};

export type ExternalLinkForMetadata = {
  __typename?: "ExternalLinkForMetadata";
  displayName: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type ExternalLinkInput = {
  displayName: Scalars["String"]["input"];
  requesters: Array<Scalars["String"]["input"]>;
  urlTemplate: Scalars["String"]["input"];
};

export type FwsConfig = {
  __typename?: "FWSConfig";
  url: Scalars["String"]["output"];
};

export type FwsConfigInput = {
  url: Scalars["String"]["input"];
};

export type FailingCommand = {
  __typename?: "FailingCommand";
  failureMetadataTags: Array<Scalars["String"]["output"]>;
  fullDisplayName: Scalars["String"]["output"];
};

export enum FeedbackRule {
  Default = "DEFAULT",
  NoFeedback = "NO_FEEDBACK",
  WaitsOverThresh = "WAITS_OVER_THRESH",
}

export type File = {
  __typename?: "File";
  link: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  visibility: Scalars["String"]["output"];
};

export type FileDiff = {
  __typename?: "FileDiff";
  additions: Scalars["Int"]["output"];
  deletions: Scalars["Int"]["output"];
  description: Scalars["String"]["output"];
  diffLink: Scalars["String"]["output"];
  fileName: Scalars["String"]["output"];
};

export type FinderSettings = {
  __typename?: "FinderSettings";
  version: FinderVersion;
};

export type FinderSettingsInput = {
  version: FinderVersion;
};

export enum FinderVersion {
  Alternate = "ALTERNATE",
  Legacy = "LEGACY",
  Parallel = "PARALLEL",
  Pipeline = "PIPELINE",
}

export type GeneralSubscription = {
  __typename?: "GeneralSubscription";
  id: Scalars["String"]["output"];
  ownerType: Scalars["String"]["output"];
  regexSelectors: Array<Selector>;
  resourceType: Scalars["String"]["output"];
  selectors: Array<Selector>;
  subscriber?: Maybe<SubscriberWrapper>;
  trigger: Scalars["String"]["output"];
  triggerData?: Maybe<Scalars["StringMap"]["output"]>;
};

export type GeneratedTaskCountResults = {
  __typename?: "GeneratedTaskCountResults";
  buildVariantName?: Maybe<Scalars["String"]["output"]>;
  estimatedTasks: Scalars["Int"]["output"];
  taskId?: Maybe<Scalars["String"]["output"]>;
  taskName?: Maybe<Scalars["String"]["output"]>;
};

export type GitHubAuthConfig = {
  __typename?: "GitHubAuthConfig";
  appId?: Maybe<Scalars["Int"]["output"]>;
  clientId?: Maybe<Scalars["String"]["output"]>;
  clientSecret?: Maybe<Scalars["String"]["output"]>;
  defaultOwner?: Maybe<Scalars["String"]["output"]>;
  defaultRepo?: Maybe<Scalars["String"]["output"]>;
  organization?: Maybe<Scalars["String"]["output"]>;
  users: Array<Scalars["String"]["output"]>;
};

export type GitHubAuthConfigInput = {
  appId?: InputMaybe<Scalars["Int"]["input"]>;
  clientId?: InputMaybe<Scalars["String"]["input"]>;
  clientSecret?: InputMaybe<Scalars["String"]["input"]>;
  defaultOwner?: InputMaybe<Scalars["String"]["input"]>;
  defaultRepo?: InputMaybe<Scalars["String"]["input"]>;
  organization?: InputMaybe<Scalars["String"]["input"]>;
  users: Array<Scalars["String"]["input"]>;
};

export type GitHubCheckRunConfig = {
  __typename?: "GitHubCheckRunConfig";
  checkRunLimit?: Maybe<Scalars["Int"]["output"]>;
};

export type GitHubCheckRunConfigInput = {
  checkRunLimit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GitHubDynamicTokenPermissionGroup = {
  __typename?: "GitHubDynamicTokenPermissionGroup";
  name: Scalars["String"]["output"];
  permissions: Scalars["StringMap"]["output"];
};

export type GitHubDynamicTokenPermissionGroupInput = {
  name: Scalars["String"]["input"];
  permissions: Scalars["StringMap"]["input"];
};

export type GitTag = {
  __typename?: "GitTag";
  pusher: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
};

export type GithubAppAuth = {
  __typename?: "GithubAppAuth";
  appId?: Maybe<Scalars["Int"]["output"]>;
  privateKey?: Maybe<Scalars["String"]["output"]>;
};

export type GithubAppAuthInput = {
  appId: Scalars["Int"]["input"];
  privateKey: Scalars["String"]["input"];
};

export type GithubCheckSubscriber = {
  __typename?: "GithubCheckSubscriber";
  owner: Scalars["String"]["output"];
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

export type GithubPrSubscriber = {
  __typename?: "GithubPRSubscriber";
  owner: Scalars["String"]["output"];
  prNumber?: Maybe<Scalars["Int"]["output"]>;
  ref: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

export type GithubPatch = {
  __typename?: "GithubPatch";
  author?: Maybe<Scalars["String"]["output"]>;
  baseOwner?: Maybe<Scalars["String"]["output"]>;
  baseRepo?: Maybe<Scalars["String"]["output"]>;
  headBranch?: Maybe<Scalars["String"]["output"]>;
  headHash?: Maybe<Scalars["String"]["output"]>;
  headOwner?: Maybe<Scalars["String"]["output"]>;
  headRepo?: Maybe<Scalars["String"]["output"]>;
  prNumber?: Maybe<Scalars["Int"]["output"]>;
};

/**
 * GithubProjectConflicts is the return value for the githubProjectConflicts query.
 * Its contains information about potential conflicts in the commit checks, the commit queue, and PR testing.
 */
export type GithubProjectConflicts = {
  __typename?: "GithubProjectConflicts";
  commitCheckIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  commitQueueIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
  prTestingIdentifiers?: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GithubUser = {
  __typename?: "GithubUser";
  lastKnownAs?: Maybe<Scalars["String"]["output"]>;
  uid?: Maybe<Scalars["Int"]["output"]>;
};

export type GithubUserInput = {
  lastKnownAs?: InputMaybe<Scalars["String"]["input"]>;
};

export type GraphiteConfig = {
  __typename?: "GraphiteConfig";
  ciOptimizationToken?: Maybe<Scalars["String"]["output"]>;
  serverUrl?: Maybe<Scalars["String"]["output"]>;
};

export type GraphiteConfigInput = {
  ciOptimizationToken?: InputMaybe<Scalars["String"]["input"]>;
  serverUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupedBuildVariant = {
  __typename?: "GroupedBuildVariant";
  displayName: Scalars["String"]["output"];
  tasks?: Maybe<Array<Task>>;
  variant: Scalars["String"]["output"];
};

export type GroupedFiles = {
  __typename?: "GroupedFiles";
  execution: Scalars["Int"]["output"];
  files?: Maybe<Array<File>>;
  taskId: Scalars["String"]["output"];
  taskName?: Maybe<Scalars["String"]["output"]>;
};

/**
 * GroupedProjects is the return value for the projects & viewableProjectRefs queries.
 * It contains an array of projects which are grouped under a groupDisplayName.
 */
export type GroupedProjects = {
  __typename?: "GroupedProjects";
  groupDisplayName: Scalars["String"]["output"];
  projects: Array<Project>;
  repo?: Maybe<RepoRef>;
};

export type GroupedTaskStatusCount = {
  __typename?: "GroupedTaskStatusCount";
  displayName: Scalars["String"]["output"];
  statusCounts: Array<StatusCount>;
  variant: Scalars["String"]["output"];
};

export type HomeVolumeSettings = {
  __typename?: "HomeVolumeSettings";
  formatCommand: Scalars["String"]["output"];
};

export type HomeVolumeSettingsInput = {
  formatCommand: Scalars["String"]["input"];
};

/** Host models a host, which are used for things like running tasks or as virtual workstations. */
export type Host = {
  __typename?: "Host";
  ami?: Maybe<Scalars["String"]["output"]>;
  availabilityZone?: Maybe<Scalars["String"]["output"]>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  distro?: Maybe<DistroInfo>;
  distroId?: Maybe<Scalars["String"]["output"]>;
  elapsed?: Maybe<Scalars["Time"]["output"]>;
  eventTypes: Array<HostEventType>;
  /** events returns the event log entries for a given host. */
  events: HostEvents;
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume?: Maybe<Volume>;
  homeVolumeID?: Maybe<Scalars["String"]["output"]>;
  hostUrl: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  instanceTags: Array<InstanceTag>;
  instanceType?: Maybe<Scalars["String"]["output"]>;
  lastCommunicationTime?: Maybe<Scalars["Time"]["output"]>;
  noExpiration: Scalars["Boolean"]["output"];
  persistentDnsName: Scalars["String"]["output"];
  provider: Scalars["String"]["output"];
  runningTask?: Maybe<TaskInfo>;
  sleepSchedule?: Maybe<SleepSchedule>;
  startedBy: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  tag: Scalars["String"]["output"];
  totalIdleTime?: Maybe<Scalars["Duration"]["output"]>;
  uptime?: Maybe<Scalars["Time"]["output"]>;
  user?: Maybe<Scalars["String"]["output"]>;
  volumes: Array<Volume>;
};

/** Host models a host, which are used for things like running tasks or as virtual workstations. */
export type HostEventsArgs = {
  opts: HostEventsInput;
};

export enum HostAccessLevel {
  Edit = "EDIT",
  View = "VIEW",
}

export type HostAllocatorSettings = {
  __typename?: "HostAllocatorSettings";
  acceptableHostIdleTime: Scalars["Duration"]["output"];
  autoTuneMaximumHosts: Scalars["Boolean"]["output"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["output"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["output"];
  minimumHosts: Scalars["Int"]["output"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export type HostAllocatorSettingsInput = {
  acceptableHostIdleTime: Scalars["Int"]["input"];
  autoTuneMaximumHosts: Scalars["Boolean"]["input"];
  feedbackRule: FeedbackRule;
  futureHostFraction: Scalars["Float"]["input"];
  hostsOverallocatedRule: OverallocatedRule;
  maximumHosts: Scalars["Int"]["input"];
  minimumHosts: Scalars["Int"]["input"];
  roundingRule: RoundingRule;
  version: HostAllocatorVersion;
};

export enum HostAllocatorVersion {
  Utilization = "UTILIZATION",
}

export type HostEventLogData = {
  __typename?: "HostEventLogData";
  agentBuild: Scalars["String"]["output"];
  agentRevision: Scalars["String"]["output"];
  duration: Scalars["Duration"]["output"];
  execution: Scalars["String"]["output"];
  hostname: Scalars["String"]["output"];
  jasperRevision: Scalars["String"]["output"];
  logs: Scalars["String"]["output"];
  monitorOp: Scalars["String"]["output"];
  newStatus: Scalars["String"]["output"];
  oldStatus: Scalars["String"]["output"];
  provisioningMethod: Scalars["String"]["output"];
  successful: Scalars["Boolean"]["output"];
  taskId: Scalars["String"]["output"];
  taskPid: Scalars["String"]["output"];
  taskStatus: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export type HostEventLogEntry = {
  __typename?: "HostEventLogEntry";
  data: HostEventLogData;
  eventType?: Maybe<HostEventType>;
  id: Scalars["String"]["output"];
  processedAt?: Maybe<Scalars["Time"]["output"]>;
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

export enum HostEventType {
  HostAgentDeployed = "HOST_AGENT_DEPLOYED",
  HostAgentDeployFailed = "HOST_AGENT_DEPLOY_FAILED",
  HostAgentMonitorDeployed = "HOST_AGENT_MONITOR_DEPLOYED",
  HostAgentMonitorDeployFailed = "HOST_AGENT_MONITOR_DEPLOY_FAILED",
  HostAlertableInstanceTypeWarningSent = "HOST_ALERTABLE_INSTANCE_TYPE_WARNING_SENT",
  HostConvertedProvisioning = "HOST_CONVERTED_PROVISIONING",
  HostConvertingProvisioning = "HOST_CONVERTING_PROVISIONING",
  HostConvertingProvisioningError = "HOST_CONVERTING_PROVISIONING_ERROR",
  HostCreated = "HOST_CREATED",
  HostCreatedError = "HOST_CREATED_ERROR",
  HostDnsNameSet = "HOST_DNS_NAME_SET",
  HostExpirationWarningSent = "HOST_EXPIRATION_WARNING_SENT",
  HostIdleNotification = "HOST_IDLE_NOTIFICATION",
  HostJasperRestarted = "HOST_JASPER_RESTARTED",
  HostJasperRestarting = "HOST_JASPER_RESTARTING",
  HostJasperRestartError = "HOST_JASPER_RESTART_ERROR",
  HostModified = "HOST_MODIFIED",
  HostProvisioned = "HOST_PROVISIONED",
  HostProvisionError = "HOST_PROVISION_ERROR",
  HostProvisionFailed = "HOST_PROVISION_FAILED",
  HostRebooted = "HOST_REBOOTED",
  HostRunningTaskCleared = "HOST_RUNNING_TASK_CLEARED",
  HostRunningTaskSet = "HOST_RUNNING_TASK_SET",
  HostScriptExecuted = "HOST_SCRIPT_EXECUTED",
  HostScriptExecuteFailed = "HOST_SCRIPT_EXECUTE_FAILED",
  HostStarted = "HOST_STARTED",
  HostStatusChanged = "HOST_STATUS_CHANGED",
  HostStopped = "HOST_STOPPED",
  HostTaskFinished = "HOST_TASK_FINISHED",
  HostTemporaryExemptionExpirationWarningSent = "HOST_TEMPORARY_EXEMPTION_EXPIRATION_WARNING_SENT",
  HostTerminatedExternally = "HOST_TERMINATED_EXTERNALLY",
  SpawnHostCreatedError = "SPAWN_HOST_CREATED_ERROR",
  VolumeExpirationWarningSent = "VOLUME_EXPIRATION_WARNING_SENT",
  VolumeMigrationFailed = "VOLUME_MIGRATION_FAILED",
}

/**
 * HostEvents is the return value for the hostEvents query.
 * It contains the event log entries for a given host.
 */
export type HostEvents = {
  __typename?: "HostEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<HostEventLogEntry>;
};

export type HostEventsInput = {
  eventTypes?: InputMaybe<Array<HostEventType>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  /** sort by timestamp */
  sortDir?: InputMaybe<SortDirection>;
};

export type HostInitConfig = {
  __typename?: "HostInitConfig";
  cloudStatusBatchSize?: Maybe<Scalars["Int"]["output"]>;
  hostThrottle?: Maybe<Scalars["Int"]["output"]>;
  maxTotalDynamicHosts?: Maybe<Scalars["Int"]["output"]>;
  provisioningThrottle?: Maybe<Scalars["Int"]["output"]>;
};

export type HostInitConfigInput = {
  cloudStatusBatchSize: Scalars["Int"]["input"];
  hostThrottle: Scalars["Int"]["input"];
  maxTotalDynamicHosts: Scalars["Int"]["input"];
  provisioningThrottle: Scalars["Int"]["input"];
};

export type HostJasperConfig = {
  __typename?: "HostJasperConfig";
  binaryName?: Maybe<Scalars["String"]["output"]>;
  downloadFileName?: Maybe<Scalars["String"]["output"]>;
  port?: Maybe<Scalars["Int"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["String"]["output"]>;
};

export type HostJasperConfigInput = {
  binaryName?: InputMaybe<Scalars["String"]["input"]>;
  downloadFileName?: InputMaybe<Scalars["String"]["input"]>;
  port?: InputMaybe<Scalars["Int"]["input"]>;
  url?: InputMaybe<Scalars["String"]["input"]>;
  version?: InputMaybe<Scalars["String"]["input"]>;
};

export enum HostSortBy {
  CurrentTask = "CURRENT_TASK",
  Distro = "DISTRO",
  Elapsed = "ELAPSED",
  Id = "ID",
  IdleTime = "IDLE_TIME",
  Owner = "OWNER",
  Status = "STATUS",
  Uptime = "UPTIME",
}

/**
 * HostsResponse is the return value for the hosts query.
 * It contains an array of Hosts matching the filter conditions, as well as some count information.
 */
export type HostsResponse = {
  __typename?: "HostsResponse";
  filteredHostsCount?: Maybe<Scalars["Int"]["output"]>;
  hosts: Array<Host>;
  totalHostsCount: Scalars["Int"]["output"];
};

export type IceCreamSettings = {
  __typename?: "IceCreamSettings";
  configPath: Scalars["String"]["output"];
  schedulerHost: Scalars["String"]["output"];
};

export type IceCreamSettingsInput = {
  configPath: Scalars["String"]["input"];
  schedulerHost: Scalars["String"]["input"];
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type Image = {
  __typename?: "Image";
  ami: Scalars["String"]["output"];
  distros: Array<Distro>;
  events: ImageEventsPayload;
  files: ImageFilesPayload;
  id: Scalars["String"]["output"];
  lastDeployed: Scalars["Time"]["output"];
  latestTask?: Maybe<Task>;
  operatingSystem: ImageOperatingSystemPayload;
  packages: ImagePackagesPayload;
  toolchains: ImageToolchainsPayload;
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type ImageEventsArgs = {
  limit: Scalars["Int"]["input"];
  page: Scalars["Int"]["input"];
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type ImageFilesArgs = {
  opts: ImageFileOpts;
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type ImageOperatingSystemArgs = {
  opts: OperatingSystemOpts;
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type ImagePackagesArgs = {
  opts: PackageOpts;
};

/**
 * Image is returned by the image query.
 * It contains information about an image.
 */
export type ImageToolchainsArgs = {
  opts: ToolchainOpts;
};

export type ImageEvent = {
  __typename?: "ImageEvent";
  amiAfter: Scalars["String"]["output"];
  amiBefore?: Maybe<Scalars["String"]["output"]>;
  entries: Array<ImageEventEntry>;
  timestamp: Scalars["Time"]["output"];
};

export type ImageEventEntry = {
  __typename?: "ImageEventEntry";
  action: ImageEventEntryAction;
  after: Scalars["String"]["output"];
  before: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  type: ImageEventType;
};

export enum ImageEventEntryAction {
  Added = "ADDED",
  Deleted = "DELETED",
  Updated = "UPDATED",
}

export enum ImageEventType {
  File = "FILE",
  OperatingSystem = "OPERATING_SYSTEM",
  Package = "PACKAGE",
  Toolchain = "TOOLCHAIN",
}

export type ImageEventsPayload = {
  __typename?: "ImageEventsPayload";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<ImageEvent>;
};

export type ImageFile = {
  __typename?: "ImageFile";
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export type ImageFileOpts = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type ImageFilesPayload = {
  __typename?: "ImageFilesPayload";
  data: Array<ImageFile>;
  filteredCount: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type ImageOperatingSystemPayload = {
  __typename?: "ImageOperatingSystemPayload";
  data: Array<OsInfo>;
  filteredCount: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type ImagePackagesPayload = {
  __typename?: "ImagePackagesPayload";
  data: Array<Package>;
  filteredCount: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type ImageToolchainsPayload = {
  __typename?: "ImageToolchainsPayload";
  data: Array<Toolchain>;
  filteredCount: Scalars["Int"]["output"];
  totalCount: Scalars["Int"]["output"];
};

export type IncludedLocalModule = {
  __typename?: "IncludedLocalModule";
  fileName: Scalars["String"]["output"];
  module: Scalars["String"]["output"];
};

export type InstanceTag = {
  __typename?: "InstanceTag";
  canBeModified: Scalars["Boolean"]["output"];
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type InstanceTagInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type IssueLink = {
  __typename?: "IssueLink";
  confidenceScore?: Maybe<Scalars["Float"]["output"]>;
  issueKey?: Maybe<Scalars["String"]["output"]>;
  jiraTicket?: Maybe<JiraTicket>;
  source?: Maybe<Source>;
  url?: Maybe<Scalars["String"]["output"]>;
};

/** IssueLinkInput is an input parameter to the annotation mutations. */
export type IssueLinkInput = {
  confidenceScore?: InputMaybe<Scalars["Float"]["input"]>;
  issueKey: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type JiraConfig = {
  __typename?: "JiraConfig";
  email?: Maybe<Scalars["String"]["output"]>;
  host?: Maybe<Scalars["String"]["output"]>;
  personalAccessToken?: Maybe<Scalars["String"]["output"]>;
};

export type JiraConfigInput = {
  email?: InputMaybe<Scalars["String"]["input"]>;
  host?: InputMaybe<Scalars["String"]["input"]>;
  personalAccessToken?: InputMaybe<Scalars["String"]["input"]>;
};

export type JiraIssueSubscriber = {
  __typename?: "JiraIssueSubscriber";
  issueType: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
};

export type JiraIssueSubscriberInput = {
  issueType: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
};

export type JiraNotificationsConfig = {
  __typename?: "JiraNotificationsConfig";
  customFields: Array<JiraNotificationsProjectEntry>;
};

export type JiraNotificationsConfigInput = {
  customFields: Array<JiraNotificationsProjectEntryInput>;
};

export type JiraNotificationsProject = {
  __typename?: "JiraNotificationsProject";
  components: Array<Scalars["String"]["output"]>;
  fields?: Maybe<Scalars["StringMap"]["output"]>;
  labels: Array<Scalars["String"]["output"]>;
};

export type JiraNotificationsProjectEntry = {
  __typename?: "JiraNotificationsProjectEntry";
  components: Array<Scalars["String"]["output"]>;
  fields?: Maybe<Scalars["StringMap"]["output"]>;
  labels: Array<Scalars["String"]["output"]>;
  project: Scalars["String"]["output"];
};

export type JiraNotificationsProjectEntryInput = {
  components: Array<Scalars["String"]["input"]>;
  fields?: InputMaybe<Scalars["StringMap"]["input"]>;
  labels: Array<Scalars["String"]["input"]>;
  project: Scalars["String"]["input"];
};

export type JiraNotificationsProjectInput = {
  components: Array<Scalars["String"]["input"]>;
  fields?: InputMaybe<Scalars["StringMap"]["input"]>;
  labels: Array<Scalars["String"]["input"]>;
};

export type JiraStatus = {
  __typename?: "JiraStatus";
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

export type JiraTicket = {
  __typename?: "JiraTicket";
  fields: TicketFields;
  key: Scalars["String"]["output"];
};

export type KanopyAuthConfig = {
  __typename?: "KanopyAuthConfig";
  headerName: Scalars["String"]["output"];
  issuer: Scalars["String"]["output"];
  keysetURL: Scalars["String"]["output"];
};

export type KanopyAuthConfigInput = {
  headerName: Scalars["String"]["input"];
  issuer: Scalars["String"]["input"];
  keysetURL: Scalars["String"]["input"];
};

export type LogBuffering = {
  __typename?: "LogBuffering";
  count?: Maybe<Scalars["Int"]["output"]>;
  durationSeconds?: Maybe<Scalars["Int"]["output"]>;
  incomingBufferFactor?: Maybe<Scalars["Int"]["output"]>;
  useAsync: Scalars["Boolean"]["output"];
};

export type LogBufferingInput = {
  count: Scalars["Int"]["input"];
  durationSeconds: Scalars["Int"]["input"];
  incomingBufferFactor: Scalars["Int"]["input"];
  useAsync: Scalars["Boolean"]["input"];
};

export type LogMessage = {
  __typename?: "LogMessage";
  message?: Maybe<Scalars["String"]["output"]>;
  severity?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  type?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type LoggerConfig = {
  __typename?: "LoggerConfig";
  buffer?: Maybe<LogBuffering>;
  defaultLevel?: Maybe<PriorityLevel>;
  logkeeperURL?: Maybe<Scalars["String"]["output"]>;
  redactKeys: Array<Scalars["String"]["output"]>;
  thresholdLevel?: Maybe<PriorityLevel>;
};

export type LoggerConfigInput = {
  buffer: LogBufferingInput;
  defaultLevel: PriorityLevel;
  logkeeperURL: Scalars["String"]["input"];
  redactKeys: Array<Scalars["String"]["input"]>;
  thresholdLevel: PriorityLevel;
};

export type LogkeeperBuild = {
  __typename?: "LogkeeperBuild";
  buildNum: Scalars["Int"]["output"];
  builder: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  task: Task;
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
  tests: Array<LogkeeperTest>;
};

export type LogkeeperTest = {
  __typename?: "LogkeeperTest";
  buildId: Scalars["String"]["output"];
  command: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  phase: Scalars["String"]["output"];
  taskExecution: Scalars["Int"]["output"];
  taskId: Scalars["String"]["output"];
};

export type MainlineCommitVersion = {
  __typename?: "MainlineCommitVersion";
  rolledUpVersions?: Maybe<Array<Version>>;
  version?: Maybe<Version>;
};

/**
 * MainlineCommits is returned by the mainline commits query.
 * It contains information about versions (both unactivated and activated) which is surfaced on the Project Health page.
 */
export type MainlineCommits = {
  __typename?: "MainlineCommits";
  nextPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  prevPageOrderNumber?: Maybe<Scalars["Int"]["output"]>;
  versions: Array<MainlineCommitVersion>;
};

/**
 * MainlineCommitsOptions is an input to the mainlineCommits query.
 * Its fields determine what mainline commits we fetch for a given projectID.
 */
export type MainlineCommitsOptions = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
  requesters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  revision?: InputMaybe<Scalars["String"]["input"]>;
  shouldCollapse?: InputMaybe<Scalars["Boolean"]["input"]>;
  skipOrderNumber?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Manifest = {
  __typename?: "Manifest";
  branch: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  isBase: Scalars["Boolean"]["output"];
  moduleOverrides?: Maybe<Scalars["StringMap"]["output"]>;
  modules?: Maybe<Scalars["Map"]["output"]>;
  project: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
};

export enum MetStatus {
  Met = "MET",
  Pending = "PENDING",
  Started = "STARTED",
  Unmet = "UNMET",
}

export type MetadataLink = {
  __typename?: "MetadataLink";
  source?: Maybe<Source>;
  text: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type MetadataLinkInput = {
  text: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type ModuleCodeChange = {
  __typename?: "ModuleCodeChange";
  branchName: Scalars["String"]["output"];
  fileDiffs: Array<FileDiff>;
  htmlLink: Scalars["String"]["output"];
  rawLink: Scalars["String"]["output"];
};

/**
 * MoveProjectInput is the input to the attachProjectToNewRepo mutation.
 * It contains information used to move a project to a a new owner and repo.
 */
export type MoveProjectInput = {
  newOwner: Scalars["String"]["input"];
  newRepo: Scalars["String"]["input"];
  projectId: Scalars["String"]["input"];
};

export type MultiAuthConfig = {
  __typename?: "MultiAuthConfig";
  readOnly: Array<Scalars["String"]["output"]>;
  readWrite: Array<Scalars["String"]["output"]>;
};

export type MultiAuthConfigInput = {
  readOnly?: InputMaybe<Array<Scalars["String"]["input"]>>;
  readWrite?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type Mutation = {
  __typename?: "Mutation";
  abortTask: Task;
  addAnnotationIssue: Scalars["Boolean"]["output"];
  addFavoriteProject: Project;
  attachProjectToNewRepo: Project;
  attachProjectToRepo: Project;
  attachVolumeToHost: Scalars["Boolean"]["output"];
  bbCreateTicket: Scalars["Boolean"]["output"];
  clearMySubscriptions: Scalars["Int"]["output"];
  copyDistro: NewDistroPayload;
  copyProject: Project;
  createDistro: NewDistroPayload;
  createProject: Project;
  createPublicKey: Array<PublicKey>;
  deactivateStepbackTask: Scalars["Boolean"]["output"];
  defaultSectionToRepo?: Maybe<Scalars["String"]["output"]>;
  deleteCursorAPIKey: DeleteCursorApiKeyPayload;
  deleteDistro: DeleteDistroPayload;
  deleteGithubAppCredentials?: Maybe<DeleteGithubAppCredentialsPayload>;
  deleteProject: Scalars["Boolean"]["output"];
  deleteSubscriptions: Scalars["Int"]["output"];
  detachProjectFromRepo: Project;
  detachVolumeFromHost: Scalars["Boolean"]["output"];
  editAnnotationNote: Scalars["Boolean"]["output"];
  editSpawnHost: Host;
  forceRepotrackerRun: Scalars["Boolean"]["output"];
  migrateVolume: Scalars["Boolean"]["output"];
  moveAnnotationIssue: Scalars["Boolean"]["output"];
  overrideTaskDependencies: Task;
  promoteVarsToRepo: Scalars["Boolean"]["output"];
  quarantineTest: QuarantineTestPayload;
  removeAnnotationIssue: Scalars["Boolean"]["output"];
  removeFavoriteProject: Project;
  removePublicKey: Array<PublicKey>;
  removeVolume: Scalars["Boolean"]["output"];
  reprovisionToNew: Scalars["Int"]["output"];
  resetAPIKey?: Maybe<UserConfig>;
  restartAdminTasks: RestartAdminTasksPayload;
  restartJasper: Scalars["Int"]["output"];
  restartTask: Task;
  restartVersions?: Maybe<Array<Version>>;
  saveAdminSettings: AdminSettings;
  saveDistro: SaveDistroPayload;
  saveProjectSettingsForSection: ProjectSettings;
  saveRepoSettingsForSection: RepoSettings;
  saveSubscription: Scalars["Boolean"]["output"];
  schedulePatch: Patch;
  scheduleTasks: Array<Task>;
  scheduleUndispatchedBaseTasks?: Maybe<Array<Task>>;
  setAnnotationMetadataLinks: Scalars["Boolean"]["output"];
  setCursorAPIKey: SetCursorApiKeyPayload;
  setLastRevision: SetLastRevisionPayload;
  /** setPatchVisibility takes a list of patch ids and a boolean to set the visibility on the my patches queries */
  setPatchVisibility: Array<Patch>;
  setTaskPriorities: Array<Task>;
  setTaskPriority: Task;
  setVersionPriority?: Maybe<Scalars["String"]["output"]>;
  spawnHost: Host;
  spawnVolume: Scalars["Boolean"]["output"];
  unscheduleTask: Task;
  unscheduleVersionTasks?: Maybe<Scalars["String"]["output"]>;
  updateBetaFeatures?: Maybe<UpdateBetaFeaturesPayload>;
  updateHostStatus: Scalars["Int"]["output"];
  updateParsleySettings?: Maybe<UpdateParsleySettingsPayload>;
  updatePublicKey: Array<PublicKey>;
  updateSpawnHostStatus: Host;
  updateUserSettings: Scalars["Boolean"]["output"];
  updateVolume: Scalars["Boolean"]["output"];
};

export type MutationAbortTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationAddAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationAddFavoriteProjectArgs = {
  opts: AddFavoriteProjectInput;
};

export type MutationAttachProjectToNewRepoArgs = {
  project: MoveProjectInput;
};

export type MutationAttachProjectToRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationAttachVolumeToHostArgs = {
  volumeAndHost: VolumeHost;
};

export type MutationBbCreateTicketArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type MutationCopyDistroArgs = {
  opts: CopyDistroInput;
};

export type MutationCopyProjectArgs = {
  project: CopyProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreateDistroArgs = {
  opts: CreateDistroInput;
};

export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
  requestS3Creds?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MutationCreatePublicKeyArgs = {
  publicKeyInput: PublicKeyInput;
};

export type MutationDeactivateStepbackTaskArgs = {
  opts: DeactivateStepbackTaskInput;
};

export type MutationDefaultSectionToRepoArgs = {
  opts: DefaultSectionToRepoInput;
};

export type MutationDeleteDistroArgs = {
  opts: DeleteDistroInput;
};

export type MutationDeleteGithubAppCredentialsArgs = {
  opts: DeleteGithubAppCredentialsInput;
};

export type MutationDeleteProjectArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDeleteSubscriptionsArgs = {
  subscriptionIds: Array<Scalars["String"]["input"]>;
};

export type MutationDetachProjectFromRepoArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationDetachVolumeFromHostArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationEditAnnotationNoteArgs = {
  execution: Scalars["Int"]["input"];
  newMessage: Scalars["String"]["input"];
  originalMessage: Scalars["String"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationEditSpawnHostArgs = {
  spawnHost?: InputMaybe<EditSpawnHostInput>;
};

export type MutationForceRepotrackerRunArgs = {
  projectId: Scalars["String"]["input"];
};

export type MutationMigrateVolumeArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
  volumeId: Scalars["String"]["input"];
};

export type MutationMoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationOverrideTaskDependenciesArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationPromoteVarsToRepoArgs = {
  opts: PromoteVarsToRepoInput;
};

export type MutationQuarantineTestArgs = {
  opts: QuarantineTestInput;
};

export type MutationRemoveAnnotationIssueArgs = {
  apiIssue: IssueLinkInput;
  execution: Scalars["Int"]["input"];
  isIssue: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRemoveFavoriteProjectArgs = {
  opts: RemoveFavoriteProjectInput;
};

export type MutationRemovePublicKeyArgs = {
  keyName: Scalars["String"]["input"];
};

export type MutationRemoveVolumeArgs = {
  volumeId: Scalars["String"]["input"];
};

export type MutationReprovisionToNewArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartAdminTasksArgs = {
  opts: RestartAdminTasksOptions;
};

export type MutationRestartJasperArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
};

export type MutationRestartTaskArgs = {
  failedOnly: Scalars["Boolean"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationRestartVersionsArgs = {
  abort: Scalars["Boolean"]["input"];
  versionId: Scalars["String"]["input"];
  versionsToRestart: Array<VersionToRestart>;
};

export type MutationSaveAdminSettingsArgs = {
  adminSettings: AdminSettingsInput;
};

export type MutationSaveDistroArgs = {
  opts: SaveDistroInput;
};

export type MutationSaveProjectSettingsForSectionArgs = {
  projectSettings?: InputMaybe<ProjectSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveRepoSettingsForSectionArgs = {
  repoSettings?: InputMaybe<RepoSettingsInput>;
  section: ProjectSettingsSection;
};

export type MutationSaveSubscriptionArgs = {
  subscription: SubscriptionInput;
};

export type MutationSchedulePatchArgs = {
  configure: PatchConfigure;
  patchId: Scalars["String"]["input"];
};

export type MutationScheduleTasksArgs = {
  taskIds: Array<Scalars["String"]["input"]>;
  versionId: Scalars["String"]["input"];
};

export type MutationScheduleUndispatchedBaseTasksArgs = {
  versionId: Scalars["String"]["input"];
};

export type MutationSetAnnotationMetadataLinksArgs = {
  execution: Scalars["Int"]["input"];
  metadataLinks: Array<MetadataLinkInput>;
  taskId: Scalars["String"]["input"];
};

export type MutationSetCursorApiKeyArgs = {
  apiKey: Scalars["String"]["input"];
};

export type MutationSetLastRevisionArgs = {
  opts: SetLastRevisionInput;
};

export type MutationSetPatchVisibilityArgs = {
  hidden: Scalars["Boolean"]["input"];
  patchIds: Array<Scalars["String"]["input"]>;
};

export type MutationSetTaskPrioritiesArgs = {
  taskPriorities: Array<TaskPriority>;
};

export type MutationSetTaskPriorityArgs = {
  priority: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type MutationSetVersionPriorityArgs = {
  priority: Scalars["Int"]["input"];
  versionId: Scalars["String"]["input"];
};

export type MutationSpawnHostArgs = {
  spawnHostInput?: InputMaybe<SpawnHostInput>;
};

export type MutationSpawnVolumeArgs = {
  spawnVolumeInput: SpawnVolumeInput;
};

export type MutationUnscheduleTaskArgs = {
  taskId: Scalars["String"]["input"];
};

export type MutationUnscheduleVersionTasksArgs = {
  abort: Scalars["Boolean"]["input"];
  versionId: Scalars["String"]["input"];
};

export type MutationUpdateBetaFeaturesArgs = {
  opts: UpdateBetaFeaturesInput;
};

export type MutationUpdateHostStatusArgs = {
  hostIds: Array<Scalars["String"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  status: Scalars["String"]["input"];
};

export type MutationUpdateParsleySettingsArgs = {
  opts: UpdateParsleySettingsInput;
};

export type MutationUpdatePublicKeyArgs = {
  targetKeyName: Scalars["String"]["input"];
  updateInfo: PublicKeyInput;
};

export type MutationUpdateSpawnHostStatusArgs = {
  updateSpawnHostStatusInput: UpdateSpawnHostStatusInput;
};

export type MutationUpdateUserSettingsArgs = {
  userSettings?: InputMaybe<UserSettingsInput>;
};

export type MutationUpdateVolumeArgs = {
  updateVolumeInput: UpdateVolumeInput;
};

export type NaiveAuthConfig = {
  __typename?: "NaiveAuthConfig";
  users: Array<AuthUser>;
};

export type NaiveAuthConfigInput = {
  users?: InputMaybe<Array<AuthUserInput>>;
};

/** Return type representing whether a distro was created and any validation errors */
export type NewDistroPayload = {
  __typename?: "NewDistroPayload";
  newDistroId: Scalars["String"]["output"];
};

export type Note = {
  __typename?: "Note";
  message: Scalars["String"]["output"];
  source: Source;
};

export type Notifications = {
  __typename?: "Notifications";
  buildBreak?: Maybe<Scalars["String"]["output"]>;
  buildBreakId?: Maybe<Scalars["String"]["output"]>;
  patchFinish?: Maybe<Scalars["String"]["output"]>;
  patchFinishId?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailure?: Maybe<Scalars["String"]["output"]>;
  patchFirstFailureId?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpiration?: Maybe<Scalars["String"]["output"]>;
  spawnHostExpirationId?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcome?: Maybe<Scalars["String"]["output"]>;
  spawnHostOutcomeId?: Maybe<Scalars["String"]["output"]>;
};

export type NotificationsInput = {
  buildBreak?: InputMaybe<Scalars["String"]["input"]>;
  patchFinish?: InputMaybe<Scalars["String"]["input"]>;
  patchFirstFailure?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostExpiration?: InputMaybe<Scalars["String"]["input"]>;
  spawnHostOutcome?: InputMaybe<Scalars["String"]["input"]>;
};

export type NotifyConfig = {
  __typename?: "NotifyConfig";
  bufferIntervalSeconds?: Maybe<Scalars["Int"]["output"]>;
  bufferTargetPerInterval?: Maybe<Scalars["Int"]["output"]>;
  ses?: Maybe<SesConfig>;
};

export type NotifyConfigInput = {
  bufferIntervalSeconds?: InputMaybe<Scalars["Int"]["input"]>;
  bufferTargetPerInterval?: InputMaybe<Scalars["Int"]["input"]>;
  ses?: InputMaybe<SesConfigInput>;
};

export type OAuthConfig = {
  __typename?: "OAuthConfig";
  clientId: Scalars["String"]["output"];
  connectorId: Scalars["String"]["output"];
  issuer: Scalars["String"]["output"];
};

export type OAuthConfigInput = {
  clientId: Scalars["String"]["input"];
  connectorId: Scalars["String"]["input"];
  issuer: Scalars["String"]["input"];
};

export type OsInfo = {
  __typename?: "OSInfo";
  name: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export type OktaConfig = {
  __typename?: "OktaConfig";
  clientId?: Maybe<Scalars["String"]["output"]>;
  clientSecret?: Maybe<Scalars["String"]["output"]>;
  expireAfterMinutes?: Maybe<Scalars["Int"]["output"]>;
  issuer?: Maybe<Scalars["String"]["output"]>;
  scopes: Array<Scalars["String"]["output"]>;
  userGroup?: Maybe<Scalars["String"]["output"]>;
};

export type OktaConfigInput = {
  clientId?: InputMaybe<Scalars["String"]["input"]>;
  clientSecret?: InputMaybe<Scalars["String"]["input"]>;
  expireAfterMinutes?: InputMaybe<Scalars["Int"]["input"]>;
  issuer?: InputMaybe<Scalars["String"]["input"]>;
  scopes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  userGroup?: InputMaybe<Scalars["String"]["input"]>;
};

export type OomTrackerInfo = {
  __typename?: "OomTrackerInfo";
  detected: Scalars["Boolean"]["output"];
  pids?: Maybe<Array<Scalars["Int"]["output"]>>;
};

export type OperatingSystemOpts = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export enum OverallocatedRule {
  Default = "DEFAULT",
  Ignore = "IGNORE",
  Terminate = "TERMINATE",
}

export type OwnerRepo = {
  __typename?: "OwnerRepo";
  owner: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
};

export type OwnerRepoInput = {
  owner: Scalars["String"]["input"];
  repo: Scalars["String"]["input"];
};

export type Package = {
  __typename?: "Package";
  manager: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export type PackageOpts = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  manager?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Parameter = {
  __typename?: "Parameter";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type ParameterInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type ParameterStoreConfig = {
  __typename?: "ParameterStoreConfig";
  prefix?: Maybe<Scalars["String"]["output"]>;
};

export type ParameterStoreConfigInput = {
  prefix?: InputMaybe<Scalars["String"]["input"]>;
};

export type ParserProjectS3Config = {
  __typename?: "ParserProjectS3Config";
  bucket?: Maybe<Scalars["String"]["output"]>;
  generatedJSONPrefix?: Maybe<Scalars["String"]["output"]>;
  key?: Maybe<Scalars["String"]["output"]>;
  prefix?: Maybe<Scalars["String"]["output"]>;
  secret: Scalars["String"]["output"];
};

export type ParserProjectS3ConfigInput = {
  bucket?: InputMaybe<Scalars["String"]["input"]>;
  generatedJSONPrefix?: InputMaybe<Scalars["String"]["input"]>;
  key?: InputMaybe<Scalars["String"]["input"]>;
  prefix?: InputMaybe<Scalars["String"]["input"]>;
  secret: Scalars["String"]["input"];
};

export type ParsleyFilter = {
  __typename?: "ParsleyFilter";
  caseSensitive: Scalars["Boolean"]["output"];
  description: Scalars["String"]["output"];
  exactMatch: Scalars["Boolean"]["output"];
  expression: Scalars["String"]["output"];
};

export type ParsleyFilterInput = {
  caseSensitive: Scalars["Boolean"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  exactMatch: Scalars["Boolean"]["input"];
  expression: Scalars["String"]["input"];
};

/** ParsleySettings contains information about a user's settings for Parsley. */
export type ParsleySettings = {
  __typename?: "ParsleySettings";
  jumpToFailingLineEnabled: Scalars["Boolean"]["output"];
  sectionsEnabled: Scalars["Boolean"]["output"];
};

export type ParsleySettingsInput = {
  jumpToFailingLineEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  sectionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Patch is a manually initiated version submitted to test local code changes. */
export type Patch = {
  __typename?: "Patch";
  activated: Scalars["Boolean"]["output"];
  alias?: Maybe<Scalars["String"]["output"]>;
  author: Scalars["String"]["output"];
  authorDisplayName: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  builds: Array<Build>;
  childPatchAliases?: Maybe<Array<ChildPatchAlias>>;
  childPatches?: Maybe<Array<Patch>>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  description: Scalars["String"]["output"];
  duration?: Maybe<PatchDuration>;
  generatedTaskCounts: Array<GeneratedTaskCountResults>;
  githash: Scalars["String"]["output"];
  githubPatchData?: Maybe<GithubPatch>;
  hidden: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  includedLocalModules: Array<IncludedLocalModule>;
  moduleCodeChanges: Array<ModuleCodeChange>;
  parameters: Array<Parameter>;
  patchNumber: Scalars["Int"]["output"];
  patchTriggerAliases: Array<PatchTriggerAlias>;
  project?: Maybe<PatchProject>;
  projectID: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: Array<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  user: User;
  variants: Array<Scalars["String"]["output"]>;
  variantsTasks: Array<VariantTask>;
  versionFull?: Maybe<Version>;
};

/**
 * PatchConfigure is the input to the schedulePatch mutation.
 * It contains information about how a user has configured their patch (e.g. name, tasks to run, etc).
 */
export type PatchConfigure = {
  description: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<ParameterInput>>;
  patchTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  variantsTasks: Array<VariantTasks>;
};

export type PatchDuration = {
  __typename?: "PatchDuration";
  makespan?: Maybe<Scalars["String"]["output"]>;
  time?: Maybe<PatchTime>;
  timeTaken?: Maybe<Scalars["String"]["output"]>;
};

export type PatchProject = {
  __typename?: "PatchProject";
  variants: Array<ProjectBuildVariant>;
};

export type PatchTime = {
  __typename?: "PatchTime";
  finished?: Maybe<Scalars["String"]["output"]>;
  started?: Maybe<Scalars["String"]["output"]>;
  submittedAt: Scalars["String"]["output"];
};

export type PatchTriggerAlias = {
  __typename?: "PatchTriggerAlias";
  alias: Scalars["String"]["output"];
  childProjectId: Scalars["String"]["output"];
  childProjectIdentifier: Scalars["String"]["output"];
  downstreamRevision?: Maybe<Scalars["String"]["output"]>;
  parentAsModule?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  taskSpecifiers?: Maybe<Array<TaskSpecifier>>;
  variantsTasks: Array<VariantTask>;
};

export type PatchTriggerAliasInput = {
  alias: Scalars["String"]["input"];
  childProjectIdentifier: Scalars["String"]["input"];
  downstreamRevision?: InputMaybe<Scalars["String"]["input"]>;
  parentAsModule?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  taskSpecifiers: Array<TaskSpecifierInput>;
};

/**
 * Patches is the return value of the patches field for the User and Project types.
 * It contains an array Patches for either an individual user or a project.
 */
export type Patches = {
  __typename?: "Patches";
  filteredPatchCount: Scalars["Int"]["output"];
  patches: Array<Patch>;
};

/**
 * PatchesInput is the input value to the patches field for the User and Project types.
 * Based on the information in PatchesInput, we return a list of Patches for either an individual user or a project.
 */
export type PatchesInput = {
  countLimit?: InputMaybe<Scalars["Int"]["input"]>;
  includeHidden?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: Scalars["Int"]["input"];
  onlyMergeQueue?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: Scalars["Int"]["input"];
  patchName?: Scalars["String"]["input"];
  requesters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  statuses?: Array<Scalars["String"]["input"]>;
};

export type PeriodicBuild = {
  __typename?: "PeriodicBuild";
  alias: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  cron: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  intervalHours: Scalars["Int"]["output"];
  message: Scalars["String"]["output"];
  nextRunTime: Scalars["Time"]["output"];
};

export type PeriodicBuildInput = {
  alias: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  cron?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  intervalHours: Scalars["Int"]["input"];
  message: Scalars["String"]["input"];
  nextRunTime: Scalars["Time"]["input"];
};

export type Permissions = {
  __typename?: "Permissions";
  canCreateDistro: Scalars["Boolean"]["output"];
  canCreateProject: Scalars["Boolean"]["output"];
  canEditAdminSettings: Scalars["Boolean"]["output"];
  distroPermissions: DistroPermissions;
  projectPermissions: ProjectPermissions;
  repoPermissions: RepoPermissions;
  userId: Scalars["String"]["output"];
};

export type PermissionsDistroPermissionsArgs = {
  options: DistroPermissionsOptions;
};

export type PermissionsProjectPermissionsArgs = {
  options: ProjectPermissionsOptions;
};

export type PermissionsRepoPermissionsArgs = {
  options: RepoPermissionsOptions;
};

export type PersistentDnsConfig = {
  __typename?: "PersistentDNSConfig";
  domain?: Maybe<Scalars["String"]["output"]>;
  hostedZoneID?: Maybe<Scalars["String"]["output"]>;
};

export type PersistentDnsConfigInput = {
  domain?: InputMaybe<Scalars["String"]["input"]>;
  hostedZoneID?: InputMaybe<Scalars["String"]["input"]>;
};

export type PlannerSettings = {
  __typename?: "PlannerSettings";
  commitQueueFactor: Scalars["Int"]["output"];
  expectedRuntimeFactor: Scalars["Int"]["output"];
  generateTaskFactor: Scalars["Int"]["output"];
  groupVersions: Scalars["Boolean"]["output"];
  mainlineTimeInQueueFactor: Scalars["Int"]["output"];
  numDependentsFactor: Scalars["Float"]["output"];
  patchFactor: Scalars["Int"]["output"];
  patchTimeInQueueFactor: Scalars["Int"]["output"];
  targetTime: Scalars["Duration"]["output"];
  version: PlannerVersion;
};

export type PlannerSettingsInput = {
  commitQueueFactor: Scalars["Int"]["input"];
  expectedRuntimeFactor: Scalars["Int"]["input"];
  generateTaskFactor: Scalars["Int"]["input"];
  groupVersions: Scalars["Boolean"]["input"];
  mainlineTimeInQueueFactor: Scalars["Int"]["input"];
  numDependentsFactor: Scalars["Float"]["input"];
  patchFactor: Scalars["Int"]["input"];
  patchTimeInQueueFactor: Scalars["Int"]["input"];
  targetTime: Scalars["Int"]["input"];
  version: PlannerVersion;
};

export enum PlannerVersion {
  Tunable = "TUNABLE",
}

export type Pod = {
  __typename?: "Pod";
  events: PodEvents;
  id: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  task?: Maybe<Task>;
  taskContainerCreationOpts: TaskContainerCreationOpts;
  type: Scalars["String"]["output"];
};

export type PodEventsArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type PodEventLogData = {
  __typename?: "PodEventLogData";
  newStatus?: Maybe<Scalars["String"]["output"]>;
  oldStatus?: Maybe<Scalars["String"]["output"]>;
  reason?: Maybe<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskExecution?: Maybe<Scalars["Int"]["output"]>;
  taskID?: Maybe<Scalars["String"]["output"]>;
  taskStatus?: Maybe<Scalars["String"]["output"]>;
};

export type PodEventLogEntry = {
  __typename?: "PodEventLogEntry";
  data: PodEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt?: Maybe<Scalars["Time"]["output"]>;
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * PodEvents is the return value for the events query.
 * It contains the event log entries for a pod.
 */
export type PodEvents = {
  __typename?: "PodEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<PodEventLogEntry>;
};

export type PodLifecycleConfig = {
  __typename?: "PodLifecycleConfig";
  maxParallelPodRequests?: Maybe<Scalars["Int"]["output"]>;
  maxPodDefinitionCleanupRate?: Maybe<Scalars["Int"]["output"]>;
  maxSecretCleanupRate?: Maybe<Scalars["Int"]["output"]>;
};

export type PodLifecycleConfigInput = {
  maxParallelPodRequests: Scalars["Int"]["input"];
  maxPodDefinitionCleanupRate: Scalars["Int"]["input"];
  maxSecretCleanupRate: Scalars["Int"]["input"];
};

export type PreconditionScript = {
  __typename?: "PreconditionScript";
  path: Scalars["String"]["output"];
  script: Scalars["String"]["output"];
};

export type PreconditionScriptInput = {
  path: Scalars["String"]["input"];
  script: Scalars["String"]["input"];
};

export enum PreferredAuthType {
  Github = "GITHUB",
  Kanopy = "KANOPY",
  Multi = "MULTI",
  Naive = "NAIVE",
  Okta = "OKTA",
}

export enum PriorityLevel {
  Alert = "ALERT",
  Critical = "CRITICAL",
  Debug = "DEBUG",
  Emergency = "EMERGENCY",
  Error = "ERROR",
  Info = "INFO",
  Notice = "NOTICE",
  Trace = "TRACE",
  Warning = "WARNING",
}

/** Project models single repository on GitHub. */
export type Project = {
  __typename?: "Project";
  admins?: Maybe<Array<Scalars["String"]["output"]>>;
  banner?: Maybe<ProjectBanner>;
  batchTime: Scalars["Int"]["output"];
  branch: Scalars["String"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: CommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious?: Maybe<Scalars["Boolean"]["output"]>;
  debugSpawnHostsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  disabledStatsCache?: Maybe<Scalars["Boolean"]["output"]>;
  dispatchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  displayName: Scalars["String"]["output"];
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubChecksEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubDynamicTokenPermissionGroups: Array<GitHubDynamicTokenPermissionGroup>;
  githubMQTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  githubPRTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  githubPermissionGroupByRequester?: Maybe<Scalars["StringMap"]["output"]>;
  hidden?: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["String"]["output"];
  identifier: Scalars["String"]["output"];
  isFavorite: Scalars["Boolean"]["output"];
  manualPrTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  notifyOnBuildFailure?: Maybe<Scalars["Boolean"]["output"]>;
  oldestAllowedMergeBase: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patches: Patches;
  patchingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  perfEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  projectHealthView: ProjectHealthView;
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repoRefId: Scalars["String"]["output"];
  repotrackerDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  repotrackerError?: Maybe<RepotrackerError>;
  restricted?: Maybe<Scalars["Boolean"]["output"]>;
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskAnnotationSettings: TaskAnnotationSettings;
  testSelection?: Maybe<TestSelectionSettings>;
  tracksPushEvents?: Maybe<Scalars["Boolean"]["output"]>;
  triggers?: Maybe<Array<TriggerAlias>>;
  versionControlEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  workstationConfig: WorkstationConfig;
};

/** Project models single repository on GitHub. */
export type ProjectPatchesArgs = {
  patchesInput: PatchesInput;
};

export type ProjectAlias = {
  __typename?: "ProjectAlias";
  alias: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  gitTag: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  parameters: Array<Parameter>;
  remotePath: Scalars["String"]["output"];
  task: Scalars["String"]["output"];
  taskTags: Array<Scalars["String"]["output"]>;
  variant: Scalars["String"]["output"];
  variantTags: Array<Scalars["String"]["output"]>;
};

export type ProjectAliasInput = {
  alias: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  gitTag: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
  parameters?: InputMaybe<Array<ParameterInput>>;
  remotePath: Scalars["String"]["input"];
  task: Scalars["String"]["input"];
  taskTags: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
  variantTags: Array<Scalars["String"]["input"]>;
};

export type ProjectBanner = {
  __typename?: "ProjectBanner";
  text: Scalars["String"]["output"];
  theme: BannerTheme;
};

export type ProjectBannerInput = {
  text: Scalars["String"]["input"];
  theme: BannerTheme;
};

export type ProjectBuildVariant = {
  __typename?: "ProjectBuildVariant";
  displayName: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type ProjectCreationConfig = {
  __typename?: "ProjectCreationConfig";
  jiraProject?: Maybe<Scalars["String"]["output"]>;
  repoExceptions: Array<OwnerRepo>;
  repoProjectLimit?: Maybe<Scalars["Int"]["output"]>;
  totalProjectLimit?: Maybe<Scalars["Int"]["output"]>;
};

export type ProjectCreationConfigInput = {
  jiraProject?: InputMaybe<Scalars["String"]["input"]>;
  repoExceptions: Array<OwnerRepoInput>;
  repoProjectLimit?: InputMaybe<Scalars["Int"]["input"]>;
  totalProjectLimit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type ProjectEventLogEntry = {
  __typename?: "ProjectEventLogEntry";
  after?: Maybe<ProjectEventSettings>;
  before?: Maybe<ProjectEventSettings>;
  timestamp: Scalars["Time"]["output"];
  user: Scalars["String"]["output"];
};

export type ProjectEventSettings = {
  __typename?: "ProjectEventSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubAppAuth?: Maybe<GithubAppAuth>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * ProjectEvents contains project event log entries that concern the history of changes related to project
 * settings.
 * Although RepoSettings uses RepoRef in practice to have stronger types, this can't be enforced
 * or event logs because new fields could always be introduced that don't exist in the old event logs.
 */
export type ProjectEvents = {
  __typename?: "ProjectEvents";
  count: Scalars["Int"]["output"];
  eventLogEntries: Array<ProjectEventLogEntry>;
};

export enum ProjectHealthView {
  All = "ALL",
  Failed = "FAILED",
}

export type ProjectInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  banner?: InputMaybe<ProjectBannerInput>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  branch?: InputMaybe<Scalars["String"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  debugSpawnHostsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubDynamicTokenPermissionGroups?: InputMaybe<
    Array<GitHubDynamicTokenPermissionGroupInput>
  >;
  githubMQTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  githubPRTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  githubPermissionGroupByRequester?: InputMaybe<Scalars["StringMap"]["input"]>;
  id: Scalars["String"]["input"];
  identifier?: InputMaybe<Scalars["String"]["input"]>;
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  oldestAllowedMergeBase?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectHealthView?: InputMaybe<ProjectHealthView>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  testSelection?: InputMaybe<TestSelectionSettingsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

export enum ProjectPermission {
  Annotations = "ANNOTATIONS",
  Logs = "LOGS",
  Patches = "PATCHES",
  Settings = "SETTINGS",
  Tasks = "TASKS",
}

export type ProjectPermissions = {
  __typename?: "ProjectPermissions";
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type ProjectPermissionsOptions = {
  projectIdentifier: Scalars["String"]["input"];
};

/** ProjectSettings models the settings for a given Project. */
export type ProjectSettings = {
  __typename?: "ProjectSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubAppAuth?: Maybe<GithubAppAuth>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<Project>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * ProjectSettingsInput is the input to the saveProjectSettingsForSection mutation.
 * It contains information about project settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type ProjectSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubAppAuth?: InputMaybe<GithubAppAuthInput>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectId: Scalars["String"]["input"];
  projectRef?: InputMaybe<ProjectInput>;
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export enum ProjectSettingsSection {
  Access = "ACCESS",
  Containers = "CONTAINERS",
  General = "GENERAL",
  GithubAndCommitQueue = "GITHUB_AND_COMMIT_QUEUE",
  GithubAppSettings = "GITHUB_APP_SETTINGS",
  GithubPermissions = "GITHUB_PERMISSIONS",
  Notifications = "NOTIFICATIONS",
  PatchAliases = "PATCH_ALIASES",
  PeriodicBuilds = "PERIODIC_BUILDS",
  Plugins = "PLUGINS",
  TestSelection = "TEST_SELECTION",
  Triggers = "TRIGGERS",
  Variables = "VARIABLES",
  ViewsAndFilters = "VIEWS_AND_FILTERS",
  Workstation = "WORKSTATION",
}

export type ProjectTasksPair = {
  __typename?: "ProjectTasksPair";
  allowedBVs: Array<Scalars["String"]["output"]>;
  allowedTasks: Array<Scalars["String"]["output"]>;
  projectId: Scalars["String"]["output"];
};

export type ProjectTasksPairInput = {
  allowedBVs: Array<Scalars["String"]["input"]>;
  allowedTasks: Array<Scalars["String"]["input"]>;
  projectID: Scalars["String"]["input"];
};

export type ProjectVars = {
  __typename?: "ProjectVars";
  adminOnlyVars: Array<Scalars["String"]["output"]>;
  privateVars: Array<Scalars["String"]["output"]>;
  vars?: Maybe<Scalars["StringMap"]["output"]>;
};

export type ProjectVarsInput = {
  adminOnlyVarsList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  privateVarsList?: InputMaybe<Array<Scalars["String"]["input"]>>;
  vars?: InputMaybe<Scalars["StringMap"]["input"]>;
};

/** PromoteVarsToRepoInput is the input to the promoteVarsToRepo mutation. */
export type PromoteVarsToRepoInput = {
  projectId: Scalars["String"]["input"];
  varNames: Array<Scalars["String"]["input"]>;
};

export enum Provider {
  Docker = "DOCKER",
  Ec2Fleet = "EC2_FLEET",
  Ec2OnDemand = "EC2_ON_DEMAND",
  Static = "STATIC",
}

/** PublicKey models a public key. Users can save/modify/delete their public keys. */
export type PublicKey = {
  __typename?: "PublicKey";
  key: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
};

/** PublicKeyInput is an input to the createPublicKey and updatePublicKey mutations. */
export type PublicKeyInput = {
  key: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
};

export type QuarantineTestInput = {
  taskId: Scalars["String"]["input"];
  testName: Scalars["String"]["input"];
};

export type QuarantineTestPayload = {
  __typename?: "QuarantineTestPayload";
  success: Scalars["Boolean"]["output"];
};

export type Query = {
  __typename?: "Query";
  adminEvents: AdminEventsPayload;
  adminSettings?: Maybe<AdminSettings>;
  adminTasksToRestart: AdminTasksToRestartPayload;
  awsRegions?: Maybe<Array<Scalars["String"]["output"]>>;
  bbGetCreatedTickets: Array<JiraTicket>;
  buildBaron: BuildBaron;
  buildVariantsForTaskName?: Maybe<Array<BuildVariantTuple>>;
  clientConfig?: Maybe<ClientConfig>;
  cursorSettings?: Maybe<CursorSettings>;
  distro?: Maybe<Distro>;
  distroEvents: DistroEventsPayload;
  distroTaskQueue: Array<TaskQueueItem>;
  distros: Array<Distro>;
  githubProjectConflicts: GithubProjectConflicts;
  hasVersion: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  /** @deprecated Use host.events instead. */
  hostEvents: HostEvents;
  hosts: HostsResponse;
  image?: Maybe<Image>;
  images: Array<Scalars["String"]["output"]>;
  instanceTypes: Array<Scalars["String"]["output"]>;
  isRepo: Scalars["Boolean"]["output"];
  logkeeperBuildMetadata: LogkeeperBuild;
  mainlineCommits?: Maybe<MainlineCommits>;
  myHosts: Array<Host>;
  myPublicKeys: Array<PublicKey>;
  myVolumes: Array<Volume>;
  patch: Patch;
  pod: Pod;
  project: Project;
  projectEvents: ProjectEvents;
  projectSettings: ProjectSettings;
  projects: Array<GroupedProjects>;
  repoEvents: ProjectEvents;
  repoSettings: RepoSettings;
  spruceConfig?: Maybe<SpruceConfig>;
  subnetAvailabilityZones: Array<Scalars["String"]["output"]>;
  task?: Maybe<Task>;
  taskAllExecutions: Array<Task>;
  taskHistory: TaskHistory;
  taskNamesForBuildVariant?: Maybe<Array<Scalars["String"]["output"]>>;
  taskQueueDistros: Array<TaskQueueDistro>;
  taskTestSample?: Maybe<Array<TaskTestResultSample>>;
  user: User;
  userConfig?: Maybe<UserConfig>;
  version: Version;
  viewableProjectRefs: Array<GroupedProjects>;
  waterfall: Waterfall;
};

export type QueryAdminEventsArgs = {
  opts: AdminEventsInput;
};

export type QueryAdminTasksToRestartArgs = {
  opts: RestartAdminTasksOptions;
};

export type QueryBbGetCreatedTicketsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryBuildBaronArgs = {
  execution: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

export type QueryBuildVariantsForTaskNameArgs = {
  projectIdentifier: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type QueryDistroArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistroEventsArgs = {
  opts: DistroEventsInput;
};

export type QueryDistroTaskQueueArgs = {
  distroId: Scalars["String"]["input"];
};

export type QueryDistrosArgs = {
  onlySpawnable: Scalars["Boolean"]["input"];
};

export type QueryGithubProjectConflictsArgs = {
  projectId: Scalars["String"]["input"];
};

export type QueryHasVersionArgs = {
  patchId: Scalars["String"]["input"];
};

export type QueryHostArgs = {
  hostId: Scalars["String"]["input"];
};

export type QueryHostEventsArgs = {
  hostId: Scalars["String"]["input"];
  hostTag?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryHostsArgs = {
  currentTaskId?: InputMaybe<Scalars["String"]["input"]>;
  distroId?: InputMaybe<Scalars["String"]["input"]>;
  hostId?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<HostSortBy>;
  sortDir?: InputMaybe<SortDirection>;
  startedBy?: InputMaybe<Scalars["String"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type QueryImageArgs = {
  imageId: Scalars["String"]["input"];
};

export type QueryIsRepoArgs = {
  projectOrRepoId: Scalars["String"]["input"];
};

export type QueryLogkeeperBuildMetadataArgs = {
  buildId: Scalars["String"]["input"];
};

export type QueryMainlineCommitsArgs = {
  buildVariantOptions?: InputMaybe<BuildVariantOptions>;
  options: MainlineCommitsOptions;
};

export type QueryPatchArgs = {
  patchId: Scalars["String"]["input"];
};

export type QueryPodArgs = {
  podId: Scalars["String"]["input"];
};

export type QueryProjectArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryProjectEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryProjectSettingsArgs = {
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryRepoEventsArgs = {
  before?: InputMaybe<Scalars["Time"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  repoId: Scalars["String"]["input"];
};

export type QueryRepoSettingsArgs = {
  repoId: Scalars["String"]["input"];
};

export type QueryTaskArgs = {
  execution?: InputMaybe<Scalars["Int"]["input"]>;
  taskId: Scalars["String"]["input"];
};

export type QueryTaskAllExecutionsArgs = {
  taskId: Scalars["String"]["input"];
};

export type QueryTaskHistoryArgs = {
  options: TaskHistoryOpts;
};

export type QueryTaskNamesForBuildVariantArgs = {
  buildVariant: Scalars["String"]["input"];
  projectIdentifier: Scalars["String"]["input"];
};

export type QueryTaskTestSampleArgs = {
  filters: Array<TestFilter>;
  taskIds: Array<Scalars["String"]["input"]>;
  versionId: Scalars["String"]["input"];
};

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryVersionArgs = {
  versionId: Scalars["String"]["input"];
};

export type QueryWaterfallArgs = {
  options: WaterfallOptions;
};

export type ReleaseModeConfig = {
  __typename?: "ReleaseModeConfig";
  distroMaxHostsFactor?: Maybe<Scalars["Float"]["output"]>;
  idleTimeSecondsOverride?: Maybe<Scalars["Int"]["output"]>;
  targetTimeSecondsOverride?: Maybe<Scalars["Int"]["output"]>;
};

export type ReleaseModeConfigInput = {
  distroMaxHostsFactor?: InputMaybe<Scalars["Float"]["input"]>;
  idleTimeSecondsOverride?: InputMaybe<Scalars["Int"]["input"]>;
  targetTimeSecondsOverride?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RemoveFavoriteProjectInput = {
  projectIdentifier: Scalars["String"]["input"];
};

export type RepoCommitQueueParams = {
  __typename?: "RepoCommitQueueParams";
  enabled: Scalars["Boolean"]["output"];
  mergeMethod: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type RepoPermissions = {
  __typename?: "RepoPermissions";
  edit: Scalars["Boolean"]["output"];
  view: Scalars["Boolean"]["output"];
};

export type RepoPermissionsOptions = {
  repoId: Scalars["String"]["input"];
};

/**
 * RepoRef is technically a special kind of Project.
 * Repo types have booleans defaulted, which is why it is necessary to redeclare the types despite them matching nearly
 * exactly.
 */
export type RepoRef = {
  __typename?: "RepoRef";
  admins: Array<Scalars["String"]["output"]>;
  batchTime: Scalars["Int"]["output"];
  buildBaronSettings: BuildBaronSettings;
  commitQueue: RepoCommitQueueParams;
  containerSizeDefinitions?: Maybe<Array<ContainerResources>>;
  deactivatePrevious: Scalars["Boolean"]["output"];
  debugSpawnHostsDisabled: Scalars["Boolean"]["output"];
  disabledStatsCache: Scalars["Boolean"]["output"];
  dispatchingDisabled: Scalars["Boolean"]["output"];
  displayName: Scalars["String"]["output"];
  enabled: Scalars["Boolean"]["output"];
  externalLinks?: Maybe<Array<ExternalLink>>;
  gitTagAuthorizedTeams?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagAuthorizedUsers?: Maybe<Array<Scalars["String"]["output"]>>;
  gitTagVersionsEnabled: Scalars["Boolean"]["output"];
  githubChecksEnabled: Scalars["Boolean"]["output"];
  githubDynamicTokenPermissionGroups: Array<GitHubDynamicTokenPermissionGroup>;
  githubMQTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  githubPRTriggerAliases?: Maybe<Array<Scalars["String"]["output"]>>;
  githubPermissionGroupByRequester?: Maybe<Scalars["StringMap"]["output"]>;
  id: Scalars["String"]["output"];
  manualPrTestingEnabled: Scalars["Boolean"]["output"];
  notifyOnBuildFailure: Scalars["Boolean"]["output"];
  oldestAllowedMergeBase: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  patchTriggerAliases?: Maybe<Array<PatchTriggerAlias>>;
  patchingDisabled: Scalars["Boolean"]["output"];
  perfEnabled: Scalars["Boolean"]["output"];
  periodicBuilds?: Maybe<Array<PeriodicBuild>>;
  prTestingEnabled: Scalars["Boolean"]["output"];
  remotePath: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  repotrackerDisabled: Scalars["Boolean"]["output"];
  restricted: Scalars["Boolean"]["output"];
  spawnHostScriptPath: Scalars["String"]["output"];
  stepbackBisect?: Maybe<Scalars["Boolean"]["output"]>;
  stepbackDisabled: Scalars["Boolean"]["output"];
  taskAnnotationSettings: TaskAnnotationSettings;
  testSelection?: Maybe<RepoTestSelectionSettings>;
  tracksPushEvents: Scalars["Boolean"]["output"];
  triggers: Array<TriggerAlias>;
  versionControlEnabled: Scalars["Boolean"]["output"];
  workstationConfig: RepoWorkstationConfig;
};

export type RepoRefInput = {
  admins?: InputMaybe<Array<Scalars["String"]["input"]>>;
  batchTime?: InputMaybe<Scalars["Int"]["input"]>;
  buildBaronSettings?: InputMaybe<BuildBaronSettingsInput>;
  commitQueue?: InputMaybe<CommitQueueParamsInput>;
  containerSizeDefinitions?: InputMaybe<Array<ContainerResourcesInput>>;
  deactivatePrevious?: InputMaybe<Scalars["Boolean"]["input"]>;
  debugSpawnHostsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  disabledStatsCache?: InputMaybe<Scalars["Boolean"]["input"]>;
  dispatchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  displayName?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  externalLinks?: InputMaybe<Array<ExternalLinkInput>>;
  gitTagAuthorizedTeams?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagAuthorizedUsers?: InputMaybe<Array<Scalars["String"]["input"]>>;
  gitTagVersionsEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubChecksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubDynamicTokenPermissionGroups?: InputMaybe<
    Array<GitHubDynamicTokenPermissionGroupInput>
  >;
  githubMQTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  githubPRTriggerAliases?: InputMaybe<Array<Scalars["String"]["input"]>>;
  githubPermissionGroupByRequester?: InputMaybe<Scalars["StringMap"]["input"]>;
  id: Scalars["String"]["input"];
  manualPrTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  notifyOnBuildFailure?: InputMaybe<Scalars["Boolean"]["input"]>;
  oldestAllowedMergeBase?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  parsleyFilters?: InputMaybe<Array<ParsleyFilterInput>>;
  patchTriggerAliases?: InputMaybe<Array<PatchTriggerAliasInput>>;
  patchingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  perfEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  periodicBuilds?: InputMaybe<Array<PeriodicBuildInput>>;
  prTestingEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  remotePath?: InputMaybe<Scalars["String"]["input"]>;
  repo?: InputMaybe<Scalars["String"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  restricted?: InputMaybe<Scalars["Boolean"]["input"]>;
  spawnHostScriptPath?: InputMaybe<Scalars["String"]["input"]>;
  stepbackBisect?: InputMaybe<Scalars["Boolean"]["input"]>;
  stepbackDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskAnnotationSettings?: InputMaybe<TaskAnnotationSettingsInput>;
  testSelection?: InputMaybe<TestSelectionSettingsInput>;
  tracksPushEvents?: InputMaybe<Scalars["Boolean"]["input"]>;
  triggers?: InputMaybe<Array<TriggerAliasInput>>;
  versionControlEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  workstationConfig?: InputMaybe<WorkstationConfigInput>;
};

/** RepoSettings models the settings for a given RepoRef. */
export type RepoSettings = {
  __typename?: "RepoSettings";
  aliases?: Maybe<Array<ProjectAlias>>;
  githubAppAuth?: Maybe<GithubAppAuth>;
  githubWebhooksEnabled: Scalars["Boolean"]["output"];
  projectRef?: Maybe<RepoRef>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  vars?: Maybe<ProjectVars>;
};

/**
 * RepoSettingsInput is the input to the saveRepoSettingsForSection mutation.
 * It contains information about repo settings (e.g. Build Baron configurations, subscriptions, etc) and is used to
 * update the settings for a given project.
 */
export type RepoSettingsInput = {
  aliases?: InputMaybe<Array<ProjectAliasInput>>;
  githubAppAuth?: InputMaybe<GithubAppAuthInput>;
  githubWebhooksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectRef?: InputMaybe<RepoRefInput>;
  repoId: Scalars["String"]["input"];
  subscriptions?: InputMaybe<Array<SubscriptionInput>>;
  vars?: InputMaybe<ProjectVarsInput>;
};

export type RepoTestSelectionSettings = {
  __typename?: "RepoTestSelectionSettings";
  allowed: Scalars["Boolean"]["output"];
  defaultEnabled: Scalars["Boolean"]["output"];
};

export type RepoWorkstationConfig = {
  __typename?: "RepoWorkstationConfig";
  gitClone: Scalars["Boolean"]["output"];
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type RepotrackerConfig = {
  __typename?: "RepotrackerConfig";
  maxConcurrentRequests?: Maybe<Scalars["Int"]["output"]>;
  maxRepoRevisionsToSearch?: Maybe<Scalars["Int"]["output"]>;
  numNewRepoRevisionsToFetch?: Maybe<Scalars["Int"]["output"]>;
};

export type RepotrackerConfigInput = {
  maxConcurrentRequests: Scalars["Int"]["input"];
  maxRepoRevisionsToSearch: Scalars["Int"]["input"];
  numNewRepoRevisionsToFetch: Scalars["Int"]["input"];
};

export type RepotrackerError = {
  __typename?: "RepotrackerError";
  exists: Scalars["Boolean"]["output"];
  invalidRevision: Scalars["String"]["output"];
  mergeBaseRevision: Scalars["String"]["output"];
};

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustFinish = "MUST_FINISH",
  MustSucceed = "MUST_SUCCEED",
}

export type ResourceLimits = {
  __typename?: "ResourceLimits";
  lockedMemoryKb: Scalars["Int"]["output"];
  numFiles: Scalars["Int"]["output"];
  numProcesses: Scalars["Int"]["output"];
  numTasks: Scalars["Int"]["output"];
  virtualMemoryKb: Scalars["Int"]["output"];
};

export type ResourceLimitsInput = {
  lockedMemoryKb: Scalars["Int"]["input"];
  numFiles: Scalars["Int"]["input"];
  numProcesses: Scalars["Int"]["input"];
  numTasks: Scalars["Int"]["input"];
  virtualMemoryKb: Scalars["Int"]["input"];
};

export type RestartAdminTasksOptions = {
  endTime: Scalars["Time"]["input"];
  includeSetupFailed: Scalars["Boolean"]["input"];
  includeSystemFailed: Scalars["Boolean"]["input"];
  includeTestFailed: Scalars["Boolean"]["input"];
  startTime: Scalars["Time"]["input"];
};

export type RestartAdminTasksPayload = {
  __typename?: "RestartAdminTasksPayload";
  numRestartedTasks: Scalars["Int"]["output"];
};

export enum RoundingRule {
  Default = "DEFAULT",
  Down = "DOWN",
  Up = "UP",
}

export type RuntimeEnvironmentConfig = {
  __typename?: "RuntimeEnvironmentConfig";
  apiKey?: Maybe<Scalars["String"]["output"]>;
  baseUrl: Scalars["String"]["output"];
};

export type RuntimeEnvironmentConfigInput = {
  apiKey?: InputMaybe<Scalars["String"]["input"]>;
  baseUrl: Scalars["String"]["input"];
};

export type S3CostConfig = {
  __typename?: "S3CostConfig";
  storage?: Maybe<S3StorageCostConfig>;
  upload?: Maybe<S3UploadCostConfig>;
};

export type S3CostConfigInput = {
  storage?: InputMaybe<S3StorageCostConfigInput>;
  upload?: InputMaybe<S3UploadCostConfigInput>;
};

export type S3Credentials = {
  __typename?: "S3Credentials";
  bucket?: Maybe<Scalars["String"]["output"]>;
  key?: Maybe<Scalars["String"]["output"]>;
  secret?: Maybe<Scalars["String"]["output"]>;
};

export type S3CredentialsInput = {
  bucket?: InputMaybe<Scalars["String"]["input"]>;
  key?: InputMaybe<Scalars["String"]["input"]>;
  secret?: InputMaybe<Scalars["String"]["input"]>;
};

export type S3StorageCostConfig = {
  __typename?: "S3StorageCostConfig";
  iAStorageCostDiscount?: Maybe<Scalars["Float"]["output"]>;
  standardStorageCostDiscount?: Maybe<Scalars["Float"]["output"]>;
};

export type S3StorageCostConfigInput = {
  iAStorageCostDiscount?: InputMaybe<Scalars["Float"]["input"]>;
  standardStorageCostDiscount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type S3UploadCostConfig = {
  __typename?: "S3UploadCostConfig";
  uploadCostDiscount?: Maybe<Scalars["Float"]["output"]>;
};

export type S3UploadCostConfigInput = {
  uploadCostDiscount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type SesConfig = {
  __typename?: "SESConfig";
  senderAddress?: Maybe<Scalars["String"]["output"]>;
};

export type SesConfigInput = {
  senderAddress: Scalars["String"]["input"];
};

export type SshConfig = {
  __typename?: "SSHConfig";
  spawnHostKey?: Maybe<SshKeyPair>;
  taskHostKey?: Maybe<SshKeyPair>;
};

export type SshConfigInput = {
  spawnHostKey?: InputMaybe<SshKeyPairInput>;
  taskHostKey?: InputMaybe<SshKeyPairInput>;
};

export type SshKeyPair = {
  __typename?: "SSHKeyPair";
  name?: Maybe<Scalars["String"]["output"]>;
  secretARN?: Maybe<Scalars["String"]["output"]>;
};

export type SshKeyPairInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  secretARN?: InputMaybe<Scalars["String"]["input"]>;
};

export type SageConfig = {
  __typename?: "SageConfig";
  baseUrl?: Maybe<Scalars["String"]["output"]>;
};

export type SageConfigInput = {
  baseUrl?: InputMaybe<Scalars["String"]["input"]>;
};

export type SaveAdminSettingsInput = {
  adminSettings: AdminSettingsInput;
};

/** SaveDistroInput is the input to the saveDistro mutation. */
export type SaveDistroInput = {
  distro: DistroInput;
  onSave: DistroOnSaveOperation;
};

/** Return type representing the updated distro and the number of hosts that were updated. */
export type SaveDistroPayload = {
  __typename?: "SaveDistroPayload";
  distro: Distro;
  hostCount: Scalars["Int"]["output"];
};

export type SchedulerConfig = {
  __typename?: "SchedulerConfig";
  acceptableHostIdleTimeSeconds?: Maybe<Scalars["Int"]["output"]>;
  cacheDurationSeconds?: Maybe<Scalars["Int"]["output"]>;
  commitQueueFactor?: Maybe<Scalars["Int"]["output"]>;
  expectedRuntimeFactor?: Maybe<Scalars["Int"]["output"]>;
  futureHostFraction?: Maybe<Scalars["Float"]["output"]>;
  generateTaskFactor?: Maybe<Scalars["Int"]["output"]>;
  groupVersions: Scalars["Boolean"]["output"];
  hostAllocator?: Maybe<HostAllocatorVersion>;
  hostAllocatorFeedbackRule?: Maybe<FeedbackRule>;
  hostAllocatorRoundingRule?: Maybe<RoundingRule>;
  hostsOverallocatedRule?: Maybe<OverallocatedRule>;
  mainlineTimeInQueueFactor?: Maybe<Scalars["Int"]["output"]>;
  numDependentsFactor?: Maybe<Scalars["Float"]["output"]>;
  patchFactor?: Maybe<Scalars["Int"]["output"]>;
  patchTimeInQueueFactor?: Maybe<Scalars["Int"]["output"]>;
  stepbackTaskFactor?: Maybe<Scalars["Int"]["output"]>;
  targetTimeSeconds?: Maybe<Scalars["Int"]["output"]>;
  taskFinder?: Maybe<FinderVersion>;
};

export type SchedulerConfigInput = {
  acceptableHostIdleTimeSeconds: Scalars["Int"]["input"];
  cacheDurationSeconds: Scalars["Int"]["input"];
  commitQueueFactor: Scalars["Int"]["input"];
  expectedRuntimeFactor: Scalars["Int"]["input"];
  futureHostFraction: Scalars["Float"]["input"];
  generateTaskFactor: Scalars["Int"]["input"];
  groupVersions: Scalars["Boolean"]["input"];
  hostAllocator: HostAllocatorVersion;
  hostAllocatorFeedbackRule: FeedbackRule;
  hostAllocatorRoundingRule: RoundingRule;
  hostsOverallocatedRule: OverallocatedRule;
  mainlineTimeInQueueFactor: Scalars["Int"]["input"];
  numDependentsFactor: Scalars["Float"]["input"];
  patchFactor: Scalars["Int"]["input"];
  patchTimeInQueueFactor: Scalars["Int"]["input"];
  stepbackTaskFactor: Scalars["Int"]["input"];
  targetTimeSeconds: Scalars["Int"]["input"];
  taskFinder: FinderVersion;
};

export type SearchReturnInfo = {
  __typename?: "SearchReturnInfo";
  featuresURL: Scalars["String"]["output"];
  issues: Array<JiraTicket>;
  search: Scalars["String"]["output"];
  source: Scalars["String"]["output"];
};

export type SecretsManagerConfig = {
  __typename?: "SecretsManagerConfig";
  secretPrefix?: Maybe<Scalars["String"]["output"]>;
};

export type SecretsManagerConfigInput = {
  secretPrefix?: InputMaybe<Scalars["String"]["input"]>;
};

export type Selector = {
  __typename?: "Selector";
  data: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type SelectorInput = {
  data: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type ServiceFlags = {
  __typename?: "ServiceFlags";
  agentStartDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  alertsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  backgroundReauthDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  backgroundStatsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  cacheStatsEndpointDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  cacheStatsJobDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  checkBlockedTasksDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  cliUpdatesDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  cloudCleanupDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  debugSpawnHostDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  degradedModeDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  elasticIPsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  emailNotificationsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  eventProcessingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubPRTestingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  githubStatusAPIDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  hostAllocatorDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  hostInitDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  jiraNotificationsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  jwtTokenForCLIDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  largeParserProjectsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  monitorDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  podAllocatorDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  podInitDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  releaseModeDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  repotrackerDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  s3LifecycleSyncDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  schedulerDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  slackNotificationsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  sleepScheduleDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  staticAPIKeysDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  systemFailedTaskRestartDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskDispatchDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskLoggingDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  taskReliabilityDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  unrecognizedPodCleanupDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  useGitForGitHubFilesDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  webhookNotificationsDisabled?: Maybe<Scalars["Boolean"]["output"]>;
};

export type ServiceFlagsInput = {
  agentStartDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  alertsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  backgroundReauthDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  backgroundStatsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  cacheStatsEndpointDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  cacheStatsJobDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  checkBlockedTasksDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  cliUpdatesDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  cloudCleanupDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  debugSpawnHostDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  degradedModeDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  elasticIPsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  emailNotificationsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  eventProcessingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubPRTestingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  githubStatusAPIDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  hostAllocatorDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  hostInitDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  jiraNotificationsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  jwtTokenForCLIDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  largeParserProjectsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  monitorDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  podAllocatorDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  podInitDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  releaseModeDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  repotrackerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  s3LifecycleSyncDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  schedulerDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  slackNotificationsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  sleepScheduleDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  staticAPIKeysDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  systemFailedTaskRestartDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskDispatchDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskLoggingDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskReliabilityDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  unrecognizedPodCleanupDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  useGitForGitHubFilesDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  webhookNotificationsDisabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** SetCursorAPIKeyPayload is the response from setting a Cursor API key. */
export type SetCursorApiKeyPayload = {
  __typename?: "SetCursorAPIKeyPayload";
  keyLastFour?: Maybe<Scalars["String"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

/**
 * SetLastRevisionInput is the input to the setLastRevision mutation.
 * It contains information used to fix the repotracker error of a project.
 */
export type SetLastRevisionInput = {
  projectIdentifier: Scalars["String"]["input"];
  revision: Scalars["String"]["input"];
};

export type SetLastRevisionPayload = {
  __typename?: "SetLastRevisionPayload";
  mergeBaseRevision: Scalars["String"]["output"];
};

export type SingleTaskDistroConfig = {
  __typename?: "SingleTaskDistroConfig";
  projectTasksPairs: Array<ProjectTasksPair>;
};

export type SingleTaskDistroConfigInput = {
  projectTasksPairs: Array<ProjectTasksPairInput>;
};

export type SlackConfig = {
  __typename?: "SlackConfig";
  level?: Maybe<PriorityLevel>;
  name?: Maybe<Scalars["String"]["output"]>;
  options?: Maybe<SlackOptions>;
  token?: Maybe<Scalars["String"]["output"]>;
};

export type SlackConfigInput = {
  level?: InputMaybe<PriorityLevel>;
  name: Scalars["String"]["input"];
  options?: InputMaybe<SlackOptionsInput>;
  token: Scalars["String"]["input"];
};

export type SlackOptions = {
  __typename?: "SlackOptions";
  allFields?: Maybe<Scalars["Boolean"]["output"]>;
  basicMetadata?: Maybe<Scalars["Boolean"]["output"]>;
  channel?: Maybe<Scalars["String"]["output"]>;
  fields?: Maybe<Scalars["Boolean"]["output"]>;
  fieldsSet?: Maybe<Scalars["BooleanMap"]["output"]>;
  hostname?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
};

export type SlackOptionsInput = {
  allFields?: InputMaybe<Scalars["Boolean"]["input"]>;
  basicMetadata?: InputMaybe<Scalars["Boolean"]["input"]>;
  channel?: InputMaybe<Scalars["String"]["input"]>;
  fields?: InputMaybe<Scalars["Boolean"]["input"]>;
  fieldsSet?: InputMaybe<Scalars["BooleanMap"]["input"]>;
  hostname?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

export type SleepSchedule = {
  __typename?: "SleepSchedule";
  dailyStartTime: Scalars["String"]["output"];
  dailyStopTime: Scalars["String"]["output"];
  nextStartTime?: Maybe<Scalars["Time"]["output"]>;
  nextStopTime?: Maybe<Scalars["Time"]["output"]>;
  permanentlyExempt: Scalars["Boolean"]["output"];
  shouldKeepOff: Scalars["Boolean"]["output"];
  temporarilyExemptUntil?: Maybe<Scalars["Time"]["output"]>;
  timeZone: Scalars["String"]["output"];
  wholeWeekdaysOff: Array<Scalars["Int"]["output"]>;
};

export type SleepScheduleConfig = {
  __typename?: "SleepScheduleConfig";
  permanentlyExemptHosts: Array<Scalars["String"]["output"]>;
};

export type SleepScheduleConfigInput = {
  permanentlyExemptHosts: Array<Scalars["String"]["input"]>;
};

export type SleepScheduleInput = {
  dailyStartTime: Scalars["String"]["input"];
  dailyStopTime: Scalars["String"]["input"];
  permanentlyExempt: Scalars["Boolean"]["input"];
  shouldKeepOff: Scalars["Boolean"]["input"];
  temporarilyExemptUntil?: InputMaybe<Scalars["Time"]["input"]>;
  timeZone: Scalars["String"]["input"];
  wholeWeekdaysOff: Array<Scalars["Int"]["input"]>;
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

/** SortOrder[] is an input value for version.tasks. It is used to define whether to sort by ASC/DEC for a given sort key. */
export type SortOrder = {
  Direction: SortDirection;
  Key: TaskSortCategory;
};

export type Source = {
  __typename?: "Source";
  author: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  time: Scalars["Time"]["output"];
};

export type SpawnHostConfig = {
  __typename?: "SpawnHostConfig";
  spawnHostsPerUser?: Maybe<Scalars["Int"]["output"]>;
  unexpirableHostsPerUser?: Maybe<Scalars["Int"]["output"]>;
  unexpirableVolumesPerUser?: Maybe<Scalars["Int"]["output"]>;
};

export type SpawnHostConfigInput = {
  spawnHostsPerUser?: InputMaybe<Scalars["Int"]["input"]>;
  unexpirableHostsPerUser?: InputMaybe<Scalars["Int"]["input"]>;
  unexpirableVolumesPerUser?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * SpawnHostInput is the input to the spawnHost mutation.
 * Its fields determine the properties of the host that will be spawned.
 */
export type SpawnHostInput = {
  distroId: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  homeVolumeSize?: InputMaybe<Scalars["Int"]["input"]>;
  isDebug?: InputMaybe<Scalars["Boolean"]["input"]>;
  isVirtualWorkStation: Scalars["Boolean"]["input"];
  noExpiration: Scalars["Boolean"]["input"];
  publicKey: PublicKeyInput;
  region: Scalars["String"]["input"];
  savePublicKey: Scalars["Boolean"]["input"];
  setUpScript?: InputMaybe<Scalars["String"]["input"]>;
  sleepSchedule?: InputMaybe<SleepScheduleInput>;
  spawnHostsStartedByTask?: InputMaybe<Scalars["Boolean"]["input"]>;
  taskId?: InputMaybe<Scalars["String"]["input"]>;
  useOAuth?: InputMaybe<Scalars["Boolean"]["input"]>;
  useProjectSetupScript?: InputMaybe<Scalars["Boolean"]["input"]>;
  useTaskConfig?: InputMaybe<Scalars["Boolean"]["input"]>;
  userDataScript?: InputMaybe<Scalars["String"]["input"]>;
  volumeId?: InputMaybe<Scalars["String"]["input"]>;
};

export enum SpawnHostStatusActions {
  Reboot = "REBOOT",
  Start = "START",
  Stop = "STOP",
  Terminate = "TERMINATE",
}

/**
 * SpawnVolumeInput is the input to the spawnVolume mutation.
 * Its fields determine the properties of the volume that will be spawned.
 */
export type SpawnVolumeInput = {
  availabilityZone: Scalars["String"]["input"];
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  host?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  size: Scalars["Int"]["input"];
  type: Scalars["String"]["input"];
};

export type SplunkConfig = {
  __typename?: "SplunkConfig";
  splunkConnectionInfo: SplunkConnectionInfo;
};

export type SplunkConfigInput = {
  splunkConnectionInfo: SplunkConnectionInfoInput;
};

export type SplunkConnectionInfo = {
  __typename?: "SplunkConnectionInfo";
  channel: Scalars["String"]["output"];
  serverUrl: Scalars["String"]["output"];
  token: Scalars["String"]["output"];
};

export type SplunkConnectionInfoInput = {
  channel: Scalars["String"]["input"];
  serverUrl: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

/**
 * SpruceConfig defines settings that apply to all users of Evergreen.
 * For example, if the banner field is populated, then a sitewide banner will be shown to all users.
 */
export type SpruceConfig = {
  __typename?: "SpruceConfig";
  banner?: Maybe<Scalars["String"]["output"]>;
  bannerTheme?: Maybe<Scalars["String"]["output"]>;
  containerPools?: Maybe<ContainerPoolsConfig>;
  githubOrgs: Array<Scalars["String"]["output"]>;
  jira?: Maybe<JiraConfig>;
  providers?: Maybe<CloudProviderConfig>;
  secretFields: Array<Scalars["String"]["output"]>;
  serviceFlags: UserServiceFlags;
  singleTaskDistro?: Maybe<SingleTaskDistroConfig>;
  slack?: Maybe<SlackConfig>;
  spawnHost: SpawnHostConfig;
  ui: UiConfig;
};

export type StatusCount = {
  __typename?: "StatusCount";
  count: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
};

export type StepbackInfo = {
  __typename?: "StepbackInfo";
  lastFailingStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  lastPassingStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  nextStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
  previousStepbackTaskId?: Maybe<Scalars["String"]["output"]>;
};

export type Subnet = {
  __typename?: "Subnet";
  az: Scalars["String"]["output"];
  subnetId: Scalars["String"]["output"];
};

export type SubnetInput = {
  az: Scalars["String"]["input"];
  subnetId: Scalars["String"]["input"];
};

export type Subscriber = {
  __typename?: "Subscriber";
  emailSubscriber?: Maybe<Scalars["String"]["output"]>;
  githubCheckSubscriber?: Maybe<GithubCheckSubscriber>;
  githubPRSubscriber?: Maybe<GithubPrSubscriber>;
  jiraCommentSubscriber?: Maybe<Scalars["String"]["output"]>;
  jiraIssueSubscriber?: Maybe<JiraIssueSubscriber>;
  slackSubscriber?: Maybe<Scalars["String"]["output"]>;
  webhookSubscriber?: Maybe<WebhookSubscriber>;
};

export type SubscriberInput = {
  jiraIssueSubscriber?: InputMaybe<JiraIssueSubscriberInput>;
  target: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
  webhookSubscriber?: InputMaybe<WebhookSubscriberInput>;
};

export type SubscriberWrapper = {
  __typename?: "SubscriberWrapper";
  subscriber: Subscriber;
  type: Scalars["String"]["output"];
};

/**
 * SubscriptionInput is the input to the saveSubscription mutation.
 * It stores information about a user's subscription to a version or task. For example, a user
 * can have a subscription to send them a Slack message when a version finishes.
 */
export type SubscriptionInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  owner?: InputMaybe<Scalars["String"]["input"]>;
  owner_type?: InputMaybe<Scalars["String"]["input"]>;
  regex_selectors: Array<SelectorInput>;
  resource_type?: InputMaybe<Scalars["String"]["input"]>;
  selectors: Array<SelectorInput>;
  subscriber: SubscriberInput;
  trigger?: InputMaybe<Scalars["String"]["input"]>;
  trigger_data: Scalars["StringMap"]["input"];
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type Task = {
  __typename?: "Task";
  abortInfo?: Maybe<AbortInfo>;
  aborted: Scalars["Boolean"]["output"];
  activated: Scalars["Boolean"]["output"];
  activatedBy?: Maybe<Scalars["String"]["output"]>;
  activatedTime?: Maybe<Scalars["Time"]["output"]>;
  ami?: Maybe<Scalars["String"]["output"]>;
  annotation?: Maybe<Annotation>;
  /** This is a base task's display status. */
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  baseTask?: Maybe<Task>;
  blocked: Scalars["Boolean"]["output"];
  buildId: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  buildVariantDisplayName?: Maybe<Scalars["String"]["output"]>;
  canAbort: Scalars["Boolean"]["output"];
  canDisable: Scalars["Boolean"]["output"];
  canModifyAnnotation: Scalars["Boolean"]["output"];
  canOverrideDependencies: Scalars["Boolean"]["output"];
  canRestart: Scalars["Boolean"]["output"];
  canSchedule: Scalars["Boolean"]["output"];
  canSetPriority: Scalars["Boolean"]["output"];
  canUnschedule: Scalars["Boolean"]["output"];
  containerAllocatedTime?: Maybe<Scalars["Time"]["output"]>;
  createTime?: Maybe<Scalars["Time"]["output"]>;
  dependsOn?: Maybe<Array<Dependency>>;
  details?: Maybe<TaskEndDetail>;
  dispatchTime?: Maybe<Scalars["Time"]["output"]>;
  displayName: Scalars["String"]["output"];
  /** This is a task's display status and is what is commonly used on the UI. */
  displayOnly?: Maybe<Scalars["Boolean"]["output"]>;
  displayStatus: Scalars["String"]["output"];
  displayTask?: Maybe<Task>;
  distroId: Scalars["String"]["output"];
  estimatedStart?: Maybe<Scalars["Duration"]["output"]>;
  execution: Scalars["Int"]["output"];
  executionTasks?: Maybe<Array<Scalars["String"]["output"]>>;
  executionTasksFull?: Maybe<Array<Task>>;
  expectedDuration?: Maybe<Scalars["Duration"]["output"]>;
  failedTestCount: Scalars["Int"]["output"];
  files: TaskFiles;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  generateTask?: Maybe<Scalars["Boolean"]["output"]>;
  generatedBy?: Maybe<Scalars["String"]["output"]>;
  generatedByName?: Maybe<Scalars["String"]["output"]>;
  hasTestResults: Scalars["Boolean"]["output"];
  hostId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  imageId: Scalars["String"]["output"];
  ingestTime?: Maybe<Scalars["Time"]["output"]>;
  isPerfPluginEnabled: Scalars["Boolean"]["output"];
  latestExecution: Scalars["Int"]["output"];
  logs: TaskLogLinks;
  minQueuePosition: Scalars["Int"]["output"];
  order: Scalars["Int"]["output"];
  patch?: Maybe<Patch>;
  patchNumber?: Maybe<Scalars["Int"]["output"]>;
  pod?: Maybe<Pod>;
  predictedTaskCost?: Maybe<Cost>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  project?: Maybe<Project>;
  projectId: Scalars["String"]["output"];
  projectIdentifier?: Maybe<Scalars["String"]["output"]>;
  requester: Scalars["String"]["output"];
  resetWhenFinished: Scalars["Boolean"]["output"];
  revision?: Maybe<Scalars["String"]["output"]>;
  scheduledTime?: Maybe<Scalars["Time"]["output"]>;
  spawnHostLink?: Maybe<Scalars["String"]["output"]>;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  /** This is a task's original status. It is the status stored in the database, and is distinct from the displayStatus. */
  status: Scalars["String"]["output"];
  /** taskLogs returns the tail 100 lines of the task's logs. */
  stepbackInfo?: Maybe<StepbackInfo>;
  tags: Array<Scalars["String"]["output"]>;
  taskCost?: Maybe<Cost>;
  taskGroup?: Maybe<Scalars["String"]["output"]>;
  taskGroupMaxHosts?: Maybe<Scalars["Int"]["output"]>;
  taskLogs: TaskLogs;
  taskOwnerTeam?: Maybe<TaskOwnerTeam>;
  testSelectionEnabled: Scalars["Boolean"]["output"];
  tests: TaskTestResult;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
  totalTestCount: Scalars["Int"]["output"];
  versionMetadata: Version;
};

/** Task models a task, the simplest unit of execution for Evergreen. */
export type TaskTestsArgs = {
  opts?: InputMaybe<TestFilterOptions>;
};

export type TaskAnnotationSettings = {
  __typename?: "TaskAnnotationSettings";
  fileTicketWebhook: Webhook;
};

export type TaskAnnotationSettingsInput = {
  fileTicketWebhook?: InputMaybe<WebhookInput>;
};

export type TaskContainerCreationOpts = {
  __typename?: "TaskContainerCreationOpts";
  arch: Scalars["String"]["output"];
  cpu: Scalars["Int"]["output"];
  image: Scalars["String"]["output"];
  memoryMB: Scalars["Int"]["output"];
  os: Scalars["String"]["output"];
  workingDir: Scalars["String"]["output"];
};

/** TaskCountOptions defines the parameters that are used when counting tasks from a Version. */
export type TaskCountOptions = {
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TaskEndDetail = {
  __typename?: "TaskEndDetail";
  description?: Maybe<Scalars["String"]["output"]>;
  diskDevices: Array<Scalars["String"]["output"]>;
  failingCommand?: Maybe<Scalars["String"]["output"]>;
  failureMetadataTags: Array<Scalars["String"]["output"]>;
  oomTracker: OomTrackerInfo;
  otherFailingCommands: Array<FailingCommand>;
  status: Scalars["String"]["output"];
  timedOut?: Maybe<Scalars["Boolean"]["output"]>;
  timeoutType?: Maybe<Scalars["String"]["output"]>;
  traceID?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
};

export type TaskEventLogData = {
  __typename?: "TaskEventLogData";
  blockedOn?: Maybe<Scalars["String"]["output"]>;
  hostId?: Maybe<Scalars["String"]["output"]>;
  jiraIssue?: Maybe<Scalars["String"]["output"]>;
  jiraLink?: Maybe<Scalars["String"]["output"]>;
  podId?: Maybe<Scalars["String"]["output"]>;
  priority?: Maybe<Scalars["Int"]["output"]>;
  status?: Maybe<Scalars["String"]["output"]>;
  timestamp?: Maybe<Scalars["Time"]["output"]>;
  userId?: Maybe<Scalars["String"]["output"]>;
};

export type TaskEventLogEntry = {
  __typename?: "TaskEventLogEntry";
  data: TaskEventLogData;
  eventType?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  processedAt?: Maybe<Scalars["Time"]["output"]>;
  resourceId: Scalars["String"]["output"];
  resourceType: Scalars["String"]["output"];
  timestamp?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * TaskFiles is the return value for the taskFiles query.
 * Some tasks generate files which are represented by this type.
 */
export type TaskFiles = {
  __typename?: "TaskFiles";
  fileCount: Scalars["Int"]["output"];
  groupedFiles: Array<GroupedFiles>;
};

/** TaskFilterOptions defines the parameters that are used when fetching tasks from a Version. */
export type TaskFilterOptions = {
  baseStatuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  includeNeverActivatedTasks?: InputMaybe<Scalars["Boolean"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sorts?: InputMaybe<Array<SortOrder>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  taskName?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<Scalars["String"]["input"]>;
};

export type TaskHistory = {
  __typename?: "TaskHistory";
  pagination: TaskHistoryPagination;
  tasks: Array<Task>;
};

export enum TaskHistoryDirection {
  After = "AFTER",
  Before = "BEFORE",
}

export type TaskHistoryOpts = {
  buildVariant: Scalars["String"]["input"];
  cursorParams: CursorParams;
  date?: InputMaybe<Scalars["Time"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
  taskName: Scalars["String"]["input"];
};

export type TaskHistoryPagination = {
  __typename?: "TaskHistoryPagination";
  mostRecentTaskOrder: Scalars["Int"]["output"];
  oldestTaskOrder: Scalars["Int"]["output"];
};

export type TaskInfo = {
  __typename?: "TaskInfo";
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type TaskLimitsConfig = {
  __typename?: "TaskLimitsConfig";
  maxConcurrentLargeParserProjectTasks?: Maybe<Scalars["Int"]["output"]>;
  maxDailyAutomaticRestarts?: Maybe<Scalars["Int"]["output"]>;
  maxDegradedModeConcurrentLargeParserProjectTasks?: Maybe<
    Scalars["Int"]["output"]
  >;
  maxDegradedModeParserProjectSize?: Maybe<Scalars["Int"]["output"]>;
  maxExecTimeoutSecs?: Maybe<Scalars["Int"]["output"]>;
  maxGenerateTaskJSONSize?: Maybe<Scalars["Int"]["output"]>;
  maxHourlyPatchTasks?: Maybe<Scalars["Int"]["output"]>;
  maxIncludesPerVersion?: Maybe<Scalars["Int"]["output"]>;
  maxParserProjectSize?: Maybe<Scalars["Int"]["output"]>;
  maxPendingGeneratedTasks?: Maybe<Scalars["Int"]["output"]>;
  maxTaskExecution?: Maybe<Scalars["Int"]["output"]>;
  maxTasksPerVersion?: Maybe<Scalars["Int"]["output"]>;
};

export type TaskLimitsConfigInput = {
  maxConcurrentLargeParserProjectTasks: Scalars["Int"]["input"];
  maxDailyAutomaticRestarts: Scalars["Int"]["input"];
  maxDegradedModeConcurrentLargeParserProjectTasks: Scalars["Int"]["input"];
  maxDegradedModeParserProjectSize: Scalars["Int"]["input"];
  maxExecTimeoutSecs: Scalars["Int"]["input"];
  maxGenerateTaskJSONSize: Scalars["Int"]["input"];
  maxHourlyPatchTasks: Scalars["Int"]["input"];
  maxIncludesPerVersion: Scalars["Int"]["input"];
  maxParserProjectSize: Scalars["Int"]["input"];
  maxPendingGeneratedTasks: Scalars["Int"]["input"];
  maxTaskExecution: Scalars["Int"]["input"];
  maxTasksPerVersion: Scalars["Int"]["input"];
};

export type TaskLogLinks = {
  __typename?: "TaskLogLinks";
  agentLogLink?: Maybe<Scalars["String"]["output"]>;
  allLogLink?: Maybe<Scalars["String"]["output"]>;
  systemLogLink?: Maybe<Scalars["String"]["output"]>;
  taskLogLink?: Maybe<Scalars["String"]["output"]>;
};

/**
 * TaskLogs is the return value for the task.taskLogs query.
 * It contains the logs for a given task on a given execution.
 */
export type TaskLogs = {
  __typename?: "TaskLogs";
  agentLogs: Array<LogMessage>;
  allLogs: Array<LogMessage>;
  eventLogs: Array<TaskEventLogEntry>;
  execution: Scalars["Int"]["output"];
  systemLogs: Array<LogMessage>;
  taskId: Scalars["String"]["output"];
  taskLogs: Array<LogMessage>;
};

/**
 * TaskOwnerTeam is the return value for the taskOwnerTeam query.
 * It is used to identify the team that owns a task. Based on the FWS team assignment.
 */
export type TaskOwnerTeam = {
  __typename?: "TaskOwnerTeam";
  assignmentType: Scalars["String"]["output"];
  jiraProject: Scalars["String"]["output"];
  messages: Scalars["String"]["output"];
  teamName: Scalars["String"]["output"];
};

export type TaskPriority = {
  priority: Scalars["Int"]["input"];
  taskId: Scalars["String"]["input"];
};

/**
 * TaskQueueDistro[] is the return value for the taskQueueDistros query.
 * It contains information about how many tasks and hosts are running on on a particular distro.
 */
export type TaskQueueDistro = {
  __typename?: "TaskQueueDistro";
  hostCount: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
  taskCount: Scalars["Int"]["output"];
};

/**
 * TaskQueueItem[] is the return value for the distroTaskQueue query.
 * It contains information about any particular item on the task queue, such as the name of the task, the build variant of the task,
 * and how long it's expected to take to finish running.
 */
export type TaskQueueItem = {
  __typename?: "TaskQueueItem";
  activatedBy: Scalars["String"]["output"];
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
  expectedDuration: Scalars["Duration"]["output"];
  id: Scalars["ID"]["output"];
  priority: Scalars["Int"]["output"];
  project: Scalars["String"]["output"];
  projectIdentifier?: Maybe<Scalars["String"]["output"]>;
  requester: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export enum TaskSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  Name = "NAME",
  Status = "STATUS",
  Variant = "VARIANT",
}

export type TaskSpecifier = {
  __typename?: "TaskSpecifier";
  patchAlias: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  variantRegex: Scalars["String"]["output"];
};

export type TaskSpecifierInput = {
  patchAlias: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  variantRegex: Scalars["String"]["input"];
};

export type TaskStats = {
  __typename?: "TaskStats";
  counts?: Maybe<Array<StatusCount>>;
  eta?: Maybe<Scalars["Time"]["output"]>;
};

/**
 * TaskTestResult is the return value for the task.Tests resolver.
 * It contains the test results for a task. For example, if there is a task to run all unit tests, then the test results
 * could be the result of each individual unit test.
 */
export type TaskTestResult = {
  __typename?: "TaskTestResult";
  filteredTestCount: Scalars["Int"]["output"];
  testResults: Array<TestResult>;
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TaskTestResultSample is the return value for the taskTestSample query.
 * It is used to represent failing test results on the task history pages.
 */
export type TaskTestResultSample = {
  __typename?: "TaskTestResultSample";
  execution: Scalars["Int"]["output"];
  matchingFailedTestNames: Array<Scalars["String"]["output"]>;
  taskId: Scalars["String"]["output"];
  totalTestCount: Scalars["Int"]["output"];
};

/**
 * TestFilter is an input value for the taskTestSample query.
 * It's used to filter for tests with testName and status testStatus.
 */
export type TestFilter = {
  testName: Scalars["String"]["input"];
  testStatus: Scalars["String"]["input"];
};

/**
 * TestFilterOptions is an input for the task.Tests query.
 * It's used to filter, sort, and paginate test results of a task.
 */
export type TestFilterOptions = {
  excludeDisplayNames?: InputMaybe<Scalars["Boolean"]["input"]>;
  groupID?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<TestSortOptions>>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  testName?: InputMaybe<Scalars["String"]["input"]>;
};

export type TestLog = {
  __typename?: "TestLog";
  lineNum?: Maybe<Scalars["Int"]["output"]>;
  renderingType?: Maybe<Scalars["String"]["output"]>;
  testName?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  urlParsley?: Maybe<Scalars["String"]["output"]>;
  urlRaw?: Maybe<Scalars["String"]["output"]>;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type TestResult = {
  __typename?: "TestResult";
  baseStatus?: Maybe<Scalars["String"]["output"]>;
  duration?: Maybe<Scalars["Float"]["output"]>;
  endTime?: Maybe<Scalars["Time"]["output"]>;
  execution?: Maybe<Scalars["Int"]["output"]>;
  exitCode?: Maybe<Scalars["Int"]["output"]>;
  groupID?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  logs: TestLog;
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskId?: Maybe<Scalars["String"]["output"]>;
  testFile: Scalars["String"]["output"];
};

export type TestSelectionConfig = {
  __typename?: "TestSelectionConfig";
  url: Scalars["String"]["output"];
};

export type TestSelectionConfigInput = {
  url: Scalars["String"]["input"];
};

export type TestSelectionSettings = {
  __typename?: "TestSelectionSettings";
  allowed?: Maybe<Scalars["Boolean"]["output"]>;
  defaultEnabled?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TestSelectionSettingsInput = {
  allowed?: InputMaybe<Scalars["Boolean"]["input"]>;
  defaultEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export enum TestSortCategory {
  BaseStatus = "BASE_STATUS",
  Duration = "DURATION",
  StartTime = "START_TIME",
  Status = "STATUS",
  TestName = "TEST_NAME",
}

/**
 * TestSortOptions is an input for the task.Tests query.
 * It's used to define sort criteria for test results of a task.
 */
export type TestSortOptions = {
  direction: SortDirection;
  sortBy: TestSortCategory;
};

export type TicketFields = {
  __typename?: "TicketFields";
  assignedTeam?: Maybe<Scalars["String"]["output"]>;
  assigneeDisplayName?: Maybe<Scalars["String"]["output"]>;
  created: Scalars["String"]["output"];
  resolutionName?: Maybe<Scalars["String"]["output"]>;
  status: JiraStatus;
  summary: Scalars["String"]["output"];
  updated: Scalars["String"]["output"];
};

export type Toolchain = {
  __typename?: "Toolchain";
  name: Scalars["String"]["output"];
  path: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export type ToolchainOpts = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
};

export type TracerSettings = {
  __typename?: "TracerSettings";
  collectorAPIKey?: Maybe<Scalars["String"]["output"]>;
  collectorEndpoint?: Maybe<Scalars["String"]["output"]>;
  collectorInternalEndpoint?: Maybe<Scalars["String"]["output"]>;
  enabled: Scalars["Boolean"]["output"];
};

export type TracerSettingsInput = {
  collectorAPIKey?: InputMaybe<Scalars["String"]["input"]>;
  collectorEndpoint?: InputMaybe<Scalars["String"]["input"]>;
  collectorInternalEndpoint?: InputMaybe<Scalars["String"]["input"]>;
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TriggerAlias = {
  __typename?: "TriggerAlias";
  alias: Scalars["String"]["output"];
  buildVariantRegex: Scalars["String"]["output"];
  configFile: Scalars["String"]["output"];
  dateCutoff?: Maybe<Scalars["Int"]["output"]>;
  level: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
  taskRegex: Scalars["String"]["output"];
  unscheduleDownstreamVersions?: Maybe<Scalars["Boolean"]["output"]>;
};

export type TriggerAliasInput = {
  alias: Scalars["String"]["input"];
  buildVariantRegex: Scalars["String"]["input"];
  configFile: Scalars["String"]["input"];
  dateCutoff?: InputMaybe<Scalars["Int"]["input"]>;
  level: Scalars["String"]["input"];
  project: Scalars["String"]["input"];
  status: Scalars["String"]["input"];
  taskRegex: Scalars["String"]["input"];
  unscheduleDownstreamVersions?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TriggerConfig = {
  __typename?: "TriggerConfig";
  generateTaskDistro?: Maybe<Scalars["String"]["output"]>;
};

export type TriggerConfigInput = {
  generateTaskDistro: Scalars["String"]["input"];
};

export type UiConfig = {
  __typename?: "UIConfig";
  betaFeatures: BetaFeatures;
  cacheTemplates?: Maybe<Scalars["Boolean"]["output"]>;
  corsOrigins: Array<Scalars["String"]["output"]>;
  csrfKey?: Maybe<Scalars["String"]["output"]>;
  defaultProject: Scalars["String"]["output"];
  fileStreamingContentTypes: Array<Scalars["String"]["output"]>;
  helpUrl?: Maybe<Scalars["String"]["output"]>;
  httpListenAddr?: Maybe<Scalars["String"]["output"]>;
  loginDomain?: Maybe<Scalars["String"]["output"]>;
  parsleyUrl?: Maybe<Scalars["String"]["output"]>;
  secret?: Maybe<Scalars["String"]["output"]>;
  stagingEnvironment?: Maybe<Scalars["String"]["output"]>;
  uiv2Url?: Maybe<Scalars["String"]["output"]>;
  url?: Maybe<Scalars["String"]["output"]>;
  userVoice?: Maybe<Scalars["String"]["output"]>;
};

export type UiConfigInput = {
  betaFeatures: BetaFeaturesInput;
  cacheTemplates: Scalars["Boolean"]["input"];
  corsOrigins: Array<Scalars["String"]["input"]>;
  csrfKey: Scalars["String"]["input"];
  defaultProject: Scalars["String"]["input"];
  fileStreamingContentTypes: Array<Scalars["String"]["input"]>;
  helpUrl: Scalars["String"]["input"];
  httpListenAddr: Scalars["String"]["input"];
  loginDomain: Scalars["String"]["input"];
  parsleyUrl: Scalars["String"]["input"];
  secret: Scalars["String"]["input"];
  stagingEnvironment: Scalars["String"]["input"];
  uiv2Url: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
  userVoice: Scalars["String"]["input"];
};

export type UpdateBetaFeaturesInput = {
  betaFeatures: BetaFeaturesInput;
};

export type UpdateBetaFeaturesPayload = {
  __typename?: "UpdateBetaFeaturesPayload";
  betaFeatures?: Maybe<BetaFeatures>;
};

export type UpdateParsleySettingsInput = {
  parsleySettings: ParsleySettingsInput;
};

export type UpdateParsleySettingsPayload = {
  __typename?: "UpdateParsleySettingsPayload";
  parsleySettings?: Maybe<ParsleySettings>;
};

export type UpdateSpawnHostStatusInput = {
  action: SpawnHostStatusActions;
  hostId: Scalars["String"]["input"];
  shouldKeepOff?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * UpdateVolumeInput is the input to the updateVolume mutation.
 * Its fields determine how a given volume will be modified.
 */
export type UpdateVolumeInput = {
  expiration?: InputMaybe<Scalars["Time"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  noExpiration?: InputMaybe<Scalars["Boolean"]["input"]>;
  size?: InputMaybe<Scalars["Int"]["input"]>;
  volumeId: Scalars["String"]["input"];
};

export type UpstreamProject = {
  __typename?: "UpstreamProject";
  owner: Scalars["String"]["output"];
  project: Scalars["String"]["output"];
  repo: Scalars["String"]["output"];
  resourceID: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  task?: Maybe<Task>;
  triggerID: Scalars["String"]["output"];
  triggerType: Scalars["String"]["output"];
  version?: Maybe<Version>;
};

export type UseSpruceOptions = {
  __typename?: "UseSpruceOptions";
  spruceV1?: Maybe<Scalars["Boolean"]["output"]>;
};

export type UseSpruceOptionsInput = {
  spruceV1?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type User = {
  __typename?: "User";
  betaFeatures?: Maybe<BetaFeatures>;
  displayName?: Maybe<Scalars["String"]["output"]>;
  emailAddress?: Maybe<Scalars["String"]["output"]>;
  parsleyFilters?: Maybe<Array<ParsleyFilter>>;
  parsleySettings?: Maybe<ParsleySettings>;
  patches?: Maybe<Patches>;
  permissions?: Maybe<Permissions>;
  settings?: Maybe<UserSettings>;
  subscriptions?: Maybe<Array<GeneralSubscription>>;
  userId: Scalars["String"]["output"];
};

/**
 * User is returned by the user query.
 * It contains information about a user's id, name, email, and permissions.
 */
export type UserPatchesArgs = {
  patchesInput: PatchesInput;
};

/**
 * UserConfig is returned by the userConfig query.
 * It contains configuration information such as the user's api key for the Evergreen CLI and a user's
 * preferred UI (legacy vs Spruce).
 */
export type UserConfig = {
  __typename?: "UserConfig";
  api_key: Scalars["String"]["output"];
  api_server_host: Scalars["String"]["output"];
  oauth_client_id: Scalars["String"]["output"];
  oauth_connector_id: Scalars["String"]["output"];
  oauth_issuer: Scalars["String"]["output"];
  ui_server_host: Scalars["String"]["output"];
  user: Scalars["String"]["output"];
};

export type UserServiceFlags = {
  __typename?: "UserServiceFlags";
  jwtTokenForCLIDisabled?: Maybe<Scalars["Boolean"]["output"]>;
};

/**
 * UserSettings is returned by the userSettings query.
 * It contains information about a user's settings, such as their GitHub username or timezone.
 */
export type UserSettings = {
  __typename?: "UserSettings";
  dateFormat?: Maybe<Scalars["String"]["output"]>;
  githubUser?: Maybe<GithubUser>;
  notifications?: Maybe<Notifications>;
  region?: Maybe<Scalars["String"]["output"]>;
  slackMemberId?: Maybe<Scalars["String"]["output"]>;
  slackUsername?: Maybe<Scalars["String"]["output"]>;
  timeFormat?: Maybe<Scalars["String"]["output"]>;
  timezone?: Maybe<Scalars["String"]["output"]>;
  useSpruceOptions?: Maybe<UseSpruceOptions>;
};

/**
 * UserSettingsInput is the input to the updateUserSettings mutation.
 * It is used to update user information such as GitHub or Slack username.
 */
export type UserSettingsInput = {
  dateFormat?: InputMaybe<Scalars["String"]["input"]>;
  githubUser?: InputMaybe<GithubUserInput>;
  notifications?: InputMaybe<NotificationsInput>;
  region?: InputMaybe<Scalars["String"]["input"]>;
  slackMemberId?: InputMaybe<Scalars["String"]["input"]>;
  slackUsername?: InputMaybe<Scalars["String"]["input"]>;
  timeFormat?: InputMaybe<Scalars["String"]["input"]>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
  useSpruceOptions?: InputMaybe<UseSpruceOptionsInput>;
};

export type VariantTask = {
  __typename?: "VariantTask";
  name: Scalars["String"]["output"];
  tasks: Array<Scalars["String"]["output"]>;
};

export type VariantTasks = {
  displayTasks: Array<DisplayTask>;
  tasks: Array<Scalars["String"]["input"]>;
  variant: Scalars["String"]["input"];
};

/** Version models a commit within a project. */
export type Version = {
  __typename?: "Version";
  activated?: Maybe<Scalars["Boolean"]["output"]>;
  author: Scalars["String"]["output"];
  authorEmail: Scalars["String"]["output"];
  baseTaskStatuses: Array<Scalars["String"]["output"]>;
  baseVersion?: Maybe<Version>;
  branch: Scalars["String"]["output"];
  buildVariantStats?: Maybe<Array<GroupedTaskStatusCount>>;
  buildVariants?: Maybe<Array<GroupedBuildVariant>>;
  childVersions?: Maybe<Array<Version>>;
  createTime: Scalars["Time"]["output"];
  errors: Array<Scalars["String"]["output"]>;
  externalLinksForMetadata: Array<ExternalLinkForMetadata>;
  finishTime?: Maybe<Scalars["Time"]["output"]>;
  generatedTaskCounts: Array<GeneratedTaskCountResults>;
  gitTags?: Maybe<Array<GitTag>>;
  id: Scalars["String"]["output"];
  ignored: Scalars["Boolean"]["output"];
  isPatch: Scalars["Boolean"]["output"];
  manifest?: Maybe<Manifest>;
  message: Scalars["String"]["output"];
  order: Scalars["Int"]["output"];
  parameters: Array<Parameter>;
  patch?: Maybe<Patch>;
  predictedCost?: Maybe<Cost>;
  previousVersion?: Maybe<Version>;
  project: Scalars["String"]["output"];
  projectIdentifier: Scalars["String"]["output"];
  projectMetadata?: Maybe<Project>;
  repo: Scalars["String"]["output"];
  requester: Scalars["String"]["output"];
  revision: Scalars["String"]["output"];
  startTime?: Maybe<Scalars["Time"]["output"]>;
  status: Scalars["String"]["output"];
  taskCount?: Maybe<Scalars["Int"]["output"]>;
  taskStatusStats?: Maybe<TaskStats>;
  taskStatuses: Array<Scalars["String"]["output"]>;
  tasks: VersionTasks;
  upstreamProject?: Maybe<UpstreamProject>;
  user: User;
  versionTiming?: Maybe<VersionTiming>;
  warnings: Array<Scalars["String"]["output"]>;
  waterfallBuilds?: Maybe<Array<WaterfallBuild>>;
};

/** Version models a commit within a project. */
export type VersionBuildVariantStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionBuildVariantsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTaskCountArgs = {
  options?: InputMaybe<TaskCountOptions>;
};

/** Version models a commit within a project. */
export type VersionTaskStatusStatsArgs = {
  options: BuildVariantOptions;
};

/** Version models a commit within a project. */
export type VersionTasksArgs = {
  options: TaskFilterOptions;
};

export type VersionTasks = {
  __typename?: "VersionTasks";
  count: Scalars["Int"]["output"];
  data: Array<Task>;
};

export type VersionTiming = {
  __typename?: "VersionTiming";
  makespan?: Maybe<Scalars["Duration"]["output"]>;
  timeTaken?: Maybe<Scalars["Duration"]["output"]>;
};

/**
 * VersionToRestart is the input to the restartVersions mutation.
 * It contains an array of taskIds to restart for a given versionId.
 */
export type VersionToRestart = {
  taskIds: Array<Scalars["String"]["input"]>;
  versionId: Scalars["String"]["input"];
};

export type Volume = {
  __typename?: "Volume";
  availabilityZone: Scalars["String"]["output"];
  createdBy: Scalars["String"]["output"];
  creationTime?: Maybe<Scalars["Time"]["output"]>;
  deviceName?: Maybe<Scalars["String"]["output"]>;
  displayName: Scalars["String"]["output"];
  expiration?: Maybe<Scalars["Time"]["output"]>;
  homeVolume: Scalars["Boolean"]["output"];
  host?: Maybe<Host>;
  hostID: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  migrating: Scalars["Boolean"]["output"];
  noExpiration: Scalars["Boolean"]["output"];
  size: Scalars["Int"]["output"];
  type: Scalars["String"]["output"];
};

/**
 * VolumeHost is the input to the attachVolumeToHost mutation.
 * Its fields are used to attach the volume with volumeId to the host with hostId.
 */
export type VolumeHost = {
  hostId: Scalars["String"]["input"];
  volumeId: Scalars["String"]["input"];
};

export type Waterfall = {
  __typename?: "Waterfall";
  flattenedVersions: Array<Version>;
  pagination: WaterfallPagination;
};

export type WaterfallBuild = {
  __typename?: "WaterfallBuild";
  activated: Scalars["Boolean"]["output"];
  buildVariant: Scalars["String"]["output"];
  displayName: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  tasks: Array<WaterfallTask>;
  version: Scalars["String"]["output"];
};

export type WaterfallBuildVariant = {
  __typename?: "WaterfallBuildVariant";
  builds: Array<WaterfallBuild>;
  displayName: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  version: Scalars["String"]["output"];
};

export type WaterfallOptions = {
  date?: InputMaybe<Scalars["Time"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  /** Return versions with an order lower than maxOrder. Used for paginating forward. */
  maxOrder?: InputMaybe<Scalars["Int"]["input"]>;
  /** Return versions with an order greater than minOrder. Used for paginating backward. */
  minOrder?: InputMaybe<Scalars["Int"]["input"]>;
  omitInactiveBuilds?: InputMaybe<Scalars["Boolean"]["input"]>;
  projectIdentifier: Scalars["String"]["input"];
  requesters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  revision?: InputMaybe<Scalars["String"]["input"]>;
  statuses?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Toggle case sensitivity when matching on task names. Note that if false, performance will be slower. */
  taskCaseSensitive?: InputMaybe<Scalars["Boolean"]["input"]>;
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** Toggle case sensitivity when matching on variant names. Note that if false, performance will be slower. */
  variantCaseSensitive?: InputMaybe<Scalars["Boolean"]["input"]>;
  variants?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type WaterfallPagination = {
  __typename?: "WaterfallPagination";
  activeVersionIds: Array<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPrevPage: Scalars["Boolean"]["output"];
  mostRecentVersionOrder: Scalars["Int"]["output"];
  nextPageOrder: Scalars["Int"]["output"];
  prevPageOrder: Scalars["Int"]["output"];
};

export type WaterfallTask = {
  __typename?: "WaterfallTask";
  displayName: Scalars["String"]["output"];
  displayStatusCache: Scalars["String"]["output"];
  execution: Scalars["Int"]["output"];
  id: Scalars["String"]["output"];
  status: Scalars["String"]["output"];
};

export type WaterfallVersion = {
  __typename?: "WaterfallVersion";
  inactiveVersions?: Maybe<Array<Version>>;
  version?: Maybe<Version>;
};

export type Webhook = {
  __typename?: "Webhook";
  endpoint: Scalars["String"]["output"];
  secret: Scalars["String"]["output"];
};

export type WebhookHeader = {
  __typename?: "WebhookHeader";
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type WebhookHeaderInput = {
  key: Scalars["String"]["input"];
  value: Scalars["String"]["input"];
};

export type WebhookInput = {
  endpoint: Scalars["String"]["input"];
  secret: Scalars["String"]["input"];
};

export type WebhookSubscriber = {
  __typename?: "WebhookSubscriber";
  headers: Array<WebhookHeader>;
  minDelayMs: Scalars["Int"]["output"];
  retries: Scalars["Int"]["output"];
  secret: Scalars["String"]["output"];
  timeoutMs: Scalars["Int"]["output"];
  url: Scalars["String"]["output"];
};

export type WebhookSubscriberInput = {
  headers: Array<WebhookHeaderInput>;
  minDelayMs?: InputMaybe<Scalars["Int"]["input"]>;
  retries?: InputMaybe<Scalars["Int"]["input"]>;
  secret: Scalars["String"]["input"];
  timeoutMs?: InputMaybe<Scalars["Int"]["input"]>;
  url: Scalars["String"]["input"];
};

export type WorkstationConfig = {
  __typename?: "WorkstationConfig";
  gitClone?: Maybe<Scalars["Boolean"]["output"]>;
  setupCommands?: Maybe<Array<WorkstationSetupCommand>>;
};

export type WorkstationConfigInput = {
  gitClone?: InputMaybe<Scalars["Boolean"]["input"]>;
  setupCommands?: InputMaybe<Array<WorkstationSetupCommandInput>>;
};

export type WorkstationSetupCommand = {
  __typename?: "WorkstationSetupCommand";
  command: Scalars["String"]["output"];
  directory: Scalars["String"]["output"];
};

export type WorkstationSetupCommandInput = {
  command: Scalars["String"]["input"];
  directory?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateUserBetaFeaturesMutationVariables = Exact<{
  opts: UpdateBetaFeaturesInput;
}>;

export type UpdateUserBetaFeaturesMutation = {
  __typename?: "Mutation";
  updateBetaFeatures?: {
    __typename?: "UpdateBetaFeaturesPayload";
    betaFeatures?: {
      __typename?: "BetaFeatures";
      parsleyAIEnabled?: boolean | null;
    } | null;
  } | null;
};

export type AdminBetaFeaturesQueryVariables = Exact<{ [key: string]: never }>;

export type AdminBetaFeaturesQuery = {
  __typename?: "Query";
  spruceConfig?: {
    __typename?: "SpruceConfig";
    ui: {
      __typename?: "UIConfig";
      betaFeatures: {
        __typename?: "BetaFeatures";
        parsleyAIEnabled?: boolean | null;
      };
    };
  } | null;
};

export type UserBetaFeaturesQueryVariables = Exact<{ [key: string]: never }>;

export type UserBetaFeaturesQuery = {
  __typename?: "Query";
  user: {
    __typename?: "User";
    userId: string;
    betaFeatures?: {
      __typename?: "BetaFeatures";
      parsleyAIEnabled?: boolean | null;
    } | null;
  };
};
