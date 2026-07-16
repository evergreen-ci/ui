import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Host;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    arch,
    authorizedKeysFile,
    bootstrapSettings: {
      clientDir,
      communication,
      env,
      jasperBinaryDir,
      jasperCredentialsPath,
      method,
      preconditionScripts,
      resourceLimits,
      rootDir,
      serviceUser,
      shellPath,
    },
    execUser,
    homeVolumeSettings,
    hostAllocatorSettings,
    iceCreamSettings,
    isVirtualWorkStation,
    mountpoints,
    setup,
    setupAsSudo,
    sshOptions,
    user,
    userSpawnAllowed,
    workDir,
  } = data;

  const { acceptableHostIdleTime, ...hostAllocatorSettingsRest } =
    hostAllocatorSettings;

  return {
    allocation: {
      ...hostAllocatorSettingsRest,
      acceptableHostIdleTimeSeconds: acceptableHostIdleTime / 1000,
    },
    bootstrapSettings: {
      clientDir,
      env,
      homeVolumeFormatCommand: homeVolumeSettings.formatCommand,
      jasperBinaryDir,
      jasperCredentialsPath,
      preconditionScripts,
      resourceLimits,
      serviceUser,
      shellPath,
    },
    setup: {
      arch,
      bootstrapMethod: method,
      communicationMethod: communication,
      icecreamConfigPath: iceCreamSettings.configPath,
      icecreamSchedulerHost: iceCreamSettings.schedulerHost,
      isVirtualWorkStation,
      mountpoints: mountpoints ?? [],
      rootDir,
      setupAsSudo,
      setupScript: setup,
      userSpawnAllowed,
      workDir,
    },
    sshConfig: {
      authorizedKeysFile,
      execUser,
      sshOptions,
      user,
    },
  };
  // @ts-expect-error: FIXME. This comment was added by an automated script.
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((
  { allocation, bootstrapSettings, setup, sshConfig },
  distro,
) => {
  const { acceptableHostIdleTimeSeconds, ...hostAllocatorSettings } =
    allocation;
  return {
    ...(distro as NonNullable<typeof distro>),
    arch: setup.arch,
    authorizedKeysFile: sshConfig.authorizedKeysFile,
    bootstrapSettings: {
      clientDir: bootstrapSettings.clientDir,
      communication: setup.communicationMethod,
      env: bootstrapSettings.env,
      jasperBinaryDir: bootstrapSettings.jasperBinaryDir,
      jasperCredentialsPath: bootstrapSettings.jasperCredentialsPath,
      method: setup.bootstrapMethod,
      preconditionScripts: bootstrapSettings.preconditionScripts,
      resourceLimits: bootstrapSettings.resourceLimits,
      rootDir: setup.rootDir,
      serviceUser: bootstrapSettings.serviceUser,
      shellPath: bootstrapSettings.shellPath,
    },
    execUser: sshConfig.execUser,
    homeVolumeSettings: {
      formatCommand: bootstrapSettings.homeVolumeFormatCommand,
    },
    hostAllocatorSettings: {
      ...hostAllocatorSettings,
      acceptableHostIdleTime: acceptableHostIdleTimeSeconds * 1000,
    },
    iceCreamSettings: {
      configPath: setup.icecreamConfigPath,
      schedulerHost: setup.icecreamSchedulerHost,
    },
    isVirtualWorkStation: setup.isVirtualWorkStation,
    mountpoints: setup.mountpoints,
    setup: setup.setupScript,
    setupAsSudo: setup.setupAsSudo,
    sshOptions: sshConfig.sshOptions,
    user: sshConfig.user,
    userSpawnAllowed: setup.userSpawnAllowed,
    workDir: setup.workDir,
  };
}) satisfies FormToGqlFunction<Tab>;
