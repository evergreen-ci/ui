import { gql } from "@apollo/client";
import { UPSTREAM_PROJECT } from "../fragments/upstreamProject";

export const VERSION = gql`
  query Version($id: String!, $includeNeverActivatedTasks: Boolean) {
    version(versionId: $id) {
      ...UpstreamProject
      id
      activated
      baseVersion {
        id
      }
      cost {
        adjustedEBSStorageCost
        adjustedEBSThroughputCost
        adjustedEC2Cost
        adjustedS3ArtifactPutCost
        adjustedS3ArtifactStorageCost
        adjustedS3LogPutCost
        adjustedS3LogStorageCost
        onDemandEC2Cost
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
        childPatches {
          id
          githash
          parameters {
            key
            value
          }
          projectIdentifier
          status
          versionFull {
            id
            baseVersion {
              id
            }
            status
          }
        }
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
      predictedCost {
        adjustedEBSStorageCost
        adjustedEBSThroughputCost
        adjustedEC2Cost
        adjustedS3ArtifactPutCost
        adjustedS3ArtifactStorageCost
        adjustedS3LogPutCost
        adjustedS3LogStorageCost
        onDemandEC2Cost
        total
      }
      previousVersion {
        id
        revision
      }
      project
      projectIdentifier
      projectMetadata {
        id
        branch
        owner
        repo
      }
      repo
      requester
      revision
      startTime
      status
      taskCount(
        options: { includeNeverActivatedTasks: $includeNeverActivatedTasks }
      )
      user {
        displayName
        userId
      }
      versionTiming {
        makespan
        timeTaken
      }
      warnings
    }
  }
  ${UPSTREAM_PROJECT}
`;
