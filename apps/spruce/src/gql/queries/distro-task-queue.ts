import { gql } from "@apollo/client";

const DISTRO_TASK_QUEUE = gql`
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

export default DISTRO_TASK_QUEUE;
