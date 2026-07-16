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
          projectMetadata {
            id
            identifier
          }
          status
          taskCount
          version {
            id
            baseVersion {
              id
            }
            status
          }
        }
        cost {
          childPatchesTotalCost
          total
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
      previousVersion {
        id
        revision
      }
      projectMetadata {
        id
        branch
        identifier
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
      user: userLite {
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
  ${UPSTREAM_PROJECT}
`;
