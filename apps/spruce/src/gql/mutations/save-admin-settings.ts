import { gql } from "@apollo/client";

const SAVE_ADMIN_SETTINGS = gql`
  mutation SaveAdminSettings($adminSettings: AdminSettingsInput!) {
    saveAdminSettings(adminSettings: $adminSettings) {
      api {
        corpUrl
        httpListenAddr
        url
      }
      banner
      bannerTheme
      cost {
        ebsCost {
          ebsDiscount
        }
        financeFormula
        onDemandDiscount
        s3Cost {
          storage {
            archiveStorageCostDiscount
            defaultMaxArtifactExpirationDays
            iAStorageCostDiscount
            standardStorageCostDiscount
          }
          upload {
            uploadCostDiscount
          }
        }
        savingsPlanDiscount
      }
      disabledGQLQueries
      hostInit {
        cloudStatusBatchSize
        hostThrottle
        maxTotalDynamicHosts
        provisioningThrottle
      }
      notify {
        ses {
          senderAddress
        }
      }
      repotracker {
        maxConcurrentRequests
        maxRepoRevisionsToSearch
        numNewRepoRevisionsToFetch
      }
      sage {
        baseUrl
      }
      scheduler {
        acceptableHostIdleTimeSeconds
        cacheDurationSeconds
        commitQueueFactor
        expectedRuntimeFactor
        futureHostFraction
        generateTaskFactor
        groupVersions
        hostAllocator
        hostAllocatorFeedbackRule
        hostAllocatorRoundingRule
        hostsOverallocatedRule
        mainlineTimeInQueueFactor
        numDependentsFactor
        patchFactor
        patchTimeInQueueFactor
        stepbackTaskFactor
        targetTimeSeconds
        taskFinder
      }
      taskLimits {
        maxConcurrentLargeParserProjectTasks
        maxDailyAutomaticRestarts
        maxDegradedModeConcurrentLargeParserProjectTasks
        maxDegradedModeParserProjectSize
        maxExecTimeoutSecs
        maxGenerateTaskJSONSize
        maxHourlyPatchTasks
        maxIncludesPerVersion
        maxParserProjectSize
        maxPendingGeneratedTasks
        maxTaskExecution
        maxTasksPerVersion
      }
      ui {
        betaFeatures {
          __typename
        }
        cacheTemplates
        corsOrigins
        csrfKey
        defaultProject
        fileStreamingContentTypes
        httpListenAddr
        loginDomain
        parsleyUrl
        secret
        stagingEnvironment
        uiv2Url
        url
        userVoice
      }
    }
  }
`;

export default SAVE_ADMIN_SETTINGS;
