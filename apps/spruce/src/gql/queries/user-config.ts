import { gql } from "@apollo/client";

const USER_CONFIG = gql`
  query UserConfig {
    userConfig {
      api_key
      api_server_host
      oauth_client_id
      oauth_connector_id
      oauth_issuer
      ui_server_host
      user
    }
  }
`;

export default USER_CONFIG;
