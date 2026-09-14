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
    expect(gqlToForm(taskDistroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, taskDistroData)).toStrictEqual(gql);
  });
});

const TARGET_TIME_MILLISECONDS = 180_000;
const TARGET_TIME_NANOSECONDS = TARGET_TIME_MILLISECONDS * 1_000_000;

const taskDistroData = {
  ...distroData!,
  plannerSettings: {
    ...distroData!.plannerSettings,
    targetTime: TARGET_TIME_MILLISECONDS,
    mergeQueueTargetTime: TARGET_TIME_MILLISECONDS,
  },
};

const form: TaskFormState = {
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  plannerSettings: {
    version: PlannerVersion.Tunable,
    tunableOptions: {
      targetTimeNanoseconds: TARGET_TIME_NANOSECONDS,
      mergeQueueTargetTimeNanoseconds: TARGET_TIME_NANOSECONDS,
      commitQueueFactor: 0,
      expectedRuntimeFactor: 0,
      generateTaskFactor: 5,
      mainlineTimeInQueueFactor: 0,
      numDependentsFactor: 50,
      patchFactor: 0,
      patchTimeInQueueFactor: 0,
      groupVersions: false,
    },
  },
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
};

const gql: DistroInput = {
  ...taskDistroData,
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
    targetTime: TARGET_TIME_MILLISECONDS,
    mergeQueueTargetTime: TARGET_TIME_MILLISECONDS,
    version: PlannerVersion.Tunable,
  },
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
};
