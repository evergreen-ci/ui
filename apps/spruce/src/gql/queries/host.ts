import { gql } from "@apollo/client";
import { BASE_HOST } from "../fragments/baseHost";

export const HOST = gql`
  query Host($id: String!) {
    host(hostId: $id) {
      ...BaseHost
      agentRevision
      ami
      distro {
        id
        bootstrapMethod
      }
      lastCommunicationTime
      runningTask {
        id
        name
      }
    }
  }
  ${BASE_HOST}
`;
