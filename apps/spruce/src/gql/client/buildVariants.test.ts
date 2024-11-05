import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import get from "lodash/get";
import { Requester } from "constants/requesters";
import {
  WaterfallBuild,
  WaterfallBuildVariant,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { mergeBuildVariants } from "./buildVariants";

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

const builds: WaterfallBuild[] = [
  {
    displayName: "Ubuntu 22.04",
    id: "build_101",
    version: "v_101",
    tasks: [
      {
        displayName: "task_101",
        id: "task_101",
        status: "succeeded",
        execution: 0,
      },
    ],
  },
  {
    displayName: "Ubuntu 22.04",
    id: "build_98",
    version: "v_98",
    tasks: [
      {
        displayName: "task_98",
        id: "task_98",
        status: "succeeded",
        execution: 0,
      },
    ],
  },
  {
    displayName: "Ubuntu 22.04",
    id: "build_97",
    version: "v_97",
    tasks: [
      {
        displayName: "task_97",
        id: "task_97",
        status: "succeeded",
        execution: 0,
      },
    ],
  },
];

describe("mergeBuildVariants", () => {
  it("merges incoming and existing build variants, omitting duplicates", () => {
    const existingBuildVariants: WaterfallBuildVariant[] = [
      {
        displayName: "Ubuntu 22.04",
        id: "ubuntu2204",
        version: "1",
        builds: builds.slice(0, 2),
      },
    ];

    const incomingBuildVariants: WaterfallBuildVariant[] = [
      {
        displayName: "Ubuntu 22.04",
        id: "ubuntu2204",
        version: "1",
        builds: builds.slice(1, 3),
      },
    ];

    const res = mergeBuildVariants({
      existingBuildVariants,
      incomingBuildVariants,
      readField,
      versions,
    });
    expect(res).toStrictEqual([
      {
        displayName: "Ubuntu 22.04",
        id: "ubuntu2204",
        version: "1",
        builds,
      },
    ]);
  });
});
