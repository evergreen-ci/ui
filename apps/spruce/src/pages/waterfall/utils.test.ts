import { buildVariants, versions } from "./testData";
import { Version } from "./types";
import { groupBuildVariants, groupInactiveVersions } from "./utils";

describe("groupInactiveVersions", () => {
  it("correctly groups inactive versions", () => {
    const res = groupInactiveVersions(versions, () => true);

    expect(res).toStrictEqual([
      {
        inactiveVersions: [versions[0]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[1],
      },
      {
        inactiveVersions: null,
        version: versions[2],
      },
      {
        inactiveVersions: [versions[3], versions[4]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[5],
      },
    ]);
  });

  it("correctly groups inactive versions when some do not appear in builds", () => {
    const res = groupInactiveVersions(versions, (v) => v.id !== "b");

    expect(res).toStrictEqual([
      {
        inactiveVersions: [versions[0], versions[1]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[2],
      },
      {
        inactiveVersions: [versions[3], versions[4]],
        version: null,
      },
      {
        inactiveVersions: null,
        version: versions[5],
      },
    ]);
  });
});

describe("groupBuildVariants", () => {
  it("correctly groups build variants from versions", () => {
    expect(groupBuildVariants(versions)).toStrictEqual(buildVariants);
  });

  it("sorts display names in an expected order", () => {
    const symbolVersions = [
      {
        activated: true,
        id: "version_1",
        waterfallBuilds: [
          {
            id: "id_a",
            buildVariant: "bv_a",
            displayName: "a",
          },
          {
            id: "id_b",
            buildVariant: "bv_b",
            displayName: "1",
          },
          {
            id: "id_c",
            buildVariant: "bv_c",
            displayName: "!",
          },
          {
            id: "id_d",
            buildVariant: "bv_d",
            displayName: "~",
          },
        ],
      },
    ] as Version[];
    expect(groupBuildVariants(symbolVersions)).toStrictEqual([
      {
        displayName: "!",
        id: "bv_c",
        builds: [
          {
            id: "id_c",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "1",
        id: "bv_b",
        builds: [
          {
            id: "id_b",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "a",
        id: "bv_a",
        builds: [
          {
            id: "id_a",
            tasks: [],
            version: "version_1",
          },
        ],
      },
      {
        displayName: "~",
        id: "bv_d",
        builds: [
          {
            id: "id_d",
            tasks: [],
            version: "version_1",
          },
        ],
      },
    ]);
  });
});
