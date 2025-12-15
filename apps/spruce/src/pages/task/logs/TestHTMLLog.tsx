import { useMemo, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, useSearchParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { getEvergreenTestLogURL } from "@evg-ui/lib/constants/logURLTemplates";
import { size } from "@evg-ui/lib/constants/tokens";
import { styles } from "hooks/useHTMLStream/utils";
import { useHTMLLogStream } from "./useHTMLLogStream";
import { validateTestLogParams } from "./utils";

export const TestHTMLLog: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const execution = searchParams.get("execution");
  const testName = searchParams.get("testName");
  const groupId = searchParams.get("groupId");

  usePageVisibilityAnalytics({
    attributes: {
      execution: execution ?? "",
      groupId: groupId ?? "",
      taskId: taskId ?? "",
      testName: testName ?? "",
    },
  });

  const url = useMemo(() => {
    try {
      const params = validateTestLogParams(taskId, execution, testName);
      return getEvergreenTestLogURL(
        params.taskId,
        params.execution,
        params.testName,
        {
          text: true,
          groupID: groupId || undefined,
        },
      );
    } catch {
      return null;
    }
  }, [taskId, execution, testName, groupId]);

  const { error, isLoading } = useHTMLLogStream({
    url,
    containerRef,
  });

  if (error) {
    return (
      <Container>
        <div>Error loading log: {error.message}</div>
      </Container>
    );
  }

  return (
    <Container>
      {isLoading && <ListSkeleton />}
      <Global styles={styles} />
      <pre ref={containerRef} />
    </Container>
  );
};

const Container = styled.div`
  padding: ${size.m};
`;
