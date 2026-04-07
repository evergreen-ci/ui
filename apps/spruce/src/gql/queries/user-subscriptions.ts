import { gql } from "@apollo/client";

const USER_SUBSCRIPTIONS = gql`
  query UserSubscriptions {
    user {
      settings {
        notifications {
          buildBreakId
          patchFinishId
          patchFirstFailureId
          spawnHostExpirationId
          spawnHostOutcomeId
        }
      }
      subscriptions {
        id
        ownerType
        regexSelectors {
          data
          type
        }
        resourceType
        selectors {
          data
          type
        }
        subscriber {
          subscriber {
            emailSubscriber
            jiraCommentSubscriber
            slackSubscriber
          }
          type
        }
        trigger
        triggerData
      }
      userId
    }
  }
`;

export default USER_SUBSCRIPTIONS;
