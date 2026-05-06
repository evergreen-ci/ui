import { gql } from "@apollo/client";

export const BASE_HOST = gql`
  fragment BaseHost on Host {
    id
    hostUrl
    persistentDnsName
    provider
    startedBy
    status
    tag
    uptime
    user
  }
`;
