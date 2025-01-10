import { TestAnalysisQuery } from "gql/generated/types";

type TestAnalysisQueryTasks = TestAnalysisQuery["version"]["tasks"]["data"];
type TaskBuildVariantField = {
  taskName: string;
  buildVariant: string;
  buildVariantDisplayName?: string | null;
  id: string;
  displayStatus: string;
  logs: {
    urlParsley: string;
  };
};

type GroupedTestMap = Map<string, TaskBuildVariantField[]>;

export type { TestAnalysisQueryTasks, TaskBuildVariantField, GroupedTestMap };
