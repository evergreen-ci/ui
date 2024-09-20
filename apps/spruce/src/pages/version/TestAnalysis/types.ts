import { TestAnalysisQuery } from "gql/generated/types";

type TestAnalysisQueryTasks = TestAnalysisQuery["version"]["tasks"]["data"];
type TaskBuildVariantField = {
  taskName: string;
  buildVariant: string;
  id: string;
  status: string;
};

type GroupedTestMap = Map<string, TaskBuildVariantField[]>;

export type { TestAnalysisQueryTasks, TaskBuildVariantField, GroupedTestMap };
