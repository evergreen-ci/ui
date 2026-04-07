import { gql } from "@apollo/client";

const POD = gql`
  query Pod($podId: String!) {
    pod(podId: $podId) {
      id
      status
      task {
        id
        displayName
        execution
      }
      taskContainerCreationOpts {
        arch
        cpu
        image
        memoryMB
        os
        workingDir
      }
      type
    }
  }
`;

export default POD;
