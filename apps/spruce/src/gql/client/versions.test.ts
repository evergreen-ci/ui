import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import get from "lodash/get";
import { Requester } from "constants/requesters";
import { WaterfallVersionFragment } from "gql/generated/types";
import { mergeVersions, readVersions } from "./versions";

// @ts-expect-error - readField function is hard to replicate, so just a
// barebones implementation.
const readField: ReadFieldFunction = <T>(key: string, obj: Object) => {
  const field = get(obj, key);
  return field as T;
};

const baseFields = {
  createTime: new Date(),
  errors: [],
  message: "",
  requester: Requester.Gitter,
  revision: "",
};

const versions: WaterfallVersionFragment[] = [
  {
    id: "v_101",
    author: "joe.smith",
    order: 101,
    activated: true,
    ...baseFields,
  },
  {
    id: "v_100",
    author: "joe.smith",
    order: 100,
    activated: false,
    ...baseFields,
  },
  {
    id: "v_99",
    author: "joe.smith",
    order: 99,
    activated: false,
    ...baseFields,
  },
  {
    id: "v_98",
    author: "jane.smith",
    order: 98,
    activated: true,
    ...baseFields,
  },
  {
    id: "v_97",
    author: "jane.smith",
    order: 97,
    activated: true,
    ...baseFields,
  },
];

describe("mergeVersions", () => {
  it("merges incoming and existing versions, omitting duplicates", () => {
    const existingVersions = versions.slice(0, 3);
    const incomingVersions = versions.slice(2, 5);

    const res = mergeVersions({
      existingVersions,

      incomingVersions,
      readField,
    });

    expect(res).toStrictEqual(versions);
  });
});

describe("readVersions", () => {
  it("reads existing versions correctly", () => {
    const maxOrderRes = readVersions({
      maxOrder: 101,
      versions,
      limit: 2,
      readField,
    });

    expect(maxOrderRes).toStrictEqual(versions.slice(1, 5));
    expect(maxOrderRes.map((m) => m.id)).toStrictEqual([
      "v_100",
      "v_99",
      "v_98",
      "v_97",
    ]);

    const minOrderRes = readVersions({
      minOrder: 97,
      versions,
      limit: 2,
      readField,
    });

    expect(minOrderRes).toStrictEqual(versions.slice(0, 4));
    expect(minOrderRes.map((m) => m.id)).toStrictEqual([
      "v_101",
      "v_100",
      "v_99",
      "v_98",
    ]);
  });
});
