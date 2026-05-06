import { gql } from "@apollo/client";

export const DISTRO_TASK_QUEUE = gql`
  query DistroTaskQueue($distroId: String!) {
    distroTaskQueue(distroId: $distroId) {
      id
      activatedBy
      buildVariant
      displayName
      expectedDuration
      priority
      project
      projectIdentifier
      requester
      version
    }
  }
`;
