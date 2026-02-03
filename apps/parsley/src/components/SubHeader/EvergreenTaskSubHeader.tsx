import { useQuery } from "@apollo/client/react";
import { InlineCode } from "@leafygreen-ui/typography";
import {
  Icon,
  StyledLink,
  TaskStatusBadge,
  TestStatusBadge,
} from "@evg-ui/lib/components";
import { usePageTitle } from "@evg-ui/lib/hooks";
import { TaskStatus } from "@evg-ui/lib/types";
import { shortenGithash, trimStringFromMiddle } from "@evg-ui/lib/utils";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import {
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { GET_TEST_LOG_URL_AND_RENDERING_TYPE } from "gql/queries";
import { useTaskQuery } from "hooks/useTaskQuery";

interface Props {
  buildID: string;
  execution: number;
  fileName?: string;
  groupID?: string;
  logType?: LogTypes;
  taskID: string;
  testID?: string;
}

export const EvergreenTaskSubHeader: React.FC<Props> = ({
  buildID,
  execution,
  fileName,
  groupID,
  logType,
  taskID,
  testID,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { loading: isLoadingTask, task: taskData } = useTaskQuery({
    buildID,
    execution,
    logType,
    taskID,
  });
  const { data: testData, loading: isLoadingTest } = useQuery<
    TestLogUrlAndRenderingTypeQuery,
    TestLogUrlAndRenderingTypeQueryVariables
  >(GET_TEST_LOG_URL_AND_RENDERING_TYPE, {
    skip: !(logType === LogTypes.EVERGREEN_TEST_LOGS && testID),
    variables: {
      execution,
      taskID,
      testName: `^${testID}$`,
    },
  });

  let currentTest: { testFile: string; status: string } | null = null;
  switch (logType) {
    case LogTypes.LOGKEEPER_LOGS:
      currentTest =
        taskData?.tests?.testResults?.find((test) =>
          test?.logs?.urlRaw?.match(new RegExp(`${testID}`)),
        ) ?? null;
      break;
    case LogTypes.EVERGREEN_TEST_LOGS:
      currentTest = testData?.task?.tests?.testResults?.[0] ?? null;
      break;
    default:
      currentTest = null;
  }
  let pageTitle = `Task logs for ${taskData?.displayName}`;
  if (currentTest) {
    pageTitle = `Test Logs for ${currentTest?.testFile}`;
  }
  usePageTitle(pageTitle);

  if (isLoadingTask || isLoadingTest || !taskData) {
    return (
      <>
        <Icon glyph="EvergreenLogo" size={24} />
        <StyledLink
          href={getEvergreenTaskURL(taskID, execution)}
          onClick={() => sendEvent({ name: "Clicked task link" })}
        >
          Task Page
        </StyledLink>
      </>
    );
  }
  const {
    displayName,
    displayStatus,
    execution: taskExecution,
    patchNumber,
    versionMetadata,
  } = taskData;

  const { isPatch, message, projectIdentifier, revision } = versionMetadata;

  const breadcrumbs = [
    {
      "data-cy": "project-breadcrumb",
      text: projectIdentifier,
    },
    {
      "data-cy": "version-breadcrumb",
      text: isPatch ? (
        `Patch ${patchNumber}`
      ) : (
        <InlineCode>{shortenGithash(revision)}</InlineCode>
      ),
      tooltipText: message,
    },
    {
      "data-cy": "task-breadcrumb",
      href: getEvergreenTaskURL(taskID, taskExecution),
      onClick: () => {
        sendEvent({ name: "Clicked task link" });
      },
      text: (
        <>
          {trimStringFromMiddle(displayName, 30)}{" "}
          <TaskStatusBadge status={displayStatus as TaskStatus} />
        </>
      ),
      tooltipText: displayName.length > 30 && displayName,
    },
    ...(testID
      ? [
          {
            "data-cy": "test-breadcrumb",
            text: (
              <>
                {trimStringFromMiddle(currentTest?.testFile ?? "Test", 80)}{" "}
                <TestStatusBadge status={currentTest?.status} />
              </>
            ),
            tooltipText:
              currentTest &&
              currentTest.testFile.length > 80 &&
              currentTest.testFile,
          },
        ]
      : []),
    ...(fileName
      ? [
          {
            "data-cy": "file-breadcrumb",
            text: fileName,
          },
        ]
      : []),
    ...(groupID
      ? [
          {
            "data-cy": "group-breadcrumb",
            text: groupID,
          },
        ]
      : []),
  ];

  return (
    <>
      <Icon glyph="EvergreenLogo" size={24} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </>
  );
};
