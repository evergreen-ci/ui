import {
  DispatcherVersion,
  DistroInput,
  FinderVersion,
  PlannerVersion,
} from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { TaskFormState } from "./types";

describe("task tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, distroData)).toStrictEqual(gql);
  });
});

const form: TaskFormState = {
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  plannerSettings: {
    tunableOptions: {
      commitQueueFactor: 0,
      expectedRuntimeFactor: 0,
      generateTaskFactor: 5,
      groupVersions: false,
      mainlineTimeInQueueFactor: 0,
      numDependentsFactor: 50,
      patchFactor: 0,
      patchTimeInQueueFactor: 0,
      targetTime: 0,
    },
    version: PlannerVersion.Tunable,
  },
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
const gql: DistroInput = {
  ...distroData,
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  plannerSettings: {
    commitQueueFactor: 0,
    expectedRuntimeFactor: 0,
    generateTaskFactor: 5,
    groupVersions: false,
    mainlineTimeInQueueFactor: 0,
    numDependentsFactor: 50,
    patchFactor: 0,
    patchTimeInQueueFactor: 0,
    targetTime: 0,
    version: PlannerVersion.Tunable,
  },
};
