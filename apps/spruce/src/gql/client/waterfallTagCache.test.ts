import { gql } from "@apollo/client";
import { cache } from "./cache";

const query = gql`
  query WaterfallTagCache($options: WaterfallOptions!) {
    waterfall(options: $options) {
      pagination {
        activeVersionIds
        hasNextPage
        mostRecentVersionOrder
      }
      versions {
        id
        order
      }
    }
  }
`;

describe("waterfall task tag cache", () => {
  beforeEach(() => cache.restore({}));
  afterEach(() => cache.restore({}));

  it("keeps matching versions separate when tags change or are cleared", () => {
    const variables = (taskTags: string[]) => ({
      options: { projectIdentifier: "spruce", limit: 1, taskTags },
    });
    const data = (activeVersionIds: string[]) => ({
      waterfall: {
        pagination: {
          activeVersionIds,
          hasNextPage: false,
          mostRecentVersionOrder: 1,
        },
        versions: [{ id: "version", order: 1 }],
      },
    });

    cache.writeQuery({
      query,
      variables: variables(["integration"]),
      data: data(["version"]),
    });
    cache.writeQuery({ query, variables: variables(["unit"]), data: data([]) });
    cache.writeQuery({
      query,
      variables: variables([]),
      data: data(["version"]),
    });

    expect(
      cache.readQuery({ query, variables: variables(["integration"]) }),
    ).toEqual(data(["version"]));
    expect(cache.readQuery({ query, variables: variables(["unit"]) })).toEqual(
      data([]),
    );
    expect(cache.readQuery({ query, variables: variables([]) })).toEqual(
      data(["version"]),
    );
  });
});
