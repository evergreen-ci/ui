import { gql } from "@apollo/client";

const IMAGE_EVENTS = gql`
  query ImageEvents($imageId: String!, $limit: Int!, $page: Int!) {
    image(imageId: $imageId) {
      id
      events(limit: $limit, page: $page) {
        count
        eventLogEntries {
          amiAfter
          amiBefore
          entries {
            action
            after
            before
            name
            type
          }
          timestamp
        }
      }
    }
  }
`;

export default IMAGE_EVENTS;
