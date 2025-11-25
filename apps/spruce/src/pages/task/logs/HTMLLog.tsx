import { useMemo, useRef } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { ListSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useParams, useSearchParams } from "react-router-dom";
import { usePageVisibilityAnalytics } from "@evg-ui/lib/analytics/hooks/usePageVisibilityAnalytics";
import { constructEvergreenTaskLogURL } from "@evg-ui/lib/constants/logURLTemplates";
import { size } from "@evg-ui/lib/constants/tokens";
import { useHTMLLogStream } from "./useHTMLLogStream";
import { styles, validateTaskLogParams } from "./utils";

export const HTMLLog: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const containerRef = useRef<HTMLPreElement | null>(null);

  const execution = searchParams.get("execution");
  const origin = searchParams.get("origin");

  usePageVisibilityAnalytics({
    attributes: {
      execution: execution ?? "",
      origin: origin ?? "",
      taskId: taskId ?? "",
    },
    identifier: "HTMLLog",
  });

  const url = useMemo(() => {
    try {
      const params = validateTaskLogParams(taskId, execution, origin);
      return constructEvergreenTaskLogURL(
        params.taskId,
        params.execution,
        params.origin,
        {
          text: true,
          priority: true,
        },
      );
    } catch {
      return null;
    }
  }, [taskId, execution, origin]);

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
