import { gql } from "@apollo/client";

export const HOST_EVENTS = gql`
  query HostEvents($id: String!, $opts: HostEventsInput!) {
    host(hostId: $id) {
      id
      events(opts: $opts) {
        count
        eventLogEntries {
          id
          data {
            agentBuild
            agentRevision
            duration
            execution
            hostname
            jasperRevision
            logs
            monitorOp
            newStatus
            oldStatus
            provisioningMethod
            successful
            taskId
            taskPid
            taskStatus
            user
          }
          eventType
          processedAt
          resourceId
          resourceType
          timestamp
        }
      }
      eventTypes
    }
  }
`;
