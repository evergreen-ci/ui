import { gql } from "@apollo/client";

const SINGLE_TASK_DISTRO = gql`
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

export default SINGLE_TASK_DISTRO;
