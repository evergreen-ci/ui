import { gql } from "@apollo/client";

export const SINGLE_TASK_DISTRO = gql`
  query SingleTaskDistro {
    spruceConfig {
      singleTaskDistro {
        projectTasksPairs {
          allowedBVs
          allowedTasks
          projectId
        }
      }
    }
  }
`;
