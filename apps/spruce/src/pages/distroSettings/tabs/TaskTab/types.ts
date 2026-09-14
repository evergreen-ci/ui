import {
  DispatcherVersion,
  FinderVersion,
  PlannerVersion,
  Provider,
} from "gql/generated/types";

export interface TaskFormState {
  finderSettings: {
    version: FinderVersion;
  };
  plannerSettings: {
    version: PlannerVersion;
    tunableOptions: {
      commitQueueFactor: number;
      expectedRuntimeFactor: number;
      generateTaskFactor: number;
      groupVersions: boolean;
      mainlineTimeInQueueFactor: number;
      mergeQueueTargetTimeNanoseconds: number;
      numDependentsFactor: number;
      patchFactor: number;
      patchTimeInQueueFactor: number;
      targetTimeNanoseconds: number;
    };
  };
  dispatcherSettings: {
    version: DispatcherVersion;
  };
}

export type TabProps = {
  distroData: TaskFormState;
  provider: Provider;
};
