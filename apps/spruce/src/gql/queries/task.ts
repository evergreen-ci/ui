import { gql } from "@apollo/client";
import { ANNOTATION } from "../fragments/annotation";
import { BASE_TASK } from "../fragments/baseTask";

export const TASK = gql`
  query Task($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      ...BaseTask
      aborted
      abortInfo {
        buildVariantDisplayName
        newVersion
        prClosed
        taskDisplayName
        taskID
        user
      }
      activatedBy
      activatedTime
      ami
      annotation {
        ...Annotation
      }
      baseTask {
        id
        displayStatus
        execution
        revision
        status
        timeTaken
        versionMetadata {
          id
          revision
        }
      }
      blocked
      buildId
      canAbort
      canDisable
      canModifyAnnotation
      canOverrideDependencies
      canRestart
      canSchedule
      canSetPriority
      canUnschedule
      dependsOn {
        buildVariant
        metStatus
        name
        requiredStatus
        taskId
      }
      details {
        description
        diskDevices
        failingCommand
        failureMetadataTags
        oomTracker {
          detected
          pids
        }
        otherFailingCommands {
          failureMetadataTags
          fullDisplayName
        }
        status
        timedOut
        timeoutType
        traceID
        type
      }
      displayOnly
      displayTask {
        id
        displayName
        execution
      }
      distroId
      errors
      estimatedStart
      executionTasksFull {
        ...BaseTask
        id
        buildVariant
        buildVariantDisplayName
        displayName
        displayStatus
        execution
        finishTime
        projectIdentifier
        reviewed @client
        startTime
      }
      expectedDuration
      files {
        fileCount
      }
      finishTime
      generatedBy
      generatedByName
      hostId
      imageId
      ingestTime
      invalidatedByUpstream
      latestExecution
      logs {
        agentLogLink
        allLogLink
        systemLogLink
        taskLogLink
      }
      minQueuePosition
      order
      patchNumber
      priority
      project {
        id
        identifier
        owner
        repo
        testSelection {
          allowed
        }
      }
      requester
      resetWhenFinished
      reviewed @client
      spawnHostLink
      startTime
      status
      stepbackInfo {
        lastFailingStepbackTaskId
        lastPassingStepbackTaskId
        nextStepbackTaskId
        previousStepbackTaskId
      }
      tags
      taskCost {
        adjustedEBSStorageCost
        adjustedEBSThroughputCost
        adjustedEC2Cost
        adjustedS3ArtifactPutCost
        adjustedS3ArtifactStorageCost
        adjustedS3LogPutCost
        adjustedS3LogStorageCost
        total
      }
      testSelectionEnabled
      timeTaken
      versionMetadata {
        id
        isPatch
        message
        order
        project
        projectIdentifier
        revision
        user {
          displayName
          userId
        }
      }
    }
  }
  ${BASE_TASK}
  ${ANNOTATION}
`;
