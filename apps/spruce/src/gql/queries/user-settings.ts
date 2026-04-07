import { gql } from "@apollo/client";

export const USER_SETTINGS = gql`
  query UserSettings {
    user {
      settings {
        dateFormat
        githubUser {
          lastKnownAs
        }
        notifications {
          buildBreak
          patchFinish
          patchFirstFailure
          spawnHostExpiration
          spawnHostOutcome
        }
        region
        slackMemberId
        slackUsername
        timeFormat
        timezone
      }
      userId
    }
  }
`;
