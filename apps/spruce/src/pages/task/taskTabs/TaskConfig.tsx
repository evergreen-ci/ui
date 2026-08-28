import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { StyledLink } from "@evg-ui/lib/components/styles";
import {
  BaseTable,
  LGColumnDef,
  useLeafyGreenTable,
} from "@evg-ui/lib/components/Table";
import { PartialRecord } from "@evg-ui/lib/types/utils";
import { projectConfigFilesDocumentationUrl } from "constants/externalResources";
import {
  TaskConfig,
  TaskConfigQuery,
  TaskConfigQueryVariables,
} from "gql/generated/types";
import { TASK_CONFIG } from "gql/queries";
import { omitTypename } from "utils/object";

type ConfigRow = {
  key: string;
  value: string;
};

const columns: LGColumnDef<ConfigRow>[] = [
  {
    accessorKey: "key",
    header: "Field Name",
  },
  {
    accessorKey: "value",
    cell: ({ getValue }) => <pre>{getValue() as string}</pre>,
  },
];

export const TaskConfigTab = ({
  execution,
  taskId,
}: {
  execution: number;
  taskId: string;
}) => {
  const { data } = useQuery<TaskConfigQuery, TaskConfigQueryVariables>(
    TASK_CONFIG,
    {
      variables: {
        taskId,
        execution,
      },
    },
  );

  const tableData = useMemo(
    () =>
      Object.entries(omitTypename(data?.task?.config ?? {})).flatMap(
        ([key, value]) => {
          if (
            !isTaskConfigKey(key) ||
            !value ||
            (Array.isArray(value) && value.length === 0) ||
            tableLabels[key] === undefined
          ) {
            return [];
          }

          return [{ key: tableLabels[key], value: formatConfigValue(value) }];
        },
      ),
    [data?.task?.config],
  );

  const table = useLeafyGreenTable({
    columns,
    data: tableData ?? [],
  });

  return (
    <>
      The following config options were applied to the task when it was
      scheduled. See{" "}
      <StyledLink href={projectConfigFilesDocumentationUrl}>
        Project Configuration Files
      </StyledLink>{" "}
      for details.
      <BaseTable shouldAlternateRowColor table={table} />
    </>
  );
};

const tableLabels: PartialRecord<keyof TaskConfig, string> = {
  activate: "activate",
  allowForGitTag: "allow_for_git_tag",
  allowedRequesters: "allowed_requesters",
  batchTime: "batchtime",
  cronBatchTime: "cron",
  dependsOn: "depends_on",
  disable: "disable",
  execTimeoutSecs: "exec_timeout_secs",
  gitTagOnly: "git_tag_only",
  groupName: "task_group",
  patchOnly: "patch_only",
  patchable: "patchable",
  priority: "priority",
  ps: "ps",
  runOn: "run_on",
  stepback: "stepback",
};

const isTaskConfigKey = (key: string): key is keyof TaskConfig =>
  key in tableLabels;

const formatConfigValue = (value: unknown): string => {
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};
