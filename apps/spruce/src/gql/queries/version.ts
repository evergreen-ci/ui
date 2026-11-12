import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT_HASH } from "../fragments/upstreamProjectHash";

export const VERSION = gql`
  query Version($id: String!) {
    version(versionId: $id) {
      ...UpstreamProjectHash
      id
      activated
      baseVersion {
        id
      }
      childVersions {
        id
        baseVersion {
          id
        }
        parameters {
          key
          value
        }
        projectMetadata {
          id
          identifier
        }
        revision
        status
        taskCount
      }
      cost {
        adjustedEBSStorageCost
        adjustedEBSThroughputCost
        adjustedEC2Cost
        adjustedS3ArtifactPutCost
        adjustedS3ArtifactStorageCost
        adjustedS3LogPutCost
        adjustedS3LogStorageCost
        childPatchesTotalCost
        total
      }
      createTime
      errors
      externalLinksForMetadata {
        displayName
        url
      }
      finishTime
      gitTags {
        pusher
        tag
      }
      ignored
      isPatch
      manifest {
        id
        branch
        isBase
        moduleOverrides
        modules
        project
        revision
      }
      message
      order
      parameters {
        key
        value
      }
      patch {
        id
        alias
        githubPatchData {
          headHash
          prNumber
        }
        includedLocalModules {
          fileName
          module
        }
        patchNumber
      }
      previousVersion {
        ...UpstreamProjectHash
        id
        revision
      }
      projectMetadata {
        id
        branch
        identifier
        owner
        repo
        testSelection {
          allowed
        }
      }
      quarantinedTestsSkippedCount
      repo
      requester
      revision
      startTime
      status
      user {
        displayName
        userId: id
      }
      versionTiming {
        makespan
        timeTaken
      }
      warnings
    }
  }
  ${UPSTREAM_PROJECT_HASH}
`;
