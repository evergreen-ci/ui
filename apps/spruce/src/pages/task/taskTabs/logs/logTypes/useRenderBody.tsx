import { useEffect } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { size, fontSize } from "@evg-ui/lib/constants/tokens";
import { LogMessageLine } from "./LogMessageLine";
import { TaskEventLogLine } from "./TaskEventLogLine";
import { TaskEventLogEntryType, LogMessageType } from "./types";

const { gray } = palette;

interface UseRenderBodyProps {
  loading: boolean;
  error: ApolloError;
  data: (TaskEventLogEntryType | LogMessageType)[];
  LogContainer?: React.FC<{ children: React.ReactNode }>;
  setNoLogs: (noLogs: boolean) => void;
}

export const useRenderBody: React.FC<UseRenderBodyProps> = ({
  LogContainer = ({ children }) => <StyledPre>{children}</StyledPre>,
  data,
  error,
  loading,
  setNoLogs,
}) => {
  const noLogs = error !== undefined || data.length === 0;
  // Update the value of noLogs in the parent component.
  useEffect(() => {
    setNoLogs(noLogs);
  }, [setNoLogs, noLogs]);

  if (loading) {
    return <ParagraphSkeleton />;
  }
  if (noLogs) {
    return <div data-cy="cy-no-logs">No logs found</div>;
  }
  return (
    <LogContainer>
      {data.map((d, index) =>
        d.kind === "taskEventLogEntry" ? (
          <TaskEventLogLine
            key={`${d.resourceId}_${d.id}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ) : (
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          <LogMessageLine
            // @ts-expect-error: FIXME. This comment was added by an automated script.
            key={`${d.message}_${d.timestamp}_${index}`} // eslint-disable-line react/no-array-index-key
            {...d}
          />
        ),
      )}
    </LogContainer>
  );
};

const StyledPre = styled.pre`
  border: 1px solid ${gray.light2};
  border-radius: ${size.xxs};
  font-size: ${fontSize.m};
  overflow: scroll hidden;
  padding: ${size.xs};
`;
