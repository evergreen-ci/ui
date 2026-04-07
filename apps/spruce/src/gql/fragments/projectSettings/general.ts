import { gql } from "@apollo/client";

export const PROJECT_GENERAL_SETTINGS = gql`
  fragment ProjectGeneralSettings on Project {
    id
    batchTime
    branch
    deactivatePrevious
    debugSpawnHostsDisabled
    disabledStatsCache
    dispatchingDisabled
    displayName
    enabled
    hidden
    owner
    patchingDisabled
    remotePath
    repo
    repotrackerDisabled
    spawnHostScriptPath
    stepbackBisect
    stepbackDisabled
    versionControlEnabled
  }
`;

export const REPO_GENERAL_SETTINGS = gql`
  fragment RepoGeneralSettings on RepoRef {
    id
    batchTime
    deactivatePrevious
    debugSpawnHostsDisabled
    disabledStatsCache
    dispatchingDisabled
    displayName
    owner
    patchingDisabled
    remotePath
    repo
    repotrackerDisabled
    spawnHostScriptPath
    stepbackBisect
    stepbackDisabled
    versionControlEnabled
  }
`;
